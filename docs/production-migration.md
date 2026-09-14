# การเชื่อม Sanity และย้ายขึ้นระบบจริง

สถานะที่ตกลง: ใช้ GitHub Actions ตรวจและเผยแพร่ GitHub Pages preview ก่อน Sanity project `mtnue2wm` dataset `production` (public) และ Netlify project `np88solar` สร้างแล้ว แต่ยังไม่ได้ต่อเข้ากับเว็บไซต์ Pages ยังเป็น preview ที่ใช้งานจริงจนกว่า replacement จะผ่านการทดสอบ

## สถาปัตยกรรม

- เครื่องพัฒนาและ GitHub Pages อ่าน snapshot ใน repo; Pages เป็นสำเนาสำหรับตรวจงานและปิดรับข้อมูลฟอร์มจริง โทร/LINE ใช้ได้
- Netlify อ่านเฉพาะ Sanity published perspective และเอกสารที่ยืนยันข้อมูลแล้ว เนื้อหาอยู่ใน HTML และสร้างหน้าใหม่จาก slug ได้โดยไม่ต้อง deploy
- Cache ตั้ง revalidate 60 วินาที รวม sitemap คำขอแรกหลังหมดอายุอาจยังได้ข้อมูลเก่าระหว่าง refresh จึงไม่ใช่การอัปเดตทันทีทุกเครื่อง
- ถ้า CMS ผิดพลาดหรือข้อมูลบริษัทไม่ครบ จะรายงานข้อผิดพลาด ไม่แสดง snapshot เก่าปะปน
- `studio/` ใช้ login, drafts, publish และ revision ของ Sanity จริง ข้อมูลบริษัท/ช่องทางติดต่อ/พื้นที่บริการใช้เอกสารเดียวกัน Settings อ้างอิงบริษัท
- CMS ครอบคลุมโครงการ บทความ บริษัท หน้าแรก และโปรโมชั่น สินค้า โซลูชัน และข้อความประกอบอื่นคงอยู่ใน repo ตามขอบเขตเดิม

GitHub Pages ไม่รัน API/ISR และไม่อัปเดตตาม CMS ในโหมด snapshot นี้ เก็บ preview เดิมไว้จนกว่า replacement ผ่านการทดสอบ

## ขั้นตอนเชื่อมภายหลัง

1. ให้ NP88 เป็นเจ้าของ Sanity project และเพิ่มผู้แก้ไขด้วยบัญชีแยก เลือก private dataset หากต้องการป้องกันการอ่านเอกสารผ่าน API สาธารณะ ใช้ token อ่านอย่างเดียวบนเว็บไซต์
2. ใส่ public project ID/dataset ใน `studio/.env.local` ตาม `.env.example`; `npm ci --prefix studio` แล้ว `npm run dev --prefix studio` ตั้ง CORS เฉพาะต้นทาง Studio ที่ใช้จริง
3. สำรอง dataset ก่อนนำเข้า รัน `npm run cms:seed` เพื่อตรวจแผนโดยไม่เชื่อมเครือข่าย เมื่อพร้อมตั้ง `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN` ใน shell ส่วนตัว แล้วรัน `npm run cms:seed -- --write` (tsx ไม่โหลด `.env.local` อัตโนมัติ)
4. สคริปต์เตรียม 19 drafts: บริษัท 1, Settings 1, โครงการ 4, บทความ 12, โปรโมชั่น 1 อัปโหลดภาพจริง แปลงเนื้อหาเป็น rich text ไม่ publish และข้าม ID ที่มี draft/published อยู่แล้ว ไม่เขียนทับงานบรรณาธิการ
5. ตรวจและ publish บริษัทก่อน Settings แล้วตรวจเนื้อหาทีละรายการ เติมผู้เขียน ภาพจริง และสิทธิ์ใช้งานที่ขาด รูป SVG เก็บไว้เพื่ออ้างอิง แต่ Studio ต้องมีภาพอัปโหลดก่อน publish โปรโมชั่นนำเข้าเป็น inactive และยังขาดเงื่อนไขโดยตั้งใจ
6. ตั้งค่า deployment host (Netlify — ดู `netlify.toml`) ด้วยตัวแปรตาม `.env.example` ล้าง `GITHUB_PAGES`, `NEXT_PUBLIC_STATIC_PREVIEW`, `NEXT_PUBLIC_BASE_PATH`, `LEAD_TEST_MODE` ใช้ canonical origin ของ deployment ที่ทดสอบ
7. ต่อ receiver ที่เก็บ lead/ไฟล์เป็นส่วนตัว และ Turnstile ที่อนุญาต hostname นี้ เมื่อเปิดจริงตั้ง `PRODUCTION_LAUNCH=1` (Netlify `CONTEXT=production` และ Vercel production บังคับอัตโนมัติอยู่แล้ว) build จะหยุดหากขาด CMS, receiver หรือ spam protection
8. ทดสอบรายการด้านล่างครบ แล้วค่อยเปลี่ยน DNS/canonical ห้ามถอด Pages ก่อน replacement ใช้งานได้ ยกเลิก write token หลังนำเข้าจบ

