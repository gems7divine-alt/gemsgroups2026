import { useEffect, useState } from "react";
import { ArrowRight, IdCard } from "lucide-react";
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

const FALLBACK_EMPLOYEE_ID = "1001";

export default function EmployeeAccess() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_employee_auth") === "true") {
      window.location.hash = "#/employeelogin";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const idInput = employeeId.trim();
    const nameInput = employeeName.trim();
    if (!nameInput) {
      setError("Please enter Employee Name.");
      return;
    }
    if (!idInput) {
      setError("Please enter Employee ID.");
      return;
    }

    const employees = loadEmployees();
    const norm = (v) => String(v || "").trim().toLowerCase();

    if (employees.length > 0) {
      const match = employees.find(
        (emp) =>
          norm(emp.employeeId) === norm(idInput) || norm(emp.id) === norm(idInput)
      );
      if (!match) {
        setError(
          `Employee ID "${idInput}" not found. Ask admin to add you in New Employee Adding, then assign a task to this ID.`
        );
        return;
      }
      const registeredName = match.username || match.name || "";
      if (norm(registeredName) !== norm(nameInput)) {
        setError(
          `Name does not match ID "${idInput}". Use the registered name "${registeredName}".`
        );
        return;
      }
      const canonicalId = match.employeeId || match.id || idInput;
      sessionStorage.setItem("gems_employee_auth", "true");
      sessionStorage.setItem("gems_employee_id", String(canonicalId).trim());
      sessionStorage.setItem("gems_employee_name", registeredName || nameInput);
      setError("");
      window.location.hash = "#/employeelogin";
      return;
    }

    // No employees registered yet — allow demo ID 1001 so existing flow keeps working.
    if (norm(idInput) === norm(FALLBACK_EMPLOYEE_ID)) {
      sessionStorage.setItem("gems_employee_auth", "true");
      sessionStorage.setItem("gems_employee_id", FALLBACK_EMPLOYEE_ID);
      sessionStorage.setItem("gems_employee_name", nameInput);
      setError("");
      window.location.hash = "#/employeelogin";
    } else {
      setError(
        "No employees found yet. Ask admin to add you in New Employee Adding first (or use ID 1001 for demo)."
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy px-5 pb-16 pt-28 sm:px-8 md:pt-32">
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
        <div className="relative z-10 mx-auto w-full max-w-md">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_14px_40px_rgba(3,20,38,0.16)]">
              <div className="p-7 sm:p-9">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold">
                  <IdCard className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                  Employee Access
                </p>
                <h1 className="mt-2 font-serif text-3xl font-bold text-cream">
                  Enter Employee Details
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-mutedwhite/70">
                  Please enter your Employee ID and Employee Name to continue
                  to the employee login page.
                </p>
                <form onSubmit={handleSubmit} className="mt-6">
                  <label
                    htmlFor="employee-id"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80"
                  >
                    Employee ID
                  </label>
                  <input
                    id="employee-id"
                    value={employeeId}
                    onChange={(e) => {
                      setEmployeeId(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter employee ID"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-gold"
                  />
                  <label
                    htmlFor="employee-name"
                    className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-cream/80"
                  >
                    Employee Name
                  </label>
                  <input
                    id="employee-name"
                    value={employeeName}
                    onChange={(e) => {
                      setEmployeeName(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter employee name"
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-gold"
                  />
                  {error && (
                    <p role="alert" className="mt-3 text-[13px] font-medium text-red-400">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
                <a
                  href="#/dashboard"
                  className="mt-5 block text-center text-[13px] text-mutedwhite/60 transition-colors hover:text-gold"
                >
                  Back to Staff Dashboard
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
