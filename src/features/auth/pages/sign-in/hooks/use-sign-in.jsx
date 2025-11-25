import { useAuthStore } from "../../../store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { signInApi } from "../services";

export function useSign() {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const {
    isPending: isSigningIn,
    error,
    mutate: signIn,
  } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: signInApi,
    onSuccess: (data) => {
      if (data.email.includes("admin"))
        setUser({ email: data.email, role: "admin" }, true);
      else setUser({ email: data.email, role: "student" }, true);

      navigate("/dashboard");
    },
  });

  return { isSigningIn, error, signIn };
}
