# NP88 Solar

Next.js App Router · TypeScript · Tailwind CSS · Prompt · Sanity integration

เว็บไซต์บริษัท NP88 Solar สำหรับบ้าน ธุรกิจ และโรงงานในภาคเหนือ

## สถานะปัจจุบัน

ใช้ [GitHub Pages preview](https://spriteedk77.github.io/SolarWebsite/) ผ่าน GitHub Actions ตามที่เจ้าของโปรเจกต์เลือก Sanity project และ Netlify project สร้างแล้วแต่ยังไม่ได้ต่อเข้ากับเว็บไซต์ ฟอร์มบน Pages ปิดรับข้อมูล ส่วนโทร/LINE ใช้ได้

โค้ดรองรับ Sanity Studio และ server-rendered CMS แล้ว การ login, publish และรับ lead จริงยังต้องทดสอบกับบัญชีและปลายทางจริงก่อนเรียกว่า production-ready

## เริ่มพัฒนา

ใช้ Node.js 22 และ npm:

```sh
npm ci
npm run dev
```

ตั้ง `.env.local` ตาม `.env.example` เมื่อจำเป็น เครื่องพัฒนาและ GitHub Pages ใช้ข้อมูลสำเนาใน repo ส่วน Netlify อ่าน Sanity โดยตรง ห้าม commit secret

| คำสั่ง | ใช้สำหรับ |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | CMS validation, rich-text SSR/migration, promotion schedule, upload policy |
| `npm run build` | Next.js server build |
| `npm start` | เปิด server จาก build |
| `npm run verify:links` | ลิงก์ anchor และ asset ของ server ที่เปิดไว้ |
| `npm run verify:metadata` | metadata, headings, alt และ structured data |
| `npm run verify:lead-api` | ฟอร์ม testMode แบบไม่ส่ง/เก็บ lead ใช้กับ CI เท่านั้น |
| `npm run cms:seed` | dry-run การนำเข้า CMS ไม่เขียนข้อมูล |

ชุด verify อ่าน `BASE_URL` โดยค่าเริ่มต้นเป็น `http://127.0.0.1:3000` การตรวจ API ต้องเปิด `LEAD_TEST_MODE=1` เฉพาะ server ใน CI ห้ามเปิดบน public preview/production และห้ามทดสอบด้วยข้อมูลลูกค้าจริง

## GitHub Actions

`Website checks` ตรวจ lint/test/typecheck/build และเปิด server ทดสอบ links/metadata/API แยก job ตรวจ Sanity Studio schema/typecheck/build และ audit โดยไม่ใช้บัญชี CMS เก็บรายงานเว็บใน artifact `ci-logs`

`Publish website preview` รอ Website checks ผ่านจาก push ใน repo นี้ แล้ว checkout commit ที่ผ่านจริงเพื่อ build static และ deploy Pages สามารถสั่ง manual preview build ได้ และมี lint/test/typecheck ก่อน build อีกชั้น

CI ไม่ได้ตรวจ proxy ของโฮสต์จริงหรือพิสูจน์ว่า webhook เก็บไฟล์แล้ว ต้องทดสอบอีกครั้งตอนเชื่อม deployment จริง

## โครงสร้างสำคัญ

- `src/app/`: หน้าทั้งหมด, SEO routes, API lead
- `src/components/`: ส่วน UI, rich text, ฟอร์ม, shared SiteProvider
- `src/content/`: view models/loaders และ snapshot ภาษาไทย
- `src/cms/`: server-only Sanity client, queries และ runtime validation
- `src/lib/site-data.ts`: ข้อมูลกลางสำหรับโหมด snapshot
- `src/app/globals.css`: tokens สีและ typography
- `studio/`: Sanity Studio แยก dependency/config และ schema ภาษาไทย
- `scripts/seed-sanity.ts`: นำเข้า draft โดยไม่เขียนทับเอกสารที่มีแล้ว

## ภาพและเนื้อหา

ใช้ภาพงานจริง NP88 ที่มีอยู่ใน repo และปรับภาพหน้าปกเป็น WebP ขนาดประมาณ 156–207 KiB ต่อภาพ จุดที่ยังไม่มีภาพเหมาะสมคงภาพประกอบเดิมตามคำขอ ไม่สร้างหลักฐานหรือข้อมูลโครงการขึ้นเอง

ราคาแพ็กเกจเดิมที่ยังไม่ยืนยันไม่แสดงใน preview จำนวน 600+ / 700+ และข้อมูลอื่นใน `docs/content-confirmation.md` ยังรอเจ้าของข้อมูลยืนยัน

## ฟอร์มและการเปิดใช้งานจริง

ฟอร์มใช้ consent ที่ไม่เลือกไว้ก่อน, honeypot, Turnstile บน production, MIME/signature validation และจำกัด request 4 MiB / ไฟล์รวม 3 MiB / ต่อไฟล์ 3 MiB / ไม่เกิน 8 ไฟล์ ส่งไฟล์เป็น base64 ไป HTTPS receiver ที่เก็บข้อมูลส่วนตัว ห้ามเก็บ lead ใน public CMS assets

Production ที่ไม่มี receiver หรือ spam protection ไม่รับข้อมูล และไม่มี filesystem fallback คู่มือ migration อธิบาย receiver contract, env, backup, การเปลี่ยน host และเงื่อนไขก่อนเปิดจริง

## เอกสาร

- [ขั้นตอนเชื่อม CMS และ production migration](docs/production-migration.md)
- [คู่มือผู้แก้ไขเนื้อหาภาษาไทย](docs/cms-editor-guide-th.md)
- [ข้อมูลที่ต้องยืนยัน](docs/content-confirmation.md)
- [รายการภาพที่ต้องการ](docs/photo-brief.md)
