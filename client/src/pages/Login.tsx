import LoginPage from "@/components/LoginPage";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", { email, password });
    // todo: remove mock functionality - implement actual login
    // For now, just redirect to home
    setTimeout(() => {
      setLocation("/");
    }, 500);
  };

  const handleSignup = (email: string, password: string, username: string) => {
    console.log("Signup:", { email, password, username });
    // todo: remove mock functionality - implement actual signup
    // For now, just redirect to home
    setTimeout(() => {
      setLocation("/");
    }, 500);
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    // todo: remove mock functionality - implement actual Google OAuth
    window.location.href = "/api/login";
  };

  const handleGithubLogin = () => {
    console.log("GitHub login");
    // todo: remove mock functionality - implement actual GitHub OAuth
    window.location.href = "/api/login";
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onSignup={handleSignup}
      onGoogleLogin={handleGoogleLogin}
      onGithubLogin={handleGithubLogin}
    />
  );
}
