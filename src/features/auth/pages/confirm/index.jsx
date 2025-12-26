import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../../utils/supabase";

const ConfirmEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirm = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }

      // Email is now confirmed
      navigate("/auth/sign-in", { replace: true });
    };

    confirm();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Confirming your email...</p>
    </div>
  );
};

export default ConfirmEmail;
