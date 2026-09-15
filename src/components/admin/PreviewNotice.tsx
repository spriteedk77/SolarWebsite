import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function PreviewNotice({ source, editorHref }: { source: 'draft' | 'published'; editorHref: string }) {
  return (
    <div className="border-b border-amber-300 bg-amber-50 text-amber-950">
      <Container width="wide">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-caption">
          <p><strong>โหมดดูตัวอย่าง:</strong> แสดง{source === 'draft' ? 'ฉบับร่างที่บันทึกไว้' : 'ฉบับเผยแพร่ล่าสุด'} การดูหน้านี้จะไม่เผยแพร่หรือแก้ไขข้อมูล</p>
          <Link href={editorHref} className="cursor-pointer rounded-md px-3 py-2 font-semibold underline underline-offset-4 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">
            กลับไปหน้าแก้ไข
          </Link>
        </div>
      </Container>
    </div>
  );
}
