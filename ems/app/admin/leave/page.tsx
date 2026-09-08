"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

interface Leave {
  id?: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
}

const API = "http://localhost:8081";

export default function LeavePage() {
  const router = useRouter();

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const [form, setForm] = useState<Leave>({
    employeeId: "",
    employeeName: "",
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
    status: "Pending",
  });

  // ================= LOAD DATA =================

  useEffect(() => {
    loadLeaves();
    loadEmployees();
  }, []);

  const loadLeaves = async () => {
    try {
      const response = await fetch(`${API}/leaves`);

      if (!response.ok) {
        throw new Error("Failed to load leaves");
      }

      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error("Leave loading error:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API}/employees`);

      if (!response.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Employee loading error:", error);
    }
  };

  // ================= FORM =================

  const handleEmployeeChange = (
    employeeId: string
  ) => {
    const employee = employees.find(
      (emp) => emp.id === employeeId
    );

    setForm({
      ...form,
      employeeId,
      employeeName: employee
        ? `${employee.firstname} ${employee.lastname}`
        : "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD =================

  const openAddModal = () => {
    setEditingLeave(null);

    setForm({
      employeeId: "",
      employeeName: "",
      leaveType: "Casual Leave",
      startDate: "",
      endDate: "",
      reason: "",
      status: "Pending",
    });

    setShowModal(true);
  };

  // ================= EDIT =================

  const openEditModal = (leave: Leave) => {
    setEditingLeave(leave);

    setForm({
      employeeId: leave.employeeId,
      employeeName: leave.employeeName,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
    });

    setShowModal(true);
  };

  // ================= SAVE =================

  const saveLeave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.employeeId ||
      !form.startDate ||
      !form.endDate ||
      !form.reason
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const url = editingLeave?.id
        ? `${API}/leaves/${editingLeave.id}`
        : `${API}/leaves`;

      const method = editingLeave?.id
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save leave");
      }

      setShowModal(false);

      await loadLeaves();

      alert(
        editingLeave
          ? "Leave updated successfully!"
          : "Leave added successfully!"
      );
    } catch (error) {
      console.error("Save leave error:", error);
      alert("Something went wrong.");
    }
  };

  // ================= DELETE =================

  const deleteLeave = async () => {
    if (!selectedLeave?.id) return;

    try {
      const response = await fetch(
        `${API}/leaves/${selectedLeave.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete leave");
      }

      setShowDelete(false);
      setSelectedLeave(null);

      await loadLeaves();

      alert("Leave deleted successfully!");
    } catch (error) {
      console.error("Delete leave error:", error);
      alert("Unable to delete leave.");
    }
  };

  // ================= APPROVE =================

  const updateStatus = async (
    leave: Leave,
    status: string
  ) => {
    if (!leave.id) return;

    try {
      const updatedLeave = {
        ...leave,
        status,
      };

      const response = await fetch(
        `${API}/leaves/${leave.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLeave),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await loadLeaves();

      alert(`Leave ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Status update error:", error);
      alert("Unable to update leave status.");
    }
  };

  // ================= SEARCH =================

  const filteredLeaves = leaves.filter((leave) =>
    `${leave.employeeName} ${leave.leaveType} ${leave.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= COUNTS =================

  const totalLeaves = leaves.length;

  const pendingLeaves = leaves.filter(
    (leave) =>
      leave.status?.toLowerCase() === "pending"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) =>
      leave.status?.toLowerCase() === "approved"
  ).length;

  const rejectedLeaves = leaves.filter(
    (leave) =>
      leave.status?.toLowerCase() === "rejected"
  ).length;

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">

          <button
            onClick={() => router.push("/admin")}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Leave Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage employee leave requests
            </p>
          </div>

        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
          <Plus size={20} />
          Add Leave
        </button>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Total Leaves
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalLeaves}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {pendingLeaves}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Approved
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {approvedLeaves}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">
            Rejected
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {rejectedLeaves}
          </h2>
        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">

        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search employee, leave type or status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">

        <table className="w-full min-w-[900px]">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Employee
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Leave Type
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Start Date
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                End Date
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredLeaves.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  <CalendarDays
                    size={40}
                    className="mx-auto mb-3 text-gray-300"
                  />

                  No leave records found.
                </td>

              </tr>

            ) : (

              filteredLeaves.map((leave) => (

                <tr
                  key={leave.id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* EMPLOYEE */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

                        <span className="font-bold text-purple-600">
                          {leave.employeeName
                            ?.charAt(0)
                            .toUpperCase()}
                        </span>

                      </div>

                      <span className="font-medium text-gray-800">
                        {leave.employeeName}
                      </span>

                    </div>

                  </td>

                  {/* TYPE */}

                  <td className="px-6 py-4 text-gray-600">
                    {leave.leaveType}
                  </td>

                  {/* START */}

                  <td className="px-6 py-4 text-gray-600">
                    {leave.startDate}
                  </td>

                  {/* END */}

                  <td className="px-6 py-4 text-gray-600">
                    {leave.endDate}
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      `}
                    >
                      {leave.status}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">

                    <div className="flex items-center justify-center gap-2">

                      {/* VIEW */}

                      <button
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowView(true);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          openEditModal(leave)
                        }
                        className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      {/* APPROVE */}

                      {leave.status === "Pending" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              leave,
                              "Approved"
                            )
                          }
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                          title="Approve"
                        >
                          <Check size={17} />
                        </button>
                      )}

                      {/* REJECT */}

                      {leave.status === "Pending" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              leave,
                              "Rejected"
                            )
                          }
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Reject"
                        >
                          <X size={17} />
                        </button>
                      )}

                      {/* DELETE */}

                      <button
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowDelete(true);
                        }}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ================= ADD / EDIT MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold text-gray-900">
                {editingLeave
                  ? "Edit Leave"
                  : "Add Leave"}
              </h2>

            </div>

            <form
              onSubmit={saveLeave}
              className="p-6 space-y-4"
            >

              {/* EMPLOYEE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Employee
                </label>

                <select
                  value={form.employeeId}
                  onChange={(e) =>
                    handleEmployeeChange(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                  required
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

              {/* LEAVE TYPE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Leave Type
                </label>

                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                >

                  <option value="Casual Leave">
                    Casual Leave
                  </option>

                  <option value="Sick Leave">
                    Sick Leave
                  </option>

                  <option value="Annual Leave">
                    Annual Leave
                  </option>

                  <option value="Emergency Leave">
                    Emergency Leave
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* DATES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />

                </div>

              </div>

              {/* REASON */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter leave reason"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />

              </div>

              {/* STATUS */}

              {editingLeave && (

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Approved">
                      Approved
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                  </select>

                </div>

              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-5 py-2.5 rounded-xl border hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                >
                  {editingLeave
                    ? "Update Leave"
                    : "Add Leave"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= VIEW MODAL ================= */}

      {showView && selectedLeave && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

            <div className="p-6 border-b flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Leave Details
              </h2>

              <button
                onClick={() =>
                  setShowView(false)
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-6 space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Employee
                </p>
                <p className="font-semibold">
                  {selectedLeave.employeeName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Leave Type
                </p>
                <p className="font-semibold">
                  {selectedLeave.leaveType}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Start Date
                  </p>
                  <p className="font-semibold">
                    {selectedLeave.startDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    End Date
                  </p>
                  <p className="font-semibold">
                    {selectedLeave.endDate}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Reason
                </p>
                <p className="font-semibold">
                  {selectedLeave.reason}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                  {selectedLeave.status}
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ================= DELETE MODAL ================= */}

      {showDelete && selectedLeave && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">

            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">

              <Trash2
                className="text-red-600"
                size={24}
              />

            </div>

            <h2 className="text-xl font-bold text-center">
              Delete Leave?
            </h2>

            <p className="text-gray-500 text-center mt-2">
              Are you sure you want to delete this
              leave request?
            </p>

            <div className="flex justify-center gap-3 mt-6">

              <button
                onClick={() =>
                  setShowDelete(false)
                }
                className="px-5 py-2.5 rounded-xl border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteLeave}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}