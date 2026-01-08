import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
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

      navigate("/auth/sign-in", { replace: true });
    };

    confirm();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">
        Confirming your email...
        <Loader className="animate-spin inline ml-2" size={20} />
      </p>
    </div>
  );
};

export default ConfirmEmail;
