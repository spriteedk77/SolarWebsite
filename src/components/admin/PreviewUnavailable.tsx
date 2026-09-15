import Link from 'next/link';
import { AdminShell } from './AdminShell';
import { adminSecondaryButton } from './styles';
import { Container } from '@/components/ui/Container';

export function PreviewUnavailable({ editorHref, errors }: { editorHref: string; errors?: string[] }) {
  return (
    <AdminShell signedIn>
      <Container width="narrow">
        <div className="py-16">
          <div role="alert" className="rounded-card border border-amber-300 bg-amber-50 p-6 text-amber-950">
            <h1 className="text-h2">ยังดูตัวอย่างไม่ได้</h1>
            <p className="mt-3 text-body">กรุณาบันทึกข้อมูลที่จำเป็นให้ครบ แล้วลองดูตัวอย่างอีกครั้ง</p>
            {errors?.length ? <ul className="mt-4 list-disc space-y-1 pl-5 text-caption">{errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
            <Link href={editorHref} className={`${adminSecondaryButton} mt-6`}>กลับไปหน้าแก้ไข</Link>
          </div>
        </div>
      </Container>
    </AdminShell>
  );
}
