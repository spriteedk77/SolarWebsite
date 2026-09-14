# ตรวจสอบ revision

## รอบที่ 2 — 14 กันยายน 2026 (หลัง 30bd49b)

### สิ่งที่แก้

- **ลิงก์เสียบน GitHub Pages** — `/solutions` ใช้ `<a href="/solutions#...">` ธรรมดา 5 จุด Next.js เติม `basePath` ให้เฉพาะ `next/link` และ `next/image` ลิงก์เหล่านี้จึงชี้ออกนอก `/SolarWebsite` และ 404 บน preview ที่เผยแพร่อยู่จริง เปลี่ยนเป็น `next/link` แล้ว
- **CI ตรวจ static export บน pull request** — เพิ่ม job `static-preview` ใน `Website checks` เดิม export ถูกตรวจเฉพาะใน `Publish website preview` ซึ่งทำงานหลัง push เข้า main เท่านั้น ข้อผิดพลาดแบบ basePath จึงเล็ดลอดผ่าน CI ได้
- **หน้า Contact** — เปลี่ยน container จาก `wide` (88rem) เป็น `default` (72rem) ทั้ง PageHero และ section หลัก หัวเรื่อง คอลัมน์ติดต่อ และ FAQ จึงอยู่ในแนวเดียวกัน คอลัมน์ไม่ถ่างออกจากกันที่ 1440/1920px; การ์ดที่ตั้งสำนักงานเลิก stretch ตามคอลัมน์ซ้าย (`items-start`) จึงไม่เหลือพื้นที่ว่างก้อนใหญ่ที่ 768–1024px; พื้นที่ให้บริการเปลี่ยนจาก grid 5 คอลัมน์เป็น chip ที่ wrap เอง ไม่เหลือช่องว่างค้างท้ายแถว
- **คำอธิบายใต้หัวเรื่องหน้าแรก** — ใช้ข้อความที่ลูกค้ากำหนด ครอบคลุมสำรวจ/วิเคราะห์/ออกแบบ/ติดตั้ง และบริการหลังการขาย

### ผลการตรวจ

- ESLint, TypeScript, tests 6 รายการ และ production build ผ่าน
- `verify:links` crawl 47 หน้า 28 assets ไม่พบลิงก์/anchor/asset เสีย
- `verify:metadata` 16 routes ไม่พบ structural/metadata errors
- `verify:lead-api` 10 เคสผ่าน ไม่มีการส่งข้อมูลออกนอกเครื่อง
- Static export (`GITHUB_PAGES=true`) + `verify-static-preview.mjs`: 31 หน้า 78 ลิงก์/assets ผ่าน base path `/SolarWebsite` — ก่อนแก้ job นี้ fail 5 รายการ
- วัด document overflow ที่ 390, 430, 768, 820, 1024, 1280, 1440, 1920px บนหน้าแรก, Contact, quote, project detail และบทความ ไม่พบ horizontal overflow (ช่อง honeypot ที่ซ่อนนอกจอเป็นพฤติกรรมตั้งใจ)
- แถบติดต่อล่าง: แสดงที่ 390/430px ซ่อนสนิทตั้งแต่ 768px ขึ้นไป รวม iPad 820/1024px ใช้ breakpoint อย่างเดียว ไม่มี device detection
- ไม่พบ browser console errors ระหว่างตรวจ

### ยังไม่ได้แก้ (ตั้งใจ)

- ปุ่มบน `/solutions` ใช้ข้อความ "ให้ทีมงานช่วยเลือกระบบ" ไปที่ `/quote` ซึ่งต่างจาก `cta.primary` ทั้งที่เป็นปลายทางและจุดประสงค์เดียวกัน เป็นเรื่องถ้อยคำ ไม่ใช่ข้อบกพร่อง รอตัดสินใจร่วมกับ NP88
- จำนวนไซต์งาน 600+ / 700+ ยังไม่แสดงบนเว็บไซต์ รอ NP88 ยืนยันตัวเลขและวันที่อ้างอิง

---

## รอบที่ 1 — 14 กันยายน 2026

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
