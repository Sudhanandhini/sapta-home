import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
      if (res.ok) {
        navigate("/admin/products");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data?.message || "Login failed");
      return;
    }
    navigate("/admin/products");
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch(apiUrl("/api/auth/request-reset"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data?.message || "Check server logs for reset token");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch(apiUrl("/api/auth/reset"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, password: resetPassword }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data?.message || "Password updated");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <h1 className="font-display text-2xl font-bold text-primary">Admin Access</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sign in to manage products. {isReset ? "Reset your password below." : ""}
        </p>

        {!isReset && (
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-light disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setIsReset(true)}
              className="w-full text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </form>
        )}

        {isReset && (
          <div className="mt-6 space-y-6">
            <form className="space-y-3" onSubmit={handleRequestReset}>
              <p className="text-sm text-foreground/60">Request a reset token (check server logs).</p>
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110 disabled:opacity-70"
              >
                {loading ? "Requesting..." : "Request Reset"}
              </button>
            </form>

            <form className="space-y-3" onSubmit={handleReset}>
              <input
                type="text"
                placeholder="Reset token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                required
              />
              <input
                type="password"
                placeholder="New password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-light disabled:opacity-70"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsReset(false)}
              className="w-full text-sm text-foreground/70 hover:text-primary"
            >
              Back to login
            </button>
          </div>
        )}

        {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
