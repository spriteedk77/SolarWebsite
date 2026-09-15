import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ImageUploadForm } from '@/components/admin/ImageUploadForm';
import { Container } from '@/components/ui/Container';
import { isSignedIn } from '@/lib/admin-session';
import { loadMediaManager } from './actions';

export const dynamic = 'force-dynamic';

export default async function ImagesPage() {
  if (!(await isSignedIn())) redirect('/admin');
  const result = await loadMediaManager();
  return <AdminShell signedIn><Container width="wide"><div className="mx-auto w-full max-w-6xl py-10">
    <header><p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">จัดการเนื้อหา</p><h1 className="mt-2 text-h2">รูปภาพเว็บไซต์</h1><p className="mt-2 max-w-prose text-body text-ink-600">อัปโหลดเฉพาะรูปจริงที่มีสิทธิ์ใช้ ระบบจะเก็บไฟล์และส่งรูปขนาดเหมาะสมผ่าน Sanity</p></header>
    {!result.ready ? <div className="mt-8 rounded-card border border-flare-500 bg-white p-6"><h2 className="text-h3">ยังอัปโหลดไม่ได้</h2><p className="mt-2 text-body text-ink-700">ต้องตั้งค่า {result.missing.join(', ')} ในระบบโฮสต์ก่อน</p></div> : <>
      <section className="mt-10" aria-labelledby="homepage-images"><h2 id="homepage-images" className="text-h2">หน้าแรก</h2><div className="mt-6 grid gap-6 lg:grid-cols-2"><ImageUploadForm scope="homepage" field="heroImage" title="ภาพพื้นหลังส่วนบน" help="ภาพแนวนอน 2400 × 1350 ขึ้นไป เว้นพื้นที่ด้านซ้ายให้ข้อความ" image={result.homepage.heroImage} allowRemove /><ImageUploadForm scope="homepage" field="historyBackground" title="ภาพพื้นหลังส่วนประวัติ" help="ภาพแนวนอน 2400 × 1350 ขึ้นไป วางบุคคลหรือจุดสำคัญไว้ฝั่งซ้าย" image={result.homepage.historyBackground} position={result.homepage.historyImagePosition} allowRemove /></div></section>
      <section className="mt-12" aria-labelledby="project-images"><h2 id="project-images" className="text-h2">ภาพหน้าปกผลงาน</h2><p className="mt-2 text-body text-ink-600">เปลี่ยนรูปของแต่ละโครงการโดยไม่แก้ข้อมูลทางเทคนิคส่วนอื่น</p><div className="mt-6 grid gap-6 lg:grid-cols-2">{result.projects.map((project) => <ImageUploadForm key={project.id} scope="project" id={project.id} title={project.title} help={project.draft ? 'มีฉบับร่าง' : project.published ? 'เผยแพร่แล้ว' : 'ยังไม่เผยแพร่'} image={project.image} published={project.published} />)}</div></section>
    </>}
  </div></Container></AdminShell>;
}
