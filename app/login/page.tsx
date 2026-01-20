"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Button, Input, Label } from "@/components/ui";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Get user role from localStorage to redirect
      const userData = localStorage.getItem("ats_auth_user");
      if (userData) {
        const user = JSON.parse(userData);
        const roleRoute = user.role.toLowerCase();
        router.push(`/${roleRoute}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold">ATS System</span>
          </div>
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: admin@ats.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
