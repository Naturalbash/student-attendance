import { useState, useRef, useEffect } from "react";
import LogoutModal from "./logout-modal";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleConfirmLogout() {
    setLogoutOpen(false);
    // TODO: Add logout API call here when ready
    navigate("/auth/sign-in");
  }

  return (
    <header className="bg-white relative md:block hidden">
      <div className="flex justify-between items-center px-4">
        <nav className="hidden md:flex gap-6 items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border"
              aria-label="Open profile menu"
              type="button"
            >
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-600">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-4.418 3.582-8 8-8s8 3.582 8 8v1H4v-1z"
                    fill="#9CA3AF"
                  />
                </svg>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}

// handled logout modal confirmation outside component render to keep functions stable
