'use client';

import { useActionState, useState } from 'react';
import { publishSiteInfoAction, type FormState } from '@/app/admin/actions';

const initial: FormState = { status: 'idle' };

/**
 * The step that puts a saved change on the live website.
 *
 * Separate from saving on purpose. Saving is cheap and can be done half-way
 * through a thought; this is the one that customers see, so it asks for a
 * deliberate confirmation first — and that confirmation is the approval the
 * content schema requires before anything may go out.
 */
export function PublishPanel({ canSave }: { canSave: boolean }) {
  const [state, action, pending] = useActionState(publishSiteInfoAction, initial);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section
      aria-labelledby="publish-title"
      className="mt-8 rounded-card border border-hairline bg-white p-6 sm:p-8"
    >
      <h2 id="publish-title" className="text-h3">
        เผยแพร่ขึ้นเว็บไซต์
      </h2>
      <p className="mt-2 max-w-prose text-body text-ink-600">
        กดบันทึกด้านบนแล้ว ข้อมูลจะยังอยู่แค่ในฉบับร่าง
        ขั้นตอนนี้คือการนำขึ้นเว็บไซต์จริงให้ลูกค้าเห็น
      </p>

      <form action={action} className="mt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="confirm"
            value="yes"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded border-hairline text-solar-600"
          />
          <span className="text-body text-ink-700">
            ยืนยันว่าข้อมูลด้านบนถูกต้อง และมีสิทธิ์เผยแพร่ชื่อ ที่อยู่
            เบอร์โทร และข้อความทั้งหมดนี้บนเว็บไซต์สาธารณะ
          </span>
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending || !confirmed || !canSave}
            className="inline-flex min-h-12 items-center rounded-lg bg-navy-900 px-7 font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'กำลังเผยแพร่…' : 'เผยแพร่'}
          </button>

          {state.status === 'ok' && state.message && (
            <p role="status" className="text-body font-medium text-green-700">
              {state.message}
            </p>
          )}
          {state.status === 'error' && state.message && (
            <p role="alert" className="text-body font-medium text-red-700">
              {state.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
