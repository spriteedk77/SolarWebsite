# ตรวจสอบ revision — 14 กันยายน 2026

## ผลในเครื่องก่อน push

- ESLint, TypeScript และ Next.js production build ผ่าน
- Tests 6 รายการผ่าน: ลิงก์ปลอดภัย, ช่วงเวลาโปรโมชั่น, แปลง rich text, validate โครงการ, เนื้อหา CMS ใน server HTML, ขีดจำกัดอัปโหลด
- Migration dry-run เตรียม 19 drafts โดยไม่เขียนข้อมูลภายนอก
- Studio typecheck, schema extraction และ build ผ่าน ใช้ identifiers สำหรับ compiler test เท่านั้น ไม่ได้สร้างหรือเชื่อม project จริง
- npm audit ของเว็บไซต์และ Studio ไม่พบ vulnerability ณ เวลาตรวจ
- Crawl 47 หน้าและ 28 assets: ไม่มีลิงก์/anchor/asset เสีย
- ตรวจ metadata 16 routes: ไม่พบ structural/metadata errors หรือ warnings

## Responsive และ visual QA

วัดหน้าแรก, Contact, quote, project detail, article, project listing และ about ที่ 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920px รวม 63 กรณี ไม่พบ document overflow แถบติดต่อแสดงต่ำกว่า 768px และซ่อนตั้งแต่ 768px ขึ้นไป ช่อง honeypot ที่ซ่อนไว้นอกจอเป็นพฤติกรรมตั้งใจ

ตรวจภาพหน้าจอด้วยตาที่: Hero 390/1024/1280/1440/1920, Contact 430/768/820, การ์ดโครงการ 1440, หน้าโครงการ 430, ฟอร์มและ mobile menu 390, บทความ 820 พบ Header CTA ขึ้นสองบรรทัดที่ 1280 และแก้ระยะเมนูแล้ว

ตรวจหน้าแรก/Contact ซ้ำครบ 9 ขนาดหลังแก้ Header: ไม่พบ overflow และ Header สูงสม่ำเสมอ 72px บนเมนูมือถือ, 109px เมื่อแสดง utility strip/desktop navigation ปุ่ม CTA กลับมาอยู่ในแถบเดียวกัน

เปิด/ปิดเมนูมือถือด้วย Escape ได้ และไม่พบ browser console errors ระหว่างตรวจ ภาพงานจริงที่มีอยู่แสดงได้ จุดที่ไม่มีภาพยังใช้ภาพประกอบเดิมตามคำขอ

## ขอบเขตที่ยังไม่ยืนยัน

- การใช้ Sanity จริง: login, สิทธิ์, upload, draft/publish, slug ใหม่, sitemap refresh และการมองเห็นข้อมูลจาก private dataset
- รูปแบบเนื้อหา CMS ผ่าน SSR test แต่ยังไม่ได้ตรวจ visual ด้วยเอกสารจากบัญชีจริง
- Turnstile และการส่ง/เก็บ bytes ที่ receiver จริง รวมข้อจำกัด proxy บนโฮสต์ที่จะเลือก
- การอนุมัติเนื้อหา/รูปภาพ/ราคาจากลูกค้า และ Privacy Policy

Static export ในเครื่องครั้งแรกติด Next dev type cache เก่าที่อ้าง API route หลังถอด route สำหรับ Pages จึงให้ workflow ตรวจใหม่จาก checkout สะอาด โดย `Publish website preview` รอ Website checks ผ่านจาก commit เดียวกัน และตรวจ path ของ exported routes/assets ก่อน deploy

ตรวจผล CI และ deploy ล่าสุดได้ที่ [GitHub Actions](https://github.com/spriteedk77/SolarWebsite/actions) การตรวจในเอกสารนี้ยังไม่ใช่การรับรองว่าเว็บไซต์พร้อมเปิดรับข้อมูลลูกค้าจริง
