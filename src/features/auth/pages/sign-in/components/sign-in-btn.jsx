import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignInButton({ loading }) {
  return (
    <Button
      disabled={loading}
      type="submit"
      className="w-full block py-3 text-white font-semibold text-md bg-blue-500 hover:bg-blue-700 transition rounded"
    >
      {loading ? <Loader className="animate-spin mx-auto" /> : "Login"}
    </Button>
  );
}
