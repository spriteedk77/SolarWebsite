'use client';

import { useActionState } from 'react';
import { signInAction } from '@/app/admin/actions';
import type { FormState } from '@/app/admin/actions';

const initial: FormState = { status: 'idle' };

/**
 * The way in.
 *
 * One field. The password is checked on the server against a hash that lives
 * in the hosting environment — it is not in this code, not in the browser, and
 * not anywhere in the repository.
 */
export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, initial);

  return (
    <form action={action} className="mt-8" noValidate>
      <label
        htmlFor="admin-password"
        className="text-body font-semibold text-navy-900"
      >
        รหัสผ่าน
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        aria-invalid={state.status === 'error' ? true : undefined}
        aria-describedby={state.message ? 'admin-password-error' : undefined}
        className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-body text-ink-900 focus:border-solar-600 focus:outline-none ${
          state.status === 'error' ? 'border-red-600' : 'border-hairline'
        }`}
      />

      {state.message && (
        <p
          id="admin-password-error"
          role="alert"
          className="mt-3 text-body font-medium text-red-700"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-solar-600 px-6 font-semibold text-white hover:bg-solar-700 disabled:opacity-60"
      >
        {pending ? 'กำลังตรวจสอบ…' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}
