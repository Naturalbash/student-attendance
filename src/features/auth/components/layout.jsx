import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
