import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Download } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

function loadSessions() {
  try {
    const raw = localStorage.getItem("gems_employee_sessions");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatHours(h) {
  if (h === null || h === undefined) return "In progress";
  const totalMinutes = Math.round(h * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}h ${mins}m (${h.toFixed(2)} hrs)`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDateOnly(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  } catch {
    return iso;
  }
}

function formatTimeExcel(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  } catch {
    return iso;
  }
}

function totalHoursValue(s) {
  if (s.totalHours !== null && s.totalHours !== undefined) return Number(s.totalHours);
  if (s.loginTime && s.logoutTime) {
    const ms = new Date(s.logoutTime) - new Date(s.loginTime);
    if (!Number.isNaN(ms) && ms >= 0) return ms / 3600000;
  }
  return null;
}

function formatHoursExact(h) {
  if (h === null || h === undefined || Number.isNaN(h)) return "In progress";
  const totalMinutes = Math.max(0, Math.round(h * 60));
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}h ${mins}m (${h.toFixed(2)} hrs)`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function EmployeeAttendance() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_admin_auth") !== "true") {
      window.location.hash = "#/adminpassword";
      return;
    }
    setSessions(loadSessions());
    window.scrollTo(0, 0);
  }, []);

  const ordered = [...sessions].reverse();

  const handleDownloadExcel = () => {
    if (sessions.length === 0) return;
    const rows = sessions.map((s) => {
      const total = totalHoursValue(s);
      return [
        s.employeeId || "",
        s.employeeName || "",
        formatDateOnly(s.loginTime),
        s.loginTime ? formatTimeExcel(s.loginTime) : "—",
        s.logoutTime ? formatTimeExcel(s.logoutTime) : "In progress",
        s.logoutTime ? "Present" : "Logged In",
        total !== null ? formatHoursExact(total) : "In progress",
      ];
    });
    const headers = [
      "Employee ID",
      "Employee Name",
      "Date",
      "Login Time",
      "Logout Time",
      "Status",
      "Total Work Hours",
    ];
    const widths = [90, 150, 100, 170, 170, 100, 170];
    const thead = `<tr>${headers.map((h) => `<th style="background:#D9A441;color:#031426;font-weight:bold;">${escapeHtml(h)}</th>`).join("")}</tr>`;
    const tbody = rows
      .map(
        (r) =>
          `<tr>${r.map((c) => `<td style="mso-number-format:\\@;">${escapeHtml(c)}</td>`).join("")}</tr>`
      )
      .join("");
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1"><colgroup>${widths.map((w) => `<col width="${w}">`).join("")}</colgroup><thead>${thead}</thead><tbody>${tbody}</tbody></table></body></html>`;
    const blob = new Blob(["\uFEFF" + html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `employee-attendance-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
              Admin Dashboard
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-cream sm:text-4xl md:text-[2.6rem]">
              Employee Attendance
            </h1>
            <p className="mt-3 text-sm text-mutedwhite/70 sm:text-[15px]">
              All employee login time, logout time, present status and total
              working hours.
            </p>
          </Reveal>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-between gap-3">
            <a
              href="#/admindashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-cream"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Admin Dashboard
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Total records: {sessions.length}
            </span>
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={sessions.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-deepnavy transition-all duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Excel
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy">
            {ordered.length === 0 ? (
              <p className="p-8 text-center text-sm text-mutedwhite/60">
                No attendance records yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gold/20 text-[11px] uppercase tracking-[0.14em] text-cream/60">
                      <th className="px-5 py-4">Employee ID</th>
                      <th className="px-5 py-4">Employee Name</th>
                      <th className="px-5 py-4">Login Time</th>
                      <th className="px-5 py-4">Logout Time</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Total Work Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordered.map((s) => (
                      <tr key={s.id} className="border-b border-white/10 last:border-0">
                        <td className="px-5 py-4 font-semibold text-cream">{s.employeeId}</td>
                        <td className="px-5 py-4 font-semibold text-cream">{s.employeeName || "—"}</td>
                        <td className="px-5 py-4 text-mutedwhite/80">{formatDateTime(s.loginTime)}</td>
                        <td className="px-5 py-4 text-mutedwhite/80">
                          {s.logoutTime ? formatDateTime(s.logoutTime) : "In progress"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              s.logoutTime
                                ? "bg-green-500/15 text-green-400"
                                : "bg-gold/15 text-gold"
                            }`}
                          >
                            {s.logoutTime ? "Present" : "Logged In"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gold">{formatHoursExact(totalHoursValue(s))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
