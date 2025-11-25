import { useMemo, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useSignInForm = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("qwerty123");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const parseValidation = useMemo(() => {
    const e = {};
    if (!emailRegex.test(email)) e.email = "Enter a valid email";
    if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [email, password]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    passwordVisible,
    togglePasswordVisibility,
    errors,
    setErrors,
    parseValidation,
  };
};
