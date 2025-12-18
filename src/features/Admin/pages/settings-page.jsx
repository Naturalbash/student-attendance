import { useState } from "react";
import { Save, Lock, Mail, User, Bell } from "lucide-react";

const AdminSettingsPage = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = () => {
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handlePasswordSave = () => {
    if (password.new !== password.confirm) {
      alert("New password and confirm password do not match!");
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setPassword({ current: "", new: "", confirm: "" });
      setSavingPassword(false);
      alert("Password updated successfully!");
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your profile, password, and notification preferences
        </p>
      </div>

      {/* PROFILE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold text-slate-800">
          Profile Information
        </h2>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-10 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-10 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={handleProfileSave}
            disabled={savingProfile}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
          >
            <Save size={16} /> {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* PASSWORD SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold text-slate-800">
          Change Password
        </h2>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              placeholder="Current Password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-10 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              placeholder="New Password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-10 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-10 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={handlePasswordSave}
            disabled={savingPassword}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
          >
            <Save size={16} />{" "}
            {savingPassword ? "Saving..." : "Change Password"}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>

        <div className="flex flex-col gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  emailAlerts: e.target.checked,
                })
              }
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 flex items-center gap-1">
              <Bell size={14} /> Email Alerts
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.pushNotifications}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  pushNotifications: e.target.checked,
                })
              }
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 flex items-center gap-1">
              <Bell size={14} /> Push Notifications
            </span>
          </label>
        </div>
      </div>
    </main>
  );
};

export default AdminSettingsPage;
