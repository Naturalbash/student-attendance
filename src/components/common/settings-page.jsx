import { useEffect, useState } from "react";
import { Save, Lock, Mail, User, Bell } from "lucide-react";
import supabase from "../../utils/supabase";
import toast from "react-hot-toast";

const AdminSettingsPage = () => {
  const [userId, setUserId] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
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

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        return;
      }

      setProfile({
        name: data.full_name || "",
        email: data.email || user.email,
      });
    };

    loadProfile();
  }, []);

  const handleProfileSave = async () => {
    if (!profile.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSavingProfile(true);
    const toastId = toast.loading("Saving profile...");

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: profile.name,
        email: profile.email,
      })
      .eq("id", userId);

    const { error: authError } =
      profile.email &&
      (await supabase.auth.updateUser({
        email: profile.email,
      }));

    if (profileError || authError) {
      toast.error(profileError?.message || authError?.message, { id: toastId });
    } else {
      toast.success("Profile updated successfully", {
        id: toastId,
      });
    }

    setSavingProfile(false);
  };

  const handlePasswordSave = async () => {
    if (password.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password.new !== password.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setSavingPassword(true);
    const toastId = toast.loading("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password: password.new,
    });

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Password updated successfully", {
        id: toastId,
      });
      setPassword({ current: "", new: "", confirm: "" });
    }

    setSavingPassword(false);
  };

  const handleNotificationChange = (updated) => {
    setNotifications(updated);
    toast.success("Notification settings saved");
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your profile and security settings
        </p>
      </div>

      {/* PROFILE */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold">Profile Information</h2>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border px-10 py-2 text-sm"
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full rounded-xl border px-10 py-2 text-sm"
              placeholder="Email"
            />
          </div>

          <button
            onClick={handleProfileSave}
            disabled={savingProfile}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          >
            <Save size={16} />
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* PASSWORD */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold">Change Password</h2>

        {["current", "new", "confirm"].map((field) => (
          <div key={field} className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              value={password[field]}
              onChange={(e) =>
                setPassword({ ...password, [field]: e.target.value })
              }
              placeholder={`${field} password`}
              className="w-full rounded-xl border px-10 py-2 text-sm"
            />
          </div>
        ))}

        <button
          onClick={handlePasswordSave}
          disabled={savingPassword}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          <Save size={16} />
          {savingPassword ? "Saving..." : "Change Password"}
        </button>
      </div>

      {/* NOTIFICATIONS (UI ONLY) */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications.emailAlerts}
            onChange={(e) =>
              handleNotificationChange({
                ...notifications,
                emailAlerts: e.target.checked,
              })
            }
          />
          <Bell size={14} /> Email Alerts
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications.pushNotifications}
            onChange={(e) =>
              handleNotificationChange({
                ...notifications,
                pushNotifications: e.target.checked,
              })
            }
          />
          <Bell size={14} /> Push Notifications
        </label>
      </div>
    </main>
  );
};

export default AdminSettingsPage;