ไม่ใส่ secret ใน `NEXT_PUBLIC_*` / `SANITY_STUDIO_*` และไม่ใส่ write token บน host ของเว็บไซต์

## ฟอร์มและข้อมูลส่วนตัว

`POST /api/lead` ตรวจชื่อ โทร consent (ไม่เลือกไว้ก่อน), honeypot, origin, MIME และลายเซ็นไฟล์ อ่าน body แบบจำกัดขนาด รองรับ PDF/JPEG/PNG/WebP/HEIC/HEIF การตรวจชนิดไฟล์ไม่ใช่การสแกนไวรัส

ขีดจำกัด: request 4 MiB, ไฟล์รวม 3 MiB, ต่อไฟล์ 3 MiB, สูงสุด 8 ไฟล์ เพื่อเผื่อจากเพดาน payload ของ host ทั้งสองแบบ — [Netlify 6 MB ซึ่งเหลือราว 4.5 MB เมื่อไฟล์ถูก base64](https://docs.netlify.com/build/functions/configuration/) และ [Vercel 4.5 MB](https://vercel.com/docs/functions/limitations) หากต้องรับไฟล์ใหญ่ในอนาคต ให้ใช้ private object storage ผ่าน signed upload พร้อมตรวจสิทธิ์และไฟล์

Receiver รับ HTTPS POST JSON: ข้อมูลติดต่อ, `receivedAt`, `consent`, `source` และ `attachments[]` มี `field`, `filename`, `type`, `size`, `contentBase64` ต้อง decode และเก็บ bytes เป็นส่วนตัวก่อนตอบ 2xx ตั้งระยะลบข้อมูลตามที่ NP88 ยืนยัน ห้ามเก็บบิล/เอกสารส่วนตัวใน Sanity image assets ที่ใช้เผยแพร่ภาพเว็บไซต์

รองรับ bearer token, timeout และไม่ตาม redirect ตอบสำเร็จหลัง receiver รับเท่านั้น แต่ยังต้องทดสอบปลายทางจริง Production ที่ขาด receiver/Turnstile ตอบ 503 พร้อมแนะนำโทร/LINE ไม่มี fallback เก็บลง filesystem ชั่วคราว

## ตรวจด้วยบัญชีจริงก่อนเปิดบริการ

- NP88 login, draft, publish, unpublish และสิทธิ์ผู้แก้ไขทำงานตามบัญชีจริง
- Draft ไม่อยู่ใน HTML/sitemap; slug ใหม่มี detail, listing, filter และ featured ตามตั้งค่า
- เปลี่ยนบริษัทแล้ว Header/Footer/Contact/structured data ตรงกัน
- Publish/unpublish และช่วงเวลาโปรโมชั่นมีผลหลัง cache refresh
- ภาพจริงมี alt และ social preview ถูกต้อง ทดสอบ LINE/Facebook ด้วย URL สาธารณะ
- ส่งไฟล์ทดสอบที่ไม่มีข้อมูลส่วนตัวผ่าน Turnstile แล้วตรวจ bytes ในที่เก็บส่วนตัว รวมไฟล์เกิน limit, receiver ล่ม, token หมดอายุ และ retry
- เจ้าของข้อมูลยืนยัน Privacy Policy ระยะเก็บ ช่องทางขอลบ และผู้รับผิดชอบ ไม่ถือว่าได้ตรวจทางกฎหมายแล้ว
- ยืนยันสิทธิ์ชื่อลูกค้า/ภาพและคำกล่าวอ้าง จำนวน 600+ / 700+ และราคาแพ็กเกจเดิมยังเป็น **CLIENT CONFIRMATION REQUIRED**

ถ้า cutover ผิดพลาด ให้ย้อน deployment/DNS กลับรุ่นที่ตรวจแล้ว เก็บ dataset และ backup ไว้ ไม่ลบเอกสารหรือ rewrite Git history หากย้อนเป็น Pages ต้องคงสถานะ preview และปิดฟอร์มตามเดิม

อ้างอิง: [Sanity schema](https://www.sanity.io/docs/studio/schema-types), [published perspective](https://www.sanity.io/docs/content-lake/perspectives)

## Dependencies

Studio ตรึง Sanity 5.31.2 พร้อม override CLI dependencies ที่ audit ระบุ: adm-zip 0.6.1, js-yaml 3.15.2, uuid 11.1.1 สำหรับ typeid-js ตรวจ typecheck/schema/build/audit ใน CI ทบทวนการถอด override เมื่อ upstream รวมแพตช์แล้ว โดยเฉพาะ uuid ข้าม major ต้องตรวจการสร้าง ID และ CLI เมื่ออัปเกรด
