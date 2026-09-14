"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LogIn, TriangleAlert } from "lucide-react";

import { demoAccounts } from "@/lib/ops";

/**
 * TODO(auth): replace with the real server action once sessions land.
 * Everything else on this screen stays exactly as it is — the form only ever
 * awaits a promise that resolves to an error string or null.
 */
async function authenticate(
  email: string,
  password: string,
): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  const match = demoAccounts.find(
    (account) =>
      account.email.toLowerCase() === email.trim().toLowerCase() &&
      account.password === password,
  );

  return match ? null : "Those credentials don't match an account.";
}

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(nextEmail: string, nextPassword: string) {
    setPending(true);
    setError(null);

    const failure = await authenticate(nextEmail, nextPassword);

    if (failure) {
      setError(failure);
      setPending(false);
      return;
    }

    router.push("/app");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit(email, password);
      }}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
        >
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@valleyverde.com"
          disabled={pending}
          className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor="password"
            className="block text-xs font-semibold tracking-wide text-forest-900/70 uppercase"
          >
            Password
          </label>
          <a
            href="#"
            className="text-xs font-medium text-forest-600 underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            disabled={pending}
            className="w-full rounded-xl border border-sand-300 bg-white py-3 pr-12 pl-4 text-sm text-forest-950 outline-none transition placeholder:text-forest-950/35 focus:border-forest-400 focus:ring-4 focus:ring-forest-500/10 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-forest-900/45 transition hover:text-forest-700 focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" aria-hidden />
            ) : (
              <Eye className="h-4.5 w-4.5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-forest-950/75 select-none">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="h-4 w-4 rounded border-sand-300 text-forest-700 accent-forest-700 focus-visible:ring-2 focus-visible:ring-forest-400"
        />
        Keep me signed in on this device
      </label>

      <div aria-live="polite" className="min-h-0">
        {error ? (
          <p className="flex items-start gap-2 rounded-xl border border-ember-300 bg-ember-50 px-3.5 py-3 text-sm text-ember-700">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 px-4 py-3.5 text-sm font-semibold text-sand-50 shadow-sm transition hover:bg-forest-600 focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none active:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" aria-hidden />
            Sign in
          </>
        )}
      </button>
    </form>
  );
}
