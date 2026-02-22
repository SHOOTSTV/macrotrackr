"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { setAccessTokenCookie } from "@/src/lib/auth/client-auth";
import { supabaseBrowser } from "@/src/lib/supabase/browser";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthMode = searchParams.get("oauth") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectedUserId, setConnectedUserId] = useState<string | null>(null);

  const authRedirectUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    return `${window.location.origin}/auth?oauth=1`;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error: sessionError } = await supabaseBrowser.auth.getSession();
      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError("Unable to read the current session.");
        return;
      }

      const userId = data.session?.user.id ?? null;
      setAccessTokenCookie(data.session?.access_token ?? null);
      setConnectedUserId(userId);

      if (oauthMode && userId) {
        router.replace("/today");
      }
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id ?? null;
      setAccessTokenCookie(session?.access_token ?? null);
      setConnectedUserId(userId);
      if (userId) {
        router.replace("/today");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [oauthMode, router]);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: oauthError } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: authRedirectUrl,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  async function handleEmailSignIn() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      router.replace("/today");
    }
    setLoading(false);
  }

  async function handleEmailSignUp() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage("Account created. Check your email to confirm your sign-up.");
    } else {
      router.replace("/today");
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signOutError } = await supabaseBrowser.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      setLoading(false);
      return;
    }

    setAccessTokenCookie(null);
    setConnectedUserId(null);
    setMessage("Signed out successfully.");
    setLoading(false);
  }

  return (
    <main className="app-shell flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-xl space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Auth</p>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to MacroTrackr</h1>
          <p className="text-sm text-slate-600">
            Sign in with Google or email/password to access your dashboard.
          </p>
        </div>

        <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full">
          Continue with Google
        </Button>

        <div className="grid gap-2">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleEmailSignIn} disabled={loading || !email || !password}>
            Sign in
          </Button>
          <Button variant="ghost" onClick={handleEmailSignUp} disabled={loading || !email || !password}>
            Create account
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="font-medium text-slate-800">
            {connectedUserId ? `Active session: ${connectedUserId}` : "No active session"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loading || !connectedUserId}
            >
              Logout
            </Button>
            <Button
              onClick={() => {
                if (connectedUserId) {
                  router.replace("/today");
                }
              }}
              disabled={!connectedUserId || loading}
            >
              Go to /today
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
      </Card>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="app-shell flex min-h-screen items-center justify-center" />}>
      <AuthPageContent />
    </Suspense>
  );
}
