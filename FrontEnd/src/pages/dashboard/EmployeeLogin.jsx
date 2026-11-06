import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CalendarCheck, ClipboardList, LogIn, LogOut, Send } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import EmployeeGraph from "./employeegraph";

function loadSessions() {
  try {
    const raw = localStorage.getItem("gems_employee_sessions");
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

function calcHours(loginIso, logoutIso) {
  if (!loginIso || !logoutIso) return null;
  const ms = new Date(logoutIso) - new Date(loginIso);
  if (Number.isNaN(ms) || ms < 0) return null;
  return ms / 3600000;
}

function formatHours(h) {
  if (h === null || h === undefined) return "—";
  const totalMinutes = Math.round(h * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}h ${mins}m (${h.toFixed(2)} hrs)`;
}

export default function EmployeeLogin() {
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [showTasks, setShowTasks] = useState(false);
  const [completionNotes, setCompletionNotes] = useState({});
  const [taskNotice, setTaskNotice] = useState("");

  const reloadTasks = () => setTasks(loadTasks());

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || e.key === "gems_tasks") setTasks(loadTasks());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_employee_auth") !== "true") {
      window.location.hash = "#/employeeaccess";
      return;
    }
    setEmployeeId(sessionStorage.getItem("gems_employee_id") || "1001");
    setEmployeeName(sessionStorage.getItem("gems_employee_name") || "");
    setSessions(loadSessions());
    setTasks(loadTasks());
    window.scrollTo(0, 0);
  }, []);

  const saveSessions = (next) => {
    setSessions(next);
    try {
      localStorage.setItem("gems_employee_sessions", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const mySessions = useMemo(() => {
    const norm = (v) => String(v || "").trim().toLowerCase();
    return sessions.filter((s) => norm(s.employeeId) === norm(employeeId));
  }, [sessions, employeeId]);

  const activeSession = useMemo(
    () => mySessions.find((s) => !s.logoutTime) || null,
    [mySessions]
  );

  const lastSession = useMemo(
    () => (mySessions.length ? mySessions[mySessions.length - 1] : null),
    [mySessions]
  );

  const handleLogin = () => {
    if (activeSession) return;
    const entry = {
      id: `sess-${Date.now()}`,
      employeeId,
      employeeName,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      totalHours: null,
    };
    saveSessions([...sessions, entry]);
  };

  const handleLogout = () => {
    if (!activeSession) return;
    const logoutTime = new Date().toISOString();
    const totalHours = calcHours(activeSession.loginTime, logoutTime);
    const next = sessions.map((s) =>
      s.id === activeSession.id ? { ...s, logoutTime, totalHours } : s
    );
    saveSessions(next);
  };

  const handleEmployeeLogout = () => {
    sessionStorage.removeItem("gems_employee_auth");
    sessionStorage.removeItem("gems_employee_id");
    sessionStorage.removeItem("gems_employee_name");
    window.location.hash = "#/dashboard";
  };

  const displaySession = activeSession || lastSession;

  const myTasks = useMemo(() => {
    const norm = (v) => String(v || "").trim().toLowerCase();
    const me = norm(employeeId);
    return tasks
      .filter((t) => norm(t.employeeId) === me)
      .reverse();
  }, [tasks, employeeId]);

  const handleMarkDone = (id) => {
    const note = (completionNotes[id] || "").trim();
    const completionMessage = note || "Task completed";
    const next = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status: "Completed",
            completionMessage,
            completedAt: new Date().toISOString(),
            completedBy: employeeName || t.employeeName || "",
          }
        : t
    );
    setTasks(next);
    try {
      localStorage.setItem("gems_tasks", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setCompletionNotes((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setTaskNotice(`Task completed message sent to admin.`);
    setTimeout(() => setTaskNotice(""), 3500);
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
        <div className="relative z-10 mx-auto w-full max-w-6xl grid gap-6 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_14px_40px_rgba(3,20,38,0.16)]">
              <div className="p-7 sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                  Employee Login
                </p>
                <h1 className="mt-2 font-serif text-3xl font-bold text-cream">
                  {employeeName || "Employee"} ({employeeId})
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-mutedwhite/70">
                  {activeSession
                    ? "You are logged in. Click Logout to finish and see your total working hours."
                    : "Click Login to start your shift, Logout to end it."}
                </p>

                {displaySession && displaySession.logoutTime ? (
                  <div className="mt-6 rounded-2xl border border-gold/25 bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold uppercase tracking-[0.12em] text-cream/70">
                        Total Working Hours
                      </span>
                      <span className="font-semibold text-gold">
                        {formatHours(displaySession.totalHours)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-mutedwhite/60">
                    {activeSession
                      ? "Shift in progress. Your total working hours will show here after logout."
                      : "No completed shift yet. Click Login to start."}
                  </p>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={!!activeSession}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={!activeSession}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-7 py-3 text-sm font-semibold text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!showTasks) reloadTasks();
                    setShowTasks((v) => !v);
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 px-7 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-deepnavy"
                >
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  {showTasks ? "Hide My Tasks" : `My Tasks (${myTasks.length})`}
                </button>

                <a
                  href="#/leaveapply"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 px-7 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-deepnavy"
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  Apply Leave
                </a>

                {showTasks && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    {taskNotice && (
                      <p
                        role="status"
                        className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-[13px] font-medium text-green-300"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {taskNotice}
                      </p>
                    )}
                    {myTasks.length === 0 ? (
                      <div className="p-2 text-center">
                        <p className="text-sm text-mutedwhite/60">
                          No tasks assigned yet.
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-mutedwhite/45">
                          Logged in as ID: {employeeId || "—"}. Ask admin to
                          assign a task to this exact ID in Task Assigning,
                          then tap My Tasks again.
                        </p>
                      </div>
                    ) : (
                      myTasks.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-xl border border-white/10 bg-deepnavy px-4 py-3"
                        >
                          <p className="break-words text-sm leading-relaxed text-cream">
                            {t.message}
                          </p>
                          <p className="mt-1 text-xs text-mutedwhite/50">
                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""} • {t.status || "Assigned"}
                          </p>
                          {t.status === "Completed" ? (
                            <p className="mt-2 flex items-start gap-2 rounded-lg border border-green-400/30 bg-green-400/10 px-3 py-2 text-xs leading-relaxed text-green-200">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              <span>
                                Message sent to admin: “{t.completionMessage || "Task completed"}”
                                {t.completedAt
                                  ? ` • ${new Date(t.completedAt).toLocaleString()}`
                                  : ""}
                              </span>
                            </p>
                          ) : (
                            <div className="mt-3 rounded-lg border border-gold/25 bg-white/5 p-3">
                              <label
                                htmlFor={`complete-note-${t.id}`}
                                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/70"
                              >
                                Message to admin on completion
                              </label>
                              <textarea
                                id={`complete-note-${t.id}`}
                                value={completionNotes[t.id] || ""}
                                onChange={(e) =>
                                  setCompletionNotes((prev) => ({
                                    ...prev,
                                    [t.id]: e.target.value,
                                  }))
                                }
                                rows={2}
                                placeholder="e.g. Task completed — report submitted"
                                className="mt-2 w-full resize-y rounded-lg border border-gold/30 bg-deepnavy px-3 py-2 text-[13px] text-cream placeholder:text-cream/40 outline-none focus:border-gold"
                              />
                              <button
                                type="button"
                                onClick={() => handleMarkDone(t.id)}
                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-deepnavy transition-all hover:scale-[1.02]"
                              >
                                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                                Mark Done &amp; Send to Admin
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="mt-6 text-center text-[13px]">
                  <button
                    type="button"
                    onClick={handleEmployeeLogout}
                    className="text-mutedwhite/60 transition-colors hover:text-gold"
                  >
                    Back to Staff Dashboard
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <EmployeeGraph
              employeeId={employeeId}
              employeeName={employeeName}
              sessions={mySessions}
            />
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
