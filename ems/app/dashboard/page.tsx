"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  CalendarCheck,
  ClipboardList,
  Wallet,
  Building2,
  LogOut,
} from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    // ADMIN cannot access employee dashboard
    if (loggedUser.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    setUser(loggedUser);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative
          z-40
          w-64
          min-h-screen
          bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900
          text-white
          p-5
          shadow-2xl
          transition-transform duration-300
          ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        <h1 className="text-2xl font-bold mb-8">
          EMS
        </h1>
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
              <span className="text-purple-700 font-bold text-lg">
                {user.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-white truncate">
                {user.firstname} {user.lastname}
              </p>

              <p className="text-xs text-white/75 truncate">
                {user.email}
              </p>
            </div>

          </div>
        </div>

        <nav className="space-y-2">

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/15"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/15"
          >
            <UserCircle size={20} />
            My Profile
          </button>

          <button
            onClick={() => router.push("/attendance")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/15"
          >
            <CalendarCheck size={20} />
            My Attendance
          </button>

          <button
            onClick={() => router.push("/leave")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/15"
          >
            <ClipboardList size={20} />
            My Leave
          </button>

          <button
            onClick={() => router.push("/payroll")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/15"
          >
            <Wallet size={20} />
            My Payroll
          </button>

          <button
            onClick={() => router.push("/department")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/15"
          >
            <Building2 size={20} />
            My Department
          </button>

        </nav>

        <div className="absolute left-5 right-5">

          <button
            onClick={logout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              bg-white/15
              hover:bg-red-500/80
              text-white
              transition
              duration-200
            "
          >
            <LogOut size={20} className="text-white" />

            <span className="font-medium text-white">
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-100">

        <div className="mb-8">

          <h2 className="text-purple-600 text-3xl font-bold">
            Welcome back, {user.firstname} 👋
          </h2>

          <p className="text-gray-500 mt-1">
            Welcome to your employee dashboard.
          </p>

        </div>

        {/* Employee Information */}
        <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200 mb-8">

          <h3 className="text-xl font-bold mb-5">
            My Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">

            <div>
              <p className="text-gray-500 text-sm">
                First Name
              </p>
              <p className="font-semibold">
                {user.firstname}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Last Name
              </p>
              <p className="font-semibold">
                {user.lastname}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Email
              </p>
              <p className="font-semibold">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Role
              </p>
              <p className="font-semibold">
                {user.role}
              </p>
            </div>

          </div>

        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <CalendarCheck className="text-blue-600 size={30}" />

            <p className="text-gray-500 mt-3">
              Attendance
            </p>

            <h3 className="text-2xl font-bold">
              24 Days
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <ClipboardList className="text-purple-600" size={30} />

            <p className="text-gray-500 mt-3">
              Leave Balance
            </p>

            <h3 className="text-2xl font-bold">
              12 Days
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 ">
            <Building2 className="text-pink-600 size={30}" />

            <p className="text-gray-500 mt-3">
              Department
            </p>

            <h3 className="text-2xl font-bold">
              IT
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <Wallet className="text-green-600 size={30}" />

            <p className="text-gray-500 mt-3">
              Payroll
            </p>

            <h3 className="text-2xl font-bold">
              Available
            </h3>
          </div>

        </div>

      </main>
    </div>
  );
}