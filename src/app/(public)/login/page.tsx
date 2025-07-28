"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../context/userContext";
import Spinner from "../../components/spinner";
import InputField from "@/app/components/inputField";
import CustomButton from "@/app/components/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { setUser } = useUserContext();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setLoading(false);
      setError("Invalid email format");
      return;
    }
    if (!password) {
      setLoading(false);
      setError("Password is required");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🎉 Login successful for user:', data.user.email);
        console.log('🚀 Redirecting to dashboard...');
        setUser(data.user);
        router.push("/dashboard");
      } else {
        console.error('❌ Login failed:', response.status);
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('❌ Login error:', error instanceof Error ? error.message : 'Unknown error');
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm mx-4 p-8 bg-background rounded-2xl shadow-lg border border-grey">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h2>
          <p className="text-sm text-grey">Sign in to your account to continue</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              <InputField
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                error={error}
                label="Email"
              />
              <InputField
                name="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                error={error}
                label="Password"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}
              <CustomButton 
                text="Sign In" 
                disabled={loading} 
                type="submit"
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}
