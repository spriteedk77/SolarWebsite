# CMS field map

เอกสารนี้คือสัญญาระหว่าง `/admin`, Sanity และหน้าเว็บไซต์จริง ทุกช่องที่ทีมงานเห็นใน Admin ต้องเขียนไปยัง field ด้านล่าง และการเผยแพร่ใช้ Zod model ชุดเดียวกับหน้า public จึงไม่สามารถ publish เอกสารที่หน้าเว็บอ่านไม่ได้

## ข้อมูลเว็บไซต์

| Admin | Sanity document.field | หน้า/คอมโพเนนต์ที่อ่าน | เมื่อไม่มีค่า |
| --- | --- | --- | --- |
| ชื่อบริษัทที่แสดง | `company.companyName` | Header, metadata, schema | บังคับก่อน publish |
| ชื่อนิติบุคคล | `company.legalName` | Footer, privacy, schema | บังคับ |
| สโลแกน / คำอธิบายบริษัท | `company.tagline`, `description` | metadata, About, schema | บังคับ |
| เบอร์ที่แสดง / เบอร์สากล | `company.phone`, `phoneE164` | Header, Footer, Contact, mobile bar, schema | บังคับและตรวจรูปแบบ `+66…` |
| LINE ID / URL | `company.lineId`, `lineUrl` | ทุก contact CTA | บังคับและต้องเป็น HTTPS |
| Facebook URL | `company.facebookUrl` | ทุก contact CTA | ไม่แสดงช่อง Facebook เมื่อว่าง |
| เวลาทำการ | `company.businessHours` | Contact, structured data | ไม่แสดงเมื่อยังไม่ยืนยัน |
| Google Business / Maps embed | `company.googleBusinessProfileUrl`, `googleMapsEmbedUrl` | Contact | ไม่แสดงเมื่อว่าง; embed จำกัด host/path ของ Google Maps |
| ที่อยู่ | `company.address.street/district/province/postalCode` | Footer, Contact, schema | บังคับ; country เดิมถูกเก็บไว้ |
| พื้นที่ให้บริการ | `company.serviceAreas[]` | Hero, Footer, Contact, About, lead form | ชื่อในลิงก์สร้างจากชื่ออังกฤษอัตโนมัติ |
| Hero headline/description/eyebrow | `siteSettings.homepageHeadline`, `homepageDescription`, `homepageServiceMessage` | หน้าแรก Hero | บังคับ |
| ป้ายปุ่มหลัก/รอง | `siteSettings.primaryCTA`, `secondaryCTA` | หน้าแรก Hero | บังคับและจำกัด 50 ตัวอักษร |
| ข้อความท้ายเว็บ | `siteSettings.footerInformation` | Footer | บังคับ |

## รูปหน้าแรก

| Admin | Sanity field | Public | กติกา/fallback |
| --- | --- | --- | --- |
| ภาพพื้นหลังส่วนบน | `siteSettings.heroImage` | `HeroBackground` | ไม่มีก็ใช้ branded blueprint; upload JPG/PNG/WebP, ≤3 MB หลังย่อ, alt บังคับเมื่อมีภาพ |
| ภาพพื้นหลังส่วนประวัติ | `siteSettings.historyBackground` | `HistorySection` | เต็ม section, รูปอยู่ซ้าย/ซ้ายกลางและข้อความขวา; ไม่มีก็ใช้ branded navy/green background ที่ไม่เป็นกล่องว่าง |
| ตำแหน่งภาพประวัติ | `siteSettings.historyImagePosition` | `HistorySection` object-position | `left` เป็นค่าเริ่มต้น; เลือกซ้าย/กลาง/ขวาใน Admin |

`executivePortrait` เป็นชื่อ field รุ่นเก่าและอ่านเพื่อ migration เท่านั้น ไม่มี control ใหม่และไม่ถูกเขียนอีก

## บทความ

