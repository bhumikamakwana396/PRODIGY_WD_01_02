"use client";

import { useEffect, useState } from "react";

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  department: string;
  salary: number;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    salary: "",
  });

  // GET employees
  const loadEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8081/employees");

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ADD
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      setForm({
        firstname: "",
        lastname: "",
        email: "",
        department: "",
        salary: "",
      });

      setShowAdd(false);
      loadEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to add employee");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8081/employees/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      loadEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  // OPEN EDIT
  const openEdit = (employee: Employee) => {
    setSelectedEmployee(employee);

    setForm({
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      department: employee.department,
      salary: employee.salary.toString(),
    });

    setShowEdit(true);
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) return;

    try {
      const response = await fetch(
        `http://localhost:8081/employees/${selectedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            salary: Number(form.salary),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      setShowEdit(false);
      setSelectedEmployee(null);

      loadEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to update employee");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employees
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your employees
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Add Employee
        </button>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-purple-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Department</th>
              <th className="text-left p-4">Salary</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-8 text-gray-500"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      {/* EMAIL FIRST LETTER */}
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-700 font-bold">
                          {employee.email
                            ?.charAt(0)
                            .toUpperCase() || "A"}
                        </span>
                      </div>

                      <span className="font-medium">
                        {employee.firstname} {employee.lastname}
                      </span>

                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    {employee.email}
                  </td>

                  <td className="p-4">
                    {employee.department}
                  </td>

                  <td className="p-4">
                    ₹{employee.salary}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      {/* VIEW */}
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowView(true);
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        View
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => openEdit(employee)}
                        className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(employee.id)}
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

      {/* ================= ADD MODAL ================= */}

      {showAdd && (
        <Modal title="Add Employee" onClose={() => setShowAdd(false)}>

          <form onSubmit={handleAdd} className="space-y-4">

            <Input
              label="First Name"
              value={form.firstname}
              onChange={(e) =>
                setForm({
                  ...form,
                  firstname: e.target.value,
                })
              }
            />

            <Input
              label="Last Name"
              value={form.lastname}
              onChange={(e) =>
                setForm({
                  ...form,
                  lastname: e.target.value,
                })
              }
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <Input
              label="Department"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
            />

            <Input
              label="Salary"
              type="number"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  ...form,
                  salary: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
            >
              Add Employee
            </button>

          </form>

        </Modal>
      )}

      {/* ================= VIEW MODAL ================= */}

      {showView && selectedEmployee && (
        <Modal
          title="Employee Details"
          onClose={() => setShowView(false)}
        >

          <div className="space-y-4">

            <Detail
              label="First Name"
              value={selectedEmployee.firstname}
            />

            <Detail
              label="Last Name"
              value={selectedEmployee.lastname}
            />

            <Detail
              label="Email"
              value={selectedEmployee.email}
            />

            <Detail
              label="Department"
              value={selectedEmployee.department}
            />

            <Detail
              label="Salary"
              value={`₹${selectedEmployee.salary}`}
            />

          </div>

        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}

      {showEdit && selectedEmployee && (
        <Modal
          title="Edit Employee"
          onClose={() => setShowEdit(false)}
        >

          <form onSubmit={handleUpdate} className="space-y-4">

            <Input
              label="First Name"
              value={form.firstname}
              onChange={(e) =>
                setForm({
                  ...form,
                  firstname: e.target.value,
                })
              }
            />

            <Input
              label="Last Name"
              value={form.lastname}
              onChange={(e) =>
                setForm({
                  ...form,
                  lastname: e.target.value,
                })
              }
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <Input
              label="Department"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
            />

            <Input
              label="Salary"
              type="number"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  ...form,
                  salary: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
            >
              Update Employee
            </button>

          </form>

        </Modal>
      )}

    </div>
  );
}


/* ================= MODAL ================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}


/* ================= INPUT ================= */

function Input({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
      />

    </div>
  );
}


/* ================= DETAIL ================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b pb-3">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold text-gray-800 mt-1">
        {value}
      </p>

    </div>
  );
}