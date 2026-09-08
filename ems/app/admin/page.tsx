"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  CalendarCheck,
  CalendarDays,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface User {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: string;
}

interface Employee {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

interface Department {
  id?: string;
  name?: string;
  description?: string;
}

interface Attendance {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  date?: string;
  status?: string;
}

interface Leave {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Dashboard real records
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);
  const [pendingLeave, setPendingLeave] = useState(0);

  const [loadingStats, setLoadingStats] = useState(true);

  // ================= AUTH =================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const loggedUser: User = JSON.parse(storedUser);

      if (loggedUser.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }

      setUser(loggedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      router.push("/");
    }
  }, [router]);

  // ================= DASHBOARD DATA =================

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoadingStats(true);

    try {
      // Get Employees
      const employeesResponse = await fetch(
        "http://localhost:8081/employees"
      );

      if (employeesResponse.ok) {
        const employees: Employee[] = await employeesResponse.json();

        setTotalEmployees(employees.length);
      }

      // Get Departments
      const departmentsResponse = await fetch(
        "http://localhost:8081/departments"
      );

      if (departmentsResponse.ok) {
        const departments: Department[] =
          await departmentsResponse.json();

        setTotalDepartments(departments.length);
      }

      // Get Attendance
      const attendanceResponse = await fetch(
        "http://localhost:8081/attendance"
      );

      if (attendanceResponse.ok) {
        const attendance: Attendance[] =
          await attendanceResponse.json();

        // Current local date
        const now = new Date();

        const today =
          `${now.getFullYear()}-` +
          `${String(now.getMonth() + 1).padStart(2, "0")}-` +
          `${String(now.getDate()).padStart(2, "0")}`;

        // Count today's Present employees
        const presentToday = attendance.filter(
          (item) =>
            item.date === today &&
            item.status?.toLowerCase() === "present"
        );

        setTodayAttendance(presentToday.length);
      }

      // Get Leaves
      const leavesResponse = await fetch(
        "http://localhost:8081/leaves"
      );

      if (leavesResponse.ok) {
        const leaves: Leave[] = await leavesResponse.json();

        // Count pending leaves
        const pending = leaves.filter(
          (item) =>
            item.status?.toLowerCase() === "pending"
        );

        setPendingLeave(pending.length);
      } else {
        // If Leave API is not created yet
        setPendingLeave(0);
      }
    } catch (error) {
      console.error(
        "Error loading dashboard data:",
        error
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // ================= SIDEBAR MENU =================

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      name: "Employees",
      icon: Users,
      path: "/admin/employees",
    },
    {
      name: "Add Employee",
      icon: UserPlus,
      path: "/admin/employees",
    },
    {
      name: "Departments",
      icon: Building2,
      path: "/admin/departments",
    },
    {
      name: "Attendance",
      icon: CalendarCheck,
      path: "/admin/attendance",
    },
    {
      name: "Leave",
      icon: CalendarDays,
      path: "/admin/leave",
    },
    {
      name: "Payroll",
      icon: Wallet,
      path: "/admin/payroll",
    },
  ];

  // ================= LOADING =================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex">

      {/* MOBILE MENU BUTTON */}

      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        className="fixed top-4 left-4 z-50 md:hidden bg-purple-600 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileMenu ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* ================= SIDEBAR ================= */}

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
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* LOGO */}

        <div className="mb-8">

          <h1 className="text-2xl font-bold text-white">
            EMS Admin
          </h1>

          <p className="text-sm text-white/80 mt-1">
            Employee Management
          </p>

        </div>

        {/* ADMIN PROFILE */}

        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">

              <span className="text-purple-700 font-bold text-lg">
                {user.email
                  ?.charAt(0)
                  .toUpperCase() || "A"}
              </span>

            </div>

            <div className="min-w-0">

              <p className="font-semibold text-white truncate">
                {user.firstname} {user.lastname}
              </p>

              <p className="text-xs text-white/75 truncate">
                {user.email}
              </p>

              <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
                ADMIN
              </span>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenu(false);
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-left
                  text-white
                  hover:bg-white/20
                  transition
                  duration-200
                "
              >

                <Icon
                  size={20}
                  className="text-white"
                />

                <span className="font-medium text-white">
                  {item.name}
                </span>

              </button>
            );

          })}

        </nav>

        {/* LOGOUT */}

        <div className="absolute bottom-6 left-5 right-5">

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

            <LogOut
              size={20}
              className="text-white"
            />

            <span className="font-medium text-white">
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-100">

        {/* HEADER */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Welcome back, {user.firstname || "Admin"} 👋
          </p>

        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* ================= EMPLOYEES ================= */}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Employees
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">

                  {loadingStats ? (
                    <span className="text-xl">
                      Loading...
                    </span>
                  ) : (
                    totalEmployees
                  )}

                </h3>

                <p className="text-green-600 text-sm mt-2">
                  Employee records
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                <Users
                  className="text-blue-600"
                  size={24}
                />

              </div>

            </div>

          </div>

          {/* ================= DEPARTMENTS ================= */}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Departments
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">

                  {loadingStats ? (
                    <span className="text-xl">
                      Loading...
                    </span>
                  ) : (
                    totalDepartments
                  )}

                </h3>

                <p className="text-purple-600 text-sm mt-2">
                  Total departments
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

                <Building2
                  className="text-purple-600"
                  size={24}
                />

              </div>

            </div>

          </div>

          {/* ================= ATTENDANCE ================= */}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Today's Attendance
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">

                  {loadingStats ? (
                    <span className="text-xl">
                      Loading...
                    </span>
                  ) : (
                    todayAttendance
                  )}

                </h3>

                <p className="text-green-600 text-sm mt-2">
                  Present today
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                <CalendarCheck
                  className="text-green-600"
                  size={24}
                />

              </div>

            </div>

          </div>

          {/* ================= PENDING LEAVE ================= */}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Pending Leave
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">

                  {loadingStats ? (
                    <span className="text-xl">
                      Loading...
                    </span>
                  ) : (
                    pendingLeave
                  )}

                </h3>

                <p className="text-orange-600 text-sm mt-2">
                  Need approval
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">

                <CalendarDays
                  className="text-orange-600"
                  size={24}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ================= QUICK MANAGEMENT ================= */}

        <div className="mt-10">

          <h3 className="text-xl font-bold text-gray-900 mb-5">
            Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Employee Management */}

            <button
              onClick={() =>
                router.push("/admin/employees")
              }
              className="
                bg-white
                rounded-2xl
                p-6
                text-left
                shadow-md
                border
                border-gray-200
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">

                <Users
                  className="text-blue-600"
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-gray-900">
                Employee Management
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Add, update, view and delete employee
                records.
              </p>

            </button>

            {/* Add Employee */}

            <button
              onClick={() =>
                router.push("/admin/employees")
              }
              className="
                bg-white
                rounded-2xl
                p-6
                text-left
                shadow-md
                border
                border-gray-200
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">

                <UserPlus
                  className="text-purple-600"
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-gray-900">
                Add Employee
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Create a new employee profile in the
                system.
              </p>

            </button>

            {/* Departments */}

            <button
              onClick={() =>
                router.push("/admin/departments")
              }
              className="
                bg-white
                rounded-2xl
                p-6
                text-left
                shadow-md
                border
                border-gray-200
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">

                <Building2
                  className="text-cyan-600"
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-gray-900">
                Departments
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Manage company departments and
                employee assignments.
              </p>

            </button>

            {/* Attendance */}

            <button
              onClick={() =>
                router.push("/admin/attendance")
              }
              className="
                bg-white
                rounded-2xl
                p-6
                text-left
                shadow-md
                border
                border-gray-200
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">

                <CalendarCheck
                  className="text-green-600"
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-gray-900">
                Attendance
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Monitor employee attendance records.
              </p>

            </button>

            {/* Leave */}

            <button
              onClick={() =>
                router.push("/admin/leave")
              }
              className="
                bg-white
                rounded-2xl
                p-6
                text-left
                shadow-md
                border
                border-gray-200
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">

                <CalendarDays
                  className="text-orange-600"
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-gray-900">
                Leave Management
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Approve or reject employee leave
                requests.
              </p>

            </button>

            {/* Payroll */}

            <button
              onClick={() =>
                router.push("/admin/payroll")
              }
              className="
                bg-white
                rounded-2xl
                p-6
                text-left
                shadow-md
                border
                border-gray-200
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">

                <Wallet
                  className="text-indigo-600"
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-gray-900">
                Payroll
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Manage employee salary and payroll
                information.
              </p>

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}