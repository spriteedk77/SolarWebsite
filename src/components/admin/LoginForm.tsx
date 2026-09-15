'use client';

import { useActionState } from 'react';
import { signInAction } from '@/app/admin/actions';
import type { FormState } from '@/app/admin/actions';
import { RequiredMark } from './RequiredMark';
import { adminInput, adminPrimaryButton } from './styles';

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
        <RequiredMark />
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
        className={`${adminInput} ${
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
        className={`${adminPrimaryButton} mt-6 w-full`}
      >
        {pending ? 'กำลังตรวจสอบ…' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}
