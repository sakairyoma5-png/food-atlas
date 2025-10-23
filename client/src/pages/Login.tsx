// Blueprint: javascript_log_in_with_replit
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    // Redirect to Replit Auth login
    window.location.href = "/api/login";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">ログインページにリダイレクトしています...</p>
    </div>
  );
}
