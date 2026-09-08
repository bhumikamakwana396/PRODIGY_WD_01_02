"use client";

import { useEffect, useState } from "react";

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: string;
}

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  // ================= GET ATTENDANCE =================

  const loadAttendance = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/attendance"
      );

      if (!response.ok) {
        throw new Error("Failed to load attendance");
      }

      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= GET EMPLOYEES =================

  const loadEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/employees"
      );

      if (!response.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAttendance();
    loadEmployees();
  }, []);

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employee = employees.find(
      (emp) => emp.id === form.employeeId
    );

    if (!employee) {
      alert("Please select an employee");
      return;
    }

    const employeeName =
      `${employee.firstname} ${employee.lastname}`;

    const requestData = {
      employeeId: form.employeeId,
      employeeName,
      date: form.date,
      status: form.status,
    };

    try {
      const url = editId
        ? `http://localhost:8081/attendance/${editId}`
        : "http://localhost:8081/attendance";

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      setForm({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      });

      setEditId(null);
      setShowForm(false);

      loadAttendance();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ================= EDIT =================

  const handleEdit = (item: Attendance) => {
    setEditId(item.id);

    setForm({
      employeeId: item.employeeId,
      date: item.date,
      status: item.status,
    });

    setShowForm(true);
  };

  // ================= DELETE =================

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attendance?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/attendance/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      loadAttendance();
    } catch (error) {
      console.error(error);
      alert("Failed to delete attendance");
    }
  };

  // ================= CANCEL =================

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);

    setForm({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    });
  };

  // ================= SEARCH =================

  const filteredAttendance = attendance.filter((item) =>
    item.employeeName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance
          </h1>

          <p className="text-gray-500 mt-1">
            Manage employee attendance
          </p>
        </div>

        <button
          onClick={() => {
            setEditId(null);

            setForm({
              employeeId: "",
              date: new Date()
                .toISOString()
                .split("T")[0],
              status: "Present",
            });

            setShowForm(true);
          }}
          className="bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Mark Attendance
        </button>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Total Records
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {attendance.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Present
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              attendance.filter(
                (item) => item.status === "Present"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Absent
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {
              attendance.filter(
                (item) => item.status === "Absent"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-purple-50">

            <tr>
              <th className="text-left p-4">
                Employee
              </th>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredAttendance.length === 0 ? (

              <tr>
                <td
                  colSpan={4}
                  className="text-center p-10 text-gray-500"
                >
                  No attendance records found
                </td>
              </tr>

            ) : (

              filteredAttendance.map((item) => (

                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* EMPLOYEE */}

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

                        <span className="text-purple-700 font-bold">
                          {item.employeeName
                            ?.charAt(0)
                            .toUpperCase() || "E"}
                        </span>

                      </div>

                      <span className="font-medium">
                        {item.employeeName}
                      </span>

                    </div>

                  </td>

                  {/* DATE */}

                  <td className="p-4 text-gray-600">
                    {item.date}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    {item.status === "Present" && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        Present
                      </span>
                    )}

                    {item.status === "Absent" && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                        Absent
                      </span>
                    )}

                    {item.status === "Leave" && (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        Leave
                      </span>
                    )}

                  </td>

                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}

      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                {editId
                  ? "Update Attendance"
                  : "Mark Attendance"}
              </h2>

              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMPLOYEE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee
                </label>

                <select
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      employeeId: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                >

                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((employee) => (

                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.firstname}{" "}
                      {employee.lastname}
                    </option>

                  ))}

                </select>

              </div>

              {/* DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />

              </div>

              {/* STATUS */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                >

                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Leave">
                    Leave
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                >
                  {editId
                    ? "Update Attendance"
                    : "Mark Attendance"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}