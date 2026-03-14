"use client";

import type { FormEvent } from "react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PublicFooter } from "@/src/components/navigation/public-footer";
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

  const isEmbeddedBrowser = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const embeddedSignals = ["instagram", "telegram", "fbav", "fban", "line", "wv"];
    const detected = embeddedSignals.some((signal) => userAgent.includes(signal));
    const isIosStandaloneWebView = /iphone|ipad|ipod/.test(userAgent) && !userAgent.includes("safari");

    return detected || isIosStandaloneWebView;
  }, []);

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

  async function handleMagicLinkSignIn() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const redirectTo = typeof window === "undefined" ? undefined : `${window.location.origin}/auth?oauth=1`;

    const { error: otpError } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setMessage("Magic link sent. Check your email to continue.");
    setLoading(false);
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

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleEmailSignIn();
  }

  return (
    <main className="app-shell flex min-h-screen flex-col py-10">
      <div className="flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)] lg:items-center">
          <section className="rounded-[34px] border border-black/8 bg-white/76 p-7 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl lg:p-8">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-black/8 bg-[#f8f4ee] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
                MacroTrackr
              </div>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-medium tracking-[-0.065em] text-[#151515] sm:text-[3.35rem]">
                  Sign in and pick up right where your day left off.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[#6f685f]">
                  Calories, protein, carbs, and fat stay readable when your account, goals, and history all live in one calm place.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Fast log</p>
                  <p className="mt-2 text-sm leading-6 text-[#4f4a43]">Pick up meals quickly across devices.</p>
                </div>
                <div className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Clear targets</p>
                  <p className="mt-2 text-sm leading-6 text-[#4f4a43]">Keep macros visible every day.</p>
                </div>
                <div className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">History</p>
                  <p className="mt-2 text-sm leading-6 text-[#4f4a43]">Review patterns without losing context.</p>
                </div>
              </div>
            </div>
          </section>

          <Card className="space-y-5 p-6 lg:p-7">
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">Access</p>
              <h2 className="text-3xl font-medium tracking-[-0.06em] text-[#151515]">Welcome back</h2>
              <p className="text-sm leading-7 text-[#6f685f]">
                Continue with Google, a magic link, or your email and password.
              </p>
            </div>

            {isEmbeddedBrowser ? (
              <div className="rounded-[22px] border border-[#e6dac3] bg-[#f2eadb] p-4 text-sm leading-6 text-[#6b4d2a]">
                Google Sign-In is blocked in in-app browsers like Instagram or Telegram. Open this page in Safari or Chrome, or use a magic link below.
              </div>
            ) : null}

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || isEmbeddedBrowser}
              className="w-full"
            >
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/8" />
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">or continue with email</span>
              <div className="h-px flex-1 bg-black/8" />
            </div>

            <form className="space-y-5" onSubmit={handlePasswordSubmit}>
              <div className="grid gap-3">
                <label className="space-y-1.5 text-sm text-[#4f4a43]">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Email</span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="bg-white"
                    autoComplete="email"
                  />
                </label>
                <label className="space-y-1.5 text-sm text-[#4f4a43]">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Password</span>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="bg-white"
                    autoComplete="current-password"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={loading || !email || !password}>
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleEmailSignUp}
                  disabled={loading || !email || !password}
                >
                  Create account
                </Button>
              </div>
            </form>

            <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Magic link</p>
                  <p className="text-sm text-[#6f685f]">Use email only if you want a quick password-free login.</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleMagicLinkSignIn}
                  disabled={loading || !email}
                >
                  Send magic link
                </Button>
              </div>
            </div>

            <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Session</p>
                  <p className="mt-1 text-sm text-[#6f685f]">
                    {connectedUserId ? "You already have an active session on this browser." : "No active session yet."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={loading || !connectedUserId}
                    className="border-[#e9c7bf] text-[#8a3d30] hover:bg-[#f5dfdb] hover:text-[#7d3428]"
                  >
                    Sign out
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (connectedUserId) {
                        router.replace("/today");
                      }
                    }}
                    disabled={!connectedUserId || loading}
                  >
                    Go to dashboard
                  </Button>
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-[#8a3d30]">{error}</p> : null}
            {message ? <p className="text-sm text-[#365141]">{message}</p> : null}
          </Card>
        </div>
      </div>

      <PublicFooter className="mt-8" />
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
