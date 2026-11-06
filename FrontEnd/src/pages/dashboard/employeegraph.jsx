import { useMemo } from "react";
import { BarChart3, CheckCircle2, Clock3 } from "lucide-react";

const WEEK_TARGET_HOURS = 30;
const DAILY_TARGET_HOURS = 5;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Sample / duplicate demo data so the graph is visible before real shifts exist.
// Used only when the employee has no sessions recorded for the current week.
// Values are around the 5h/day target to show completed vs pending days.
const DEMO_WEEK_HOURS = [5, 5, 4, 5, 2.5, 0, 0];

function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

function sessionHours(s) {
  if (typeof s.totalHours === "number" && !Number.isNaN(s.totalHours)) return s.totalHours;
  if (s.loginTime && s.logoutTime) {
    const ms = new Date(s.logoutTime) - new Date(s.loginTime);
    if (!Number.isNaN(ms) && ms >= 0) return ms / 3600000;
  }
  return 0;
}

function formatShort(h) {
  if (!h) return "0h";
  const totalMinutes = Math.round(h * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export default function employeegraph({ employeeId, employeeName, sessions = [] }) {
  const { dayHours, isDemo, weekTotal, weekRangeLabel } = useMemo(() => {
    const now = new Date();
    const monday = startOfWeekMonday(now);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    const norm = (v) => String(v || "").trim().toLowerCase();
    const me = norm(employeeId);
    const mine = sessions.filter((s) => norm(s.employeeId) === me);

    const hours = [0, 0, 0, 0, 0, 0, 0];
    mine.forEach((s) => {
      if (!s.loginTime) return;
      const login = new Date(s.loginTime);
      if (Number.isNaN(login)) return;
      const loginDay = new Date(login);
      loginDay.setHours(0, 0, 0, 0);
      const diff = Math.round((loginDay - monday) / 86400000);
      if (diff >= 0 && diff < 7) hours[diff] += sessionHours(s);
    });

    const realTotal = hours.reduce((a, b) => a + b, 0);
    const useDemo = realTotal <= 0;
    const finalHours = useDemo ? [...DEMO_WEEK_HOURS] : hours;
    const total = finalHours.reduce((a, b) => a + b, 0);

    const fmt = (d) =>
      d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
    const range = `${fmt(days[0])} – ${fmt(days[6])}`;

    return {
      dayHours: finalHours,
      isDemo: useDemo,
      weekTotal: total,
      weekRangeLabel: range,
    };
  }, [employeeId, sessions]);

  const todayIndex = (new Date().getDay() + 6) % 7;
  const progress = Math.min(100, (weekTotal / WEEK_TARGET_HOURS) * 100);
  const remaining = Math.max(0, WEEK_TARGET_HOURS - weekTotal);
  const completedDays = dayHours.filter((h) => h >= DAILY_TARGET_HOURS).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_14px_40px_rgba(3,20,38,0.16)]">
      <div className="p-7 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Weekly Hours
          </p>
          {isDemo && (
            <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold/90">
              Sample data
            </span>
          )}
        </div>

        <h2 className="mt-2 font-serif text-2xl font-bold text-cream">
          {employeeName || "Employee"} ({employeeId || "—"})
        </h2>
        <p className="mt-1 text-xs text-mutedwhite/60">
          Week: {weekRangeLabel} (Mon – Sun) • {DAILY_TARGET_HOURS}h / day •{" "}
          {completedDays}/7 days done
        </p>

        {/* Top total strip — 30 hours / week target */}
        <div className="mt-5 rounded-2xl border border-gold/25 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.12em] text-cream/70">
              <Clock3 className="h-4 w-4 text-gold" aria-hidden="true" />
              Total Week Hours
            </span>
            <span className="font-serif text-xl font-bold text-gold">
              {weekTotal.toFixed(2)}h{" "}
              <span className="text-sm font-semibold text-cream/60">
                / {WEEK_TARGET_HOURS}h
              </span>
            </span>
          </div>
          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weekly working hours progress out of 30 hours"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/70 via-gold to-amber-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-mutedwhite/60">
            {remaining > 0 ? (
              <>
                <span className="font-semibold text-gold">{remaining.toFixed(2)}h</span>{" "}
                left to reach 30h this week.
              </>
            ) : (
              <span className="font-semibold text-green-300">
                Weekly target of 30h completed. Great work!
              </span>
            )}
          </p>
        </div>

        {/* Day-by-day graph — 5h per day target */}
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/60">
            Each day: {DAILY_TARGET_HOURS}h target — completed vs pending
          </p>
          <div className="mt-3 flex h-auto items-end justify-between gap-2 sm:gap-3">
            {dayHours.map((h, i) => {
              const pct = Math.min(100, (h / DAILY_TARGET_HOURS) * 100);
              const done = h >= DAILY_TARGET_HOURS;
              const left = Math.max(0, DAILY_TARGET_HOURS - h);
              const isToday = i === todayIndex;
              return (
                <div key={DAY_LABELS[i]} className="flex flex-1 flex-col items-center justify-end">
                  <span className={`mb-1 text-[11px] font-semibold ${done ? "text-green-300" : h > 0 ? "text-gold" : "text-cream/35"}`}>
                    {h > 0 ? formatShort(h) : "—"}
                  </span>
                  <div
                    className="flex h-32 w-full max-w-[48px] items-end justify-center overflow-hidden rounded-t-lg bg-white/10"
                    title={`${DAY_LABELS[i]}: ${h.toFixed(2)}h worked of ${DAILY_TARGET_HOURS}h (${done ? "completed" : `${left.toFixed(2)}h left`})`}
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        done
                          ? "bg-gradient-to-t from-green-500/70 to-green-300"
                          : h > 0
                            ? isToday
                              ? "bg-gradient-to-t from-gold/70 to-amber-300 shadow-[0_0_18px_rgba(217,164,65,0.45)]"
                              : "bg-gradient-to-t from-gold/50 to-gold/90"
                            : "bg-transparent"
                      }`}
                      style={{ height: `${h > 0 ? Math.max(6, pct) : 0}%` }}
                    />
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                      isToday ? "text-gold" : "text-cream/55"
                    }`}
                  >
                    {DAY_LABELS[i]}
                    {isToday ? " •" : ""}
                  </span>
                  {done ? (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-green-300">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Done
                    </span>
                  ) : (
                    <span className="mt-1 text-[10px] text-mutedwhite/50">
                      {h > 0 ? `${left.toFixed(1)}h left` : `${DAILY_TARGET_HOURS}h to do`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-mutedwhite/50">
            <span>Green = 5h completed that day. Gold = partial.</span>
            <span className="font-semibold text-cream/60">Target: {WEEK_TARGET_HOURS}h/week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
