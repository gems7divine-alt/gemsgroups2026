import { useEffect, useState } from "react";
import { ArrowRight, ClipboardCheck, ClipboardList, LogOut, UserPlus } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

function loadEmployees() {
  try {
    const raw = localStorage.getItem("gems_employees");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem("gems_tasks");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_admin_auth") !== "true") {
      window.location.hash = "#/adminpassword";
      return;
    }
    setEmployees(loadEmployees());
    setTasks(loadTasks());
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("gems_admin_auth");
    window.location.hash = "#/dashboard";
  };

  const handleFullLogout = () => {
    sessionStorage.removeItem("gems_admin_auth");
    sessionStorage.removeItem("gems_staff_auth");
    window.location.hash = "#/";
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-[92svh] overflow-hidden bg-deepnavy px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/office.png')" }}
          role="img"
          aria-label="GEMS Groups office background"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/85 to-deepnavy/60"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
              Admin Dashboard
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-cream sm:text-4xl md:text-[2.6rem]">
              Manage Your Team
            </h1>
            <p className="mt-3 text-sm text-mutedwhite/70 sm:text-[15px]">
              Add new employees, track attendance and assign tasks to employees.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
            <Reveal delay={0} className="h-full">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "#/newemployeeadding";
                }}
                className="group flex h-full w-full flex-col rounded-2xl border border-gold/25 bg-deepnavy p-7 text-left shadow-[0_14px_40px_rgba(3,20,38,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-gold sm:p-9"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold">
                  <UserPlus className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold text-cream">
                  New Employee Adding
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mutedwhite/70">
                  Add new employees with name, contact, role and date of
                  joining. Total: {employees.length}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Add Employee
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            </Reveal>
            <Reveal delay={120} className="h-full">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "#/employeeattendance";
                }}
                className="group flex h-full w-full flex-col rounded-2xl border border-gold/25 bg-deepnavy p-7 text-left shadow-[0_14px_40px_rgba(3,20,38,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-gold sm:p-9"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold">
                  <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold text-cream">
                  Employee Attendance
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mutedwhite/70">
                  View all employee login time, logout time, present status
                  and total working hours.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  View Attendance
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            </Reveal>
            <Reveal delay={240} className="h-full">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "#/taskassigning";
                }}
                className="group flex h-full w-full flex-col rounded-2xl border border-gold/25 bg-deepnavy p-7 text-left shadow-[0_14px_40px_rgba(3,20,38,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-gold sm:p-9"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold">
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold text-cream">
                  Task Assigning
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mutedwhite/70">
                  Select an employee and send task messages. Total: {tasks.length}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Assign Task
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            </Reveal>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy"
            >
              Staff Dashboard
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Admin Logout
            </button>
            <button
              type="button"
              onClick={handleFullLogout}
              className="text-[13px] text-mutedwhite/60 transition-colors hover:text-gold"
            >
              Full logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
