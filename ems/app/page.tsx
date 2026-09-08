
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/LoginDialog";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />


      <section
        className="hero-bg relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/employee1.png')",
        }}
      >
        {/* Light Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Employee Management System
          </h2>

          <p className="text-lg text-white max-w-2xl mb-10 mx-auto">
            A simple and efficient platform to manage employees, departments,
            attendance, salaries, and more.
          </p>

         
            <Button
              type="button"
              className="inline-block bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Get Started
            </Button>
         
        </div>
      </section>



      {/* Footer */}
      <footer className="mt-5 bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-600 border-t py-5 text-center text-white fobt-bold">
        © 2026 Employee Management System. All rights reserved.
      </footer>
    </div>
  );
}