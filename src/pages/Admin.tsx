import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { user, isAdmin, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! You can now sign in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      }
    }
    setIsSigningIn(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // User is logged in
  if (user) {
    // Check if they have admin role
    if (!isAdmin) {
      return (
        <Layout>
          <section className="py-16 md:py-24 min-h-[70vh] flex items-center">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                Your account doesn't have admin privileges.
              </p>
              <p className="text-sm text-muted-foreground">
                Signed in as: {user.email}
              </p>
            </div>
          </section>
        </Layout>
      );
    }

    // User is admin
    return (
      <Layout>
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <AdminDashboard />
          </div>
        </section>
      </Layout>
    );
  }

  // Not logged in - show login form
  return (
    <Layout>
      <section className="py-16 md:py-24 min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8 animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
                {isSignUp ? "Create Admin Account" : "Admin Login"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Create an account to manage your store"
                  : "Sign in to manage your store and products"}
              </p>
            </div>

            {/* Login/Signup Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-card p-8 rounded-xl card-shadow animate-fade-in space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@store.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full button-shadow" disabled={isSigningIn}>
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Need an account? Sign up"}
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Protected area for store administrators only.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
