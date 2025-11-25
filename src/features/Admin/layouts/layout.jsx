import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "./sidebar";
import Header from "../../../components/common/header";

const AdminAppLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const openerRef = (useRef < HTMLButtonElement) | (null > null);
  const panelRef = (useRef < HTMLDivElement) | (null > null);

  const toggleCollapsed = () => {
    setCollapsed((s) => {
      const next = !s;
      try {
        localStorage.setItem("sidebarCollapsed", next ? "true" : "false");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable =
          panel.querySelectorAll <
          HTMLElement >
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        if (focusable.length) {
          focusable[0].focus();
        } else {
          panel.focus();
        }
      });
    } else {
      openerRef.current?.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(e) {
      if (!mobileOpen) return;
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll <
            HTMLElement >
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <aside
        className={`${
          collapsed ? "w-20" : "w-72"
        } hidden md:block fixed top-0 bottom-0 left-0 bg-white border-r transition-all duration-300 ease-in-out overflow-y-auto pt-6`}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      <div
        className={`hidden md:flex fixed top-3 z-50 ${
          collapsed ? "left-16" : "left-68"
        }`}
      >
        <button
          onClick={toggleCollapsed}
          className="p-2 rounded-full hover:bg-gray-100 shadow-sm bg-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div
        className={`flex-1 flex flex-col ${
          collapsed ? "md:ml-20" : "md:ml-72"
        }`}
      >
        <header className="top-0 left-0 right-0 h-14 bg-white border-b flex items-center px-4 z-40">
          <div className="md:hidden mr-2">
            <button
              ref={openerRef}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded hover:bg-gray-100"
            >
              <Menu />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-end"></div>

          <Header />
        </header>

        <main
          className={`flex-1 ${
            mobileOpen ? "overflow-hidden" : "overflow-auto"
          } p-6 bg-gray-50 pt-2`}
        >
          <Outlet />
        </main>
      </div>

      {/* The mobile overlay sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
              mobileOpen ? "opacity-40" : "opacity-0"
            }`}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            tabIndex={-1}
            className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-lg p-0 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              collapsed={false}
              closeSidebar={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppLayout;
