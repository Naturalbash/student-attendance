import { FaHome, FaBell, FaCalendar, FaBook, FaUserEdit } from "react-icons/fa";
import { X as LucideX } from "lucide-react";
import Flyout from "../../../components/common/tooltip";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import LogoutModal from "../../../components/common/logout-modal";

const navLinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <FaHome className="h-4 w-4" />,
  },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: <FaCalendar className="h-4 w-4" />,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: <FaBook className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <FaUserEdit className="h-4 w-4" />,
  },
];

export default function Sidebar({ closeSidebar, collapsed }) {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [anchoredPos, setAnchoredPos] = useState(null);
  const portalRef = useRef(null);

  // helper to open/close menu while computing anchor immediately to avoid flicker
  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      setAnchoredPos(null);
      return;
    }
    const btnEl = buttonRef.current;
    if (btnEl) {
      const menuWidth = 160;
      const menuHeight = 120;
      const r = btnEl.getBoundingClientRect();
      // centered popup horizontally relative to the button, then clamped to viewport
      const centered = r.left + (r.width - menuWidth) / 2;
      const left = Math.min(
        Math.max(8, centered),
        Math.max(8, window.innerWidth - menuWidth - 8)
      );
      const spaceBelow = window.innerHeight - r.bottom;
      const top =
        spaceBelow >= menuHeight
          ? r.bottom + 8
          : Math.max(8, r.top - menuHeight - 8);
      setAnchoredPos({ left, top });
    }
    // opened synchronously so portal gets the inline style immediately
    setMenuOpen(true);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/gig-workers/profile");
        if (!res.ok) throw new Error("no");
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        let data;
        if (ct.includes("application/json")) data = await res.json();
        else throw new Error("not-json");

        // normalized
        if (typeof data === "object" && data !== null) {
          const d = data;
          if (d.profile && typeof d.profile === "object") data = d.profile;
          else if (d.data && typeof d.data === "object") {
            const inner = d.data;
            if (inner.profile && typeof inner.profile === "object")
              data = inner.profile;
          }
        }

        if (mounted && typeof data === "object" && data !== null) {
          const r = data;
          setProfile({
            name: r.name || r.fullName || undefined,
            avatarUrl: r.avatarUrl,
          });
        }
      } catch {
        if (import.meta.env && import.meta.env.DEV) {
          try {
            const mock = await fetch("/mock/gig-workers-profile.json");
            if (mock.ok) {
              const m = await mock.json();
              if (mounted) setProfile({ name: m.name, avatarUrl: m.avatarUrl });
            }
          } catch {
            // ignore
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onDoc(e) {
      const t = e.target;
      // keep open when clicking inside the button/menu or inside the portal content
      if (menuRef.current && menuRef.current.contains(t)) return;
      if (portalRef.current && portalRef.current.contains(t)) return;
      setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    // also close on touchstart for mobile devices
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  // computed anchored popup coordinates when the menu opens
  useEffect(() => {
    if (!menuOpen) {
      setAnchoredPos(null);
      return;
    }
    const btnEl = buttonRef.current;
    if (!btnEl) return;
    const width = 160;
    const compute = () => {
      const r = btnEl.getBoundingClientRect();
      // centered the popup above/below the button
      const centered = r.left + (r.width - width) / 2;
      const left = Math.min(
        Math.max(8, centered),
        Math.max(8, window.innerWidth - width - 8)
      );
      const spaceBelow = window.innerHeight - r.bottom;
      const top =
        spaceBelow >= 120 ? r.bottom + 8 : Math.max(8, r.top - 120 - 8);
      setAnchoredPos({ left, top });
      // also update portal element position if present
      if (portalRef.current) {
        const p = portalRef.current;
        p.style.position = "fixed";
        p.style.top = `${top}px`;
        p.style.left = `${left}px`;
        p.style.right = "";
        p.style.bottom = "";
        p.style.zIndex = "9999";
      }
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [menuOpen]);

  // popup positioned via fixed portal; no dynamic coordinates required
  useEffect(() => {
    const p = portalRef.current;
    if (!p) return;
    if (anchoredPos) {
      p.style.position = "fixed";
      p.style.top = `${anchoredPos.top}px`;
      p.style.left = `${anchoredPos.left}px`;
      p.style.right = "";
      p.style.bottom = "";
      p.style.zIndex = "9999";
    } else {
      p.style.position = "fixed";
      p.style.right = "1rem";
      p.style.bottom = "5rem";
      p.style.top = "";
      p.style.left = "";
      p.style.zIndex = "9999";
    }
  }, [anchoredPos, menuOpen]);

  return (
    <div
      className={`${
        collapsed ? "h-full w-20" : "h-full w-72"
      } bg-white border-r flex flex-col transition-width duration-300 ease-in-out z-10`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 md:py-0 border-b md:border-0 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {!collapsed && (
            <span className="text-2xl font-medium">Admin Dashboard</span>
          )}
        </Link>
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 rounded hover:bg-gray-100 absolute right-3 top-3 bg-white shadow-sm"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <LucideX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile Nav */}
      <nav
        className={`md:hidden flex flex-col gap-4 p-4 ${
          collapsed ? "items-center" : ""
        }`}
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center gap-3 transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-black"
              }`}
              onClick={closeSidebar}
              title={link.label}
            >
              {link.icon} {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Nav */}
      <div
        className={`hidden md:block px-4 flex-1 overflow-y-auto ${
          collapsed ? "text-center" : ""
        }`}
      >
        {!collapsed && (
          <>
            <ul className="space-y-4 p-1 mt-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                );
              })}
            </ul>

            <hr className="my-4" />
          </>
        )}

        {/* Collapsed Desktop (icons only) */}
        {collapsed && (
          <div className="flex flex-col items-center py-6 space-y-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <div key={link.label} className="relative">
                  <Flyout text={link.label}>
                    <Link
                      to={link.href}
                      className={`p-2 rounded inline-block transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      aria-label={link.label}
                    >
                      {link.icon}
                    </Link>
                  </Flyout>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Footer */}
      <div
        className={`border-t mt-auto bg-white w-full ${
          collapsed ? "py-3" : "p-4"
        } hidden md:block`}
      >
        {!collapsed ? (
          <>
            {/* Profile Info */}
            <div className="flex items-center justify-between mb-3">
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {(profile?.name || "U").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {profile?.name || "Guest"}
                  </div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
              </Link>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLogoutOpen(true);
              }}
              aria-haspopup="dialog"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.5A1.5 1.5 0 014.5 3h6A1.5 1.5 0 0112 4.5V6a.5.5 0 001 0V4.5A2.5 2.5 0 0010.5 2h-6A2.5 2.5 0 002 4.5v11A2.5 2.5 0 004.5 18h6A2.5 2.5 0 0013 15.5V14a.5.5 0 00-1 0v1.5A1.5 1.5 0 0110.5 17h-6A1.5 1.5 0 012 15.5v-11z"
                  clipRule="evenodd"
                />
                <path d="M7.146 9.146a.5.5 0 01.708 0L9 10.293V5.5a.5.5 0 011 0v4.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 010-.708z" />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Flyout text="Logout">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogoutOpen(true);
                }}
                title="Logout"
                aria-label="Logout"
                aria-haspopup="dialog"
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4.5A1.5 1.5 0 014.5 3h6A1.5 1.5 0 0112 4.5V6a.5.5 0 001 0V4.5A2.5 2.5 0 0010.5 2h-6A2.5 2.5 0 002 4.5v11A2.5 2.5 0 004.5 18h6A2.5 2.5 0 0013 15.5V14a.5.5 0 00-1 0v1.5A1.5 1.5 0 0110.5 17h-6A1.5 1.5 0 012 15.5v-11z"
                    clipRule="evenodd"
                  />
                  <path d="M7.146 9.146a.5.5 0 01.708 0L9 10.293V5.5a.5.5 0 011 0v4.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 010-.708z" />
                </svg>
              </button>
            </Flyout>
          </div>
        )}
      </div>

      {/* Mobile Footer */}
      <div className="p-4 border-t md:hidden block bottom-0 absolute w-full bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Connected Wallet</div>
              <div className="text-xs font-mono truncate">0x71C7...8F3d</div>
            </div>
            <div className="text-sm text-gray-500"> </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-600">
                    {(profile?.name || "U").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="block">
                <div className="text-sm font-medium">
                  {profile?.name || "Guest"}
                </div>
                <div className="text-xs text-gray-500">Gig Worker</div>
              </div>
            </div>

            <div className="relative" ref={menuRef}>
              {menuOpen ? (
                <button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-haspopup="menu"
                  aria-expanded="true"
                  title="Profile menu"
                  type="button"
                >
                  ...
                </button>
              ) : (
                <button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  title="Profile menu"
                  type="button"
                >
                  ...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portal Menu */}
      {menuOpen &&
        createPortal(
          <div
            className="bg-white shadow-lg rounded-md min-w-[160px] p-1"
            ref={portalRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: anchoredPos?.top ?? "auto",
              left: anchoredPos?.left ?? "auto",
              right: !anchoredPos ? "1rem" : "auto",
              bottom: !anchoredPos ? "5rem" : "auto",
              zIndex: 9999,
            }}
          >
            <Link
              to="/admin/settings"
              onClick={(e) => {
                e.stopPropagation();
                setTimeout(() => {
                  setMenuOpen(false);
                  if (closeSidebar) closeSidebar();
                }, 0);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTimeout(() => {
                  setMenuOpen(false);
                  setLogoutOpen(true);
                }, 0);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>,
          document.body
        )}

      {/* Mobile Fallback Menu */}
      {menuOpen && !anchoredPos && (
        <div className="md:hidden fixed bottom-20 right-4 z-[9999] bg-white shadow-md rounded-md min-w-[160px] p-1">
          <Link
            to="/admin/settings"
            onClick={(e) => {
              e.stopPropagation();
              setTimeout(() => {
                setMenuOpen(false);
                if (closeSidebar) closeSidebar();
              }, 0);
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTimeout(() => {
                setMenuOpen(false);
                setLogoutOpen(true);
              }, 0);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={async () => {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin",
          });
          window.location.href = "/auth/sign-in";
        }}
      />
    </div>
  );
}
