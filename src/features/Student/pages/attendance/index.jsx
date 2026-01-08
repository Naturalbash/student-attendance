import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getCurrentStudent,
  fetchDailyAttendance,
  fetchMonthlyAttendance,
  subscribeToAttendanceChanges,
} from "./utils/attendanceActions";

import DatePicker from "./components/date-picker";
import AttendanceStatus from "./components/attendance-status";
import Stat from "./components/stats";
import Section from "./components/section";

const StudentAttendancePage = () => {
  const [studentId, setStudentId] = useState(null);
  const [dailyAttendance, setDailyAttendance] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));

  /* ==========================
     GET AUTH USER
  ========================== */
  useEffect(() => {
    const init = async () => {
      const user = await getCurrentStudent();

      if (!user) {
        setLoading(false);
        return;
      }

      setStudentId(user.id);
    };

    init();
  }, []);

  /* ==========================
     FETCH DAILY ATTENDANCE
  ========================== */
  useEffect(() => {
    if (!studentId) return;

    const loadDaily = async () => {
      setLoading(true);

      const data = await fetchDailyAttendance(studentId, date);

      setDailyAttendance(data);
      setLoading(false);
    };

    loadDaily();
  }, [studentId, date]);

  /* ==========================
     FETCH MONTHLY ATTENDANCE
  ========================== */
  useEffect(() => {
    if (!studentId) return;

    const loadMonthly = async () => {
      const data = await fetchMonthlyAttendance(studentId, month);

      setMonthlyAttendance(data);
    };

    loadMonthly();
  }, [studentId, month]);

  /* ==========================
     REALTIME (ADMIN MARKING)
  ========================== */
  useEffect(() => {
    if (!studentId) return;

    const handleAttendanceChange = (payload, record) => {
      /* DAILY */
      if (record.attendance_date === date) {
        setDailyAttendance(payload.eventType === "DELETE" ? null : record);
      }

      /* MONTHLY */
      if (record.attendance_date.startsWith(month)) {
        setMonthlyAttendance((prev) => {
          if (payload.eventType === "DELETE") {
            return prev.filter((a) => a.id !== record.id);
          }

          const exists = prev.find((a) => a.id === record.id);
          if (exists) {
            return prev.map((a) => (a.id === record.id ? record : a));
          }

          return [...prev, record];
        });
      }
    };

    const unsubscribe = subscribeToAttendanceChanges(
      studentId,
      date,
      month,
      handleAttendanceChange
    );

    return unsubscribe;
  }, [studentId, date, month]);

  /* ==========================
     MONTHLY STATS
  ========================== */
  const stats = useMemo(() => {
    const total = monthlyAttendance.length;
    const present = monthlyAttendance.filter(
      (a) => a.status === "present"
    ).length;
    const late = monthlyAttendance.filter((a) => a.status === "late").length;
    const absent = monthlyAttendance.filter(
      (a) => a.status === "absent"
    ).length;

    const percentage =
      total === 0 ? 0 : Math.round(((present + late) / total) * 100);

    return { total, present, late, absent, percentage };
  }, [monthlyAttendance]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main className="min-h-screen bg-slate-50 p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
          <p className=" text-slate-500">
            Updated automatically when admin marks attendance
          </p>
        </div>

        <Section title="Daily Attendance">
          <DatePicker value={date} onChange={setDate} />
          <AttendanceStatus attendance={dailyAttendance} />
        </Section>

        <Section title="Monthly Summary">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Total Days" value={stats.total} />
            <Stat label="Present" value={stats.present} color="emerald" />
            <Stat label="Late" value={stats.late} color="amber" />
            <Stat label="Absent" value={stats.absent} color="rose" />
          </div>

          <div className="bg-white rounded-2xl border p-4 text-center">
            <p className="text-sm text-slate-500">Attendance Percentage</p>
            <p
              className={`text-3xl font-bold ${
                stats.percentage >= 75 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {stats.percentage}%
            </p>
          </div>
        </Section>
      </main>
    </>
  );
};

export default StudentAttendancePage;
