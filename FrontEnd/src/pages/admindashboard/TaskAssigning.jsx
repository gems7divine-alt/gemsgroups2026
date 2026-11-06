import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Pencil,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
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

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function TaskAssigning() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

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

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || e.key === "gems_tasks") setTasks(loadTasks());
      if (!e.key || e.key === "gems_employees") setEmployees(loadEmployees());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const pendingCount = tasks.length - completedCount;

  const handleRefresh = () => {
    setEmployees(loadEmployees());
    setTasks(loadTasks());
  };

  const saveTasks = (next) => {
    setTasks(next);
    try {
      localStorage.setItem("gems_tasks", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter the task message.");
      return;
    }
    const emp = employees.find(
      (x) => (x.employeeId || x.id) === employeeId
    );
    const employeeName = emp ? emp.username || emp.name || "" : "";

    if (editingId) {
      const next = tasks.map((t) =>
        t.id === editingId
          ? { ...t, employeeId, employeeName, message: message.trim() }
          : t
      );
      saveTasks(next);
      setEditingId(null);
      setMessage("");
      setEmployeeId("");
      setError("");
      setSent("Task updated.");
      setTimeout(() => setSent(""), 3000);
      return;
    }

    const entry = {
      id: `task-${Date.now()}`,
      employeeId,
      employeeName,
      message: message.trim(),
      status: "Assigned",
      createdAt: new Date().toISOString(),
    };
    saveTasks([entry, ...tasks]);
    setMessage("");
    setError("");
    setSent(`Task sent to ${entry.employeeName || entry.employeeId}.`);
    setTimeout(() => setSent(""), 3000);
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEmployeeId(task.employeeId);
    setMessage(task.message);
    setError("");
    setSent("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEmployeeId("");
    setMessage("");
    setError("");
  };

  const handleDelete = (id) => {
    if (editingId === id) handleCancelEdit();
    saveTasks(tasks.filter((t) => t.id !== id));
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
              Task Assigning
            </h1>
            <p className="mt-3 text-sm text-mutedwhite/70 sm:text-[15px]">
              Select an employee and send a task message. It will appear in
              their employee login.
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Total: {tasks.length} • Pending: {pendingCount} • Done:{" "}
                {completedCount}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-gold hover:text-deepnavy"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>

          <Reveal>
            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gold/25 bg-deepnavy p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-bold text-cream">
                  {editingId ? "Edit Task" : "Assign Task"}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    aria-label="Cancel edit"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-deepnavy"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              {employees.length === 0 ? (
                <p className="mt-3 text-sm text-mutedwhite/60">
                  No employees found. Add employees first in New Employee
                  Adding.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="task-employee"
                      className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80"
                    >
                      Select Employee *
                    </label>
                    <select
                      id="task-employee"
                      value={employeeId}
                      onChange={(e) => {
                        setEmployeeId(e.target.value);
                        if (error) setError("");
                      }}
                      className="mt-2 w-full rounded-xl border border-gold/30 bg-deepnavy px-4 py-3 text-sm text-cream outline-none focus:border-gold [&>option]:bg-deepnavy"
                    >
                      <option value="" disabled>
                        Choose employee
                      </option>
                      {employees.map((emp) => {
                        const id = emp.employeeId || emp.id;
                        const name = emp.username || emp.name || id;
                        return (
                          <option key={emp.id} value={id}>
                            {name} • ID: {id}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="task-message"
                      className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80"
                    >
                      Task Message *
                    </label>
                    <textarea
                      id="task-message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (error) setError("");
                      }}
                      rows={4}
                      placeholder="Enter task details for the employee"
                      className="mt-2 w-full resize-y rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-gold"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="text-[13px] font-medium text-red-400">
                      {error}
                    </p>
                  )}
                  {sent && (
                    <p role="status" className="text-[13px] font-medium text-green-400">
                      {sent}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02]"
                  >
                    {editingId ? (
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    {editingId ? "Update Task" : "Send Task"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          <div className="mt-8 rounded-2xl border border-gold/25 bg-deepnavy p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-cream">
              Assigned Tasks ({tasks.length})
            </h2>
            <p className="mt-1 text-[13px] text-mutedwhite/60">
              When an employee marks a task done, their “task completed”
              message appears here for admin.
            </p>
            <div className="mt-4 space-y-3">
              {tasks.length === 0 && (
                <p className="text-sm text-mutedwhite/60">
                  No tasks assigned yet.
                </p>
              )}
              {tasks.map((t) => {
                const completed = t.status === "Completed";
                return (
                <div
                  key={t.id}
                  className={`rounded-xl border px-4 py-3 ${
                    completed
                      ? "border-green-400/40 bg-green-400/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-cream">
                      <span>
                        {t.employeeName || "Employee"} • ID: {t.employeeId}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          completed
                            ? "bg-green-400/15 text-green-300"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        {completed && (
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        )}
                        {t.status || "Assigned"}
                      </span>
                    </p>
                    <p className="mt-1 break-words text-[13px] leading-relaxed text-mutedwhite/80">
                      {t.message}
                    </p>
                    <p className="mt-1 text-xs text-mutedwhite/50">
                      Assigned: {formatDateTime(t.createdAt)}
                    </p>
                    {completed && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg border border-green-400/30 bg-deepnavy px-3 py-2">
                        <MessageSquareText
                          className="mt-0.5 h-4 w-4 shrink-0 text-green-300"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-300">
                            Employee message to admin
                          </p>
                          <p className="mt-0.5 break-words text-[13px] leading-relaxed text-cream">
                            {t.completionMessage || "Task completed"}
                          </p>
                          <p className="mt-0.5 text-xs text-mutedwhite/50">
                            {t.completedBy ? `By ${t.completedBy} • ` : ""}
                            {formatDateTime(t.completedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(t)}
                      aria-label="Edit task"
                      title="Edit"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-deepnavy"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      aria-label="Remove task"
                      title="Remove"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-400/40 text-red-300 transition-colors hover:bg-red-400 hover:text-deepnavy"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
