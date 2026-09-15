'use client';

import { useActionState, useState } from 'react';
import { adminDangerButton, adminNeutralButton } from './styles';

export type DeleteActionState = { status: 'idle' | 'error'; message?: string };
type DeleteAction = (
  previous: DeleteActionState,
  formData: FormData,
) => Promise<DeleteActionState>;

const initial: DeleteActionState = { status: 'idle' };

export function DeleteConfirmation({
  id,
  itemLabel,
  action,
}: {
  id: string;
  itemLabel: string;
  action: DeleteAction;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, initial);

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className={adminDangerButton}>
        ลบ{itemLabel}
      </button>
    );

  return (
    <div role="alertdialog" aria-labelledby="delete-confirm-title" aria-describedby="delete-confirm-description" className="rounded-lg border border-red-300 bg-red-50 p-5">
      <h3 id="delete-confirm-title" className="text-h3 text-red-900">ยืนยันการลบ?</h3>
      <p id="delete-confirm-description" className="mt-2 text-body text-red-800">การลบไม่สามารถย้อนกลับได้</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => setOpen(false)} disabled={pending} className={adminNeutralButton}>
          ยกเลิก
        </button>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="confirmDelete" value="yes" />
          <button type="submit" disabled={pending} className={adminDangerButton}>
            {pending ? 'กำลังลบ…' : 'ยืนยันการลบ'}
          </button>
        </form>
      </div>
      {state.status === 'error' && (
        <p role="alert" className="mt-3 text-caption font-medium text-red-800">
          {state.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'}
        </p>
      )}
    </div>
  );
}