| กลุ่ม Admin | Sanity fields | Public |
| --- | --- | --- |
| ชื่อ/URL/สรุป | `title`, `slug.current`, `summary` | listing, detail, metadata; slug สร้างอัตโนมัติและเก็บเดิมเมื่อแก้ |
| หมวด/คำสำคัญ/ผู้เขียน/วันที่ | `category`, `tags[]`, `author`, `publishedAt` | listing, detail, schema |
| เนื้อหา | `content[]` | `RichContent`; ย่อหน้า, H2/H3, quote, bullet, numbered list, safe links, inline image |
| รูปปก | `featuredImage` | card, detail, social image | draft ว่างได้; publish ไม่ได้จนมีรูปจริง+alt |
| บทความเกี่ยวข้อง | `related[]` references | ท้าย detail | URL ที่หาไม่พบถูกปฏิเสธก่อนบันทึก |
| FAQ | `faq[]` | detail/schema | รูปแบบ `คำถาม | คำตอบ`; แถวไม่ครบไม่ถูกเขียน |
| SEO/แนะนำ | `seoTitle`, `seoDescription`, `featured` | metadata/home listing | SEO ว่างแล้ว fallback ไป title/summary |
| สถานะ | draft + `approvedForPublication` | query public | แยก Save draft / Publish; delete ลบ draft+published หลังยืนยัน |

## โครงการ

| กลุ่ม Admin | Sanity fields | Public |
| --- | --- | --- |
| ชื่อ/URL/สรุป/ลูกค้า/สถานที่ | `title`, `slug.current`, `summary`, `customerName`, `customerType`, `location`, `province` | listing, detail, metadata; slug อัตโนมัติ |
| ระบบ | `systemCapacity`, `phase`, `systemType`, `zeroExport`, `monitoring` | card/detail/specification |
| อุปกรณ์ | `solarPanels`, `panelQuantity`, `inverter`, `battery`, `optimizer` | card/detail |
| ผลประหยัด | `estimatedSavings` | card/detail | optional และ public ใส่ disclaimer ว่าเป็นค่าประมาณ |
| มาตรฐาน/ขอบเขต/ประกัน | `standards[]`, `servicesIncluded[]`, `warranty[]` | detail | optional; ห้ามกรอก claim ที่ยังไม่ยืนยัน |
| รายละเอียด | `content[]` | detail RichContent | editor และกติกาเดียวกับบทความ |
| ปก/แกลเลอรี | `coverImage`, `gallery[]` | card, detail, social image | draft ว่างได้; publish ต้องมีปกจริง+alt; เพิ่ม/ลบ/เรียง gallery ได้ |
| SEO/แนะนำ/วันที่ | `seoTitle`, `seoDescription`, `featured`, `publishedAt`, `updatedAt` | metadata, homepage, sitemap | เผยแพร่เฉพาะวันที่ถึงกำหนด |
| สถานะ | draft + `approvedForPublication` | query public | CRUD ครบและตรวจ `projectModel` ก่อน publish |

## โปรโมชั่น/แพ็กเกจ

หน้า public อ่านเฉพาะ Sanity `promotion` ที่ `approvedForPublication=true`, `active=true` และอยู่ในช่วง `startDate`–`endDate`; ถ้าไม่มีรายการที่ผ่านกติกา `HomePackageCard` ไม่ render ทั้งส่วน จึงไม่มีราคาเก่าหรือแพ็กเกจปลอมค้างบนหน้าเว็บ

Promotion ยังเป็น advanced/debug workflow ใน Sanity Studio ไม่ได้เปิด control ใน custom Admin: `title`, `slug`, `price`, `systemSize`, `phase`, `solarPanel`, `panelQuantity`, `battery`, `includedServices`, `terms`, `image`, `active`, `startDate`, `endDate`, `approvedForPublication`. รูปเป็น `siteImage` และใช้กติกา alt/CDN เดียวกัน การตัดสินใจนี้ตั้งใจให้โปรโมชั่นที่มีผลด้านราคา/เวลาอยู่หลังขั้นยืนยันขั้นสูงจนกว่าเจ้าของจะยืนยัน workflow ปกติ

## เนื้อหาคงที่และ fallback ที่ตั้งใจ

- ประวัติย่อ, workflow, solutions, products, FAQ หน้าแรก และ legal copy ยัง versioned ใน `src/lib/site-data.ts` / `src/content/th/*`; ไม่มี control หลอกใน Admin
- Netlify คือ public live-CMS boundary และอ่าน published Sanity เท่านั้น ไม่มี silent fallback. Local/GitHub Pages เป็น snapshot สำหรับ review
- ภาพประกอบ SVG ใน snapshot เป็น branded editorial diagrams ไม่ได้อ้างว่าเป็นภาพถ่ายจริง; published CMS article/project ถูกปฏิเสธถ้ายังเป็น placeholder
- claims ที่ยังไม่ยืนยันอยู่ใน `src/lib/pending.ts` และต้องไม่ถูกเพิ่มลง Admin/public ก่อนมีหลักฐาน
