import Image from "next/image";
import AuthDialog from "@/components/AuthDialog";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-8 py-5 bg-white shadow">
      <h1 className="flex items-center gap-3 text-2xl font-bold text-blue-600">
        <Image
          src="/logo2.png"
          alt="Employee Management System Logo"
          width={85}
          height={55}
          className="rounded-md"
          priority
        />
        <span className="font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Employee Management System</span>
      </h1>

      <div className="flex gap-4">
        <AuthDialog />
      </div>
    </nav>

  );
}