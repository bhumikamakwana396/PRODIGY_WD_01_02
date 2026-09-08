"use client";

import { useEffect, useState } from "react";

interface Department {
  id: string;
  name: string;
  description: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // GET ALL DEPARTMENTS
  const loadDepartments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/departments"
      );

      if (!response.ok) {
        throw new Error("Failed to load departments");
      }

      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editId
        ? `http://localhost:8081/departments/${editId}`
        : "http://localhost:8081/departments";

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      setForm({
        name: "",
        description: "",
      });

      setEditId(null);
      setShowForm(false);

      loadDepartments();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/departments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      loadDepartments();
    } catch (error) {
      console.error(error);
      alert("Failed to delete department");
    }
  };

  // EDIT
  const handleEdit = (department: Department) => {
    setEditId(department.id);

    setForm({
      name: department.name,
      description: department.description,
    });

    setShowForm(true);
  };

  // CANCEL
  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);

    setForm({
      name: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Departments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your company departments
          </p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setForm({
              name: "",
              description: "",
            });
            setShowForm(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Add Department
        </button>

      </div>

      {/* DEPARTMENT CARDS */}

      {departments.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Departments Found
          </h2>

          <p className="text-gray-500 mt-2">
            Add your first department.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {departments.map((department) => (

            <div
              key={department.id}
              className="bg-white rounded-xl shadow p-6 border border-gray-100"
            >

              {/* ICON */}

              <div className="flex items-center justify-between mb-5">

                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-700 font-bold text-xl">
                    {department.name
                      ?.charAt(0)
                      .toUpperCase() || "D"}
                  </span>
                </div>

                <span className="text-sm text-gray-400">
                  Department
                </span>

              </div>

              {/* NAME */}

              <h2 className="text-xl font-bold text-gray-800">
                {department.name}
              </h2>

              {/* DESCRIPTION */}

              <p className="text-gray-500 mt-2 min-h-[48px]">
                {department.description ||
                  "No description available"}
              </p>

              {/* ACTIONS */}

              <div className="flex gap-2 mt-6">

                <button
                  onClick={() => handleEdit(department)}
                  className="flex-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 py-2 rounded-lg font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(department.id)}
                  className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-lg font-medium"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                {editId
                  ? "Update Department"
                  : "Add Department"}
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

              {/* NAME */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>

                <input
                  type="text"
                  placeholder="Enter department name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  placeholder="Enter department description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                    ? "Update Department"
                    : "Add Department"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}