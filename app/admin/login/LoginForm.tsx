"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm text-frost/70">Mot de passe</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-2xl border border-frost/15 bg-frost/5 px-4 py-3 outline-none focus:border-ice"
        />
      </label>
      {state?.error && <p role="alert" className="text-sm text-red-300">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-fire py-3 font-bold text-white hover:bg-fire-dark disabled:opacity-60">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
