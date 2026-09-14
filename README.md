# NP88 Solar — เว็บไซต์บริษัท

เว็บไซต์ของ **NP88 Solar** โดย NP88 Engineering Co., Ltd. — ออกแบบ วิเคราะห์
และติดตั้งระบบ Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงาน ในเชียงใหม่ ลำพูน
เชียงราย ลำปาง และพะเยา

> **Engineering Your Energy Future.**

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · ไม่มี dependency
สำหรับ UI เพิ่มเติม

---

## เริ่มต้นใช้งาน

```bash
npm install
cp .env.example .env.local   # แล้วแก้ค่าตามสภาพแวดล้อม
npm run dev
```

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run dev` | เซิร์ฟเวอร์สำหรับพัฒนา ที่ http://localhost:3000 |
| `npm run build` | build สำหรับ production |
| `npm start` | รันผลลัพธ์ที่ build แล้ว |
| `npm run typecheck` | ตรวจ TypeScript อย่างเดียว |
| `npm run verify` | รันชุดตรวจสอบทั้งหมดด้านล่าง ต่อกัน (ต้องมีเซิร์ฟเวอร์รันอยู่) |
| `npm run verify:links` | ไล่ลิงก์ภายในทั้งหมด ตรวจ anchor และ asset ที่เสีย |
| `npm run verify:metadata` | ตรวจโครงสร้าง heading, meta, JSON-LD, และว่า og:image เป็น raster เสมอ |
| `npm run verify:lead-api` | ยิง `/api/lead` ด้วย `testMode=1` ตรวจ validation โดยไม่สร้าง lead จริง |

สคริปต์ทั้งสามอ่านเป้าหมายจาก `BASE_URL` (ค่าเริ่มต้น `http://127.0.0.1:3000`)
รันเซิร์ฟเวอร์ไว้ก่อน (`npm run dev` หรือ `npm start`) แล้วค่อยเรียก เช่น:

```bash
npm run build && npm start &
npm run verify
```

**`verify:lead-api` ต้องมี `LEAD_TEST_MODE=1` ที่ฝั่งเซิร์ฟเวอร์ด้วย** ไม่งั้นสคริปต์
จะปฏิเสธไม่รันต่อทันที (เพราะ request แรกจะไปโดน delivery จริงแทนที่จะถูกข้าม)
ตั้งค่าตัวแปรนี้เฉพาะตอนทดสอบเท่านั้น **ห้ามตั้งใน production**

---

## Continuous Integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) รันอัตโนมัติทุกครั้งที่ push
เข้า `main` หรือเปิด pull request: `typecheck` → `build` → เปิด `next start`
ในเครื่อง runner → รันชุด `verify` ทั้งสามตัวข้างต้น แล้วเก็บ log และรายงานไว้เป็น
artifact (`ci-logs`) ให้ดูย้อนหลังได้

CI ไม่ได้แทนที่การทดสอบบนโฮสต์จริง เพราะมองไม่เห็นข้อจำกัดของ proxy/edge
ของแต่ละแพลตฟอร์ม (เช่น payload limit ของ Railway) — จุดนั้นยังต้องทดสอบบน
Railway Trial อีกครั้งก่อนเปิดใช้งานจริง ลำดับที่แนะนำ:

```
push → GitHub Actions (ฟรี, ทุกครั้ง) → ผ่านแล้วค่อย deploy Railway Trial (ทดสอบ proxy/อัปโหลดจริง) → Railway Hobby (เปิดใช้งานจริง)
```

---

## ⚠️ อ่านก่อนนำขึ้นใช้งานจริง

เว็บไซต์นี้สร้างขึ้นภายใต้กติกาว่า **ห้ามแต่งข้อมูลขึ้นเอง** ข้อมูลที่ยังไม่ได้รับ
การยืนยันจาก NP88 Solar ถูกรวบรวมไว้ที่
[`docs/content-confirmation.md`](docs/content-confirmation.md) และในโค้ดที่
[`src/lib/pending.ts`](src/lib/pending.ts)

หลักที่ใช้คือ **ข้อมูลที่ยังไม่ยืนยัน = ไม่เผยแพร่** (ไม่ใช่เผยแพร่พร้อมคำเตือน)
หมายเหตุสำหรับทีมงานไม่ปรากฏบนหน้าเว็บที่ลูกค้าเห็นอีกต่อไป

เรื่องสำคัญที่สุดสองข้อ:

1. **จำนวนไซต์งาน** — สื่อชุดเก่าระบุ 600+ ชุดใหม่ 700+ จึง **ถอดออกจากหน้าเว็บแล้ว**
   จะใส่กลับเมื่อได้ตัวเลขที่ยืนยันพร้อมวันที่อ้างอิง
2. **ภาพถ่ายงานติดตั้งจริง** — ตอนนี้ใช้กราฟิกกลาง ๆ ในสีแบรนด์
   ดูรายการภาพที่ต้องการที่ [`docs/photo-brief.md`](docs/photo-brief.md)

---

## โครงสร้างโปรเจกต์

```
src/
├── app/                      # เส้นทางทั้งหมด (App Router)
│   ├── layout.tsx            # โครงหลัก ฟอนต์ Header/Footer องค์กร JSON-LD
│   ├── page.tsx              # หน้าแรก (14 ส่วนตามลำดับการเล่าเรื่อง)
│   ├── solar-home/           # Solar สำหรับบ้าน
│   ├── solar-business/       # Solar สำหรับธุรกิจ
│   ├── solutions/            # โซลูชันทั้งหมด
│   ├── projects/             # ผลงานติดตั้ง + [slug] case study
│   ├── products/             # สินค้าและเทคโนโลยี
│   ├── knowledge/            # ศูนย์ความรู้ + [slug] บทความ
│   ├── about/  contact/  quote/
│   ├── privacy/  cookie-policy/
│   ├── api/lead/route.ts     # รับฟอร์มขอประเมินระบบ
│   ├── opengraph-image.tsx   # สร้างภาพ OG เป็น PNG จริง
│   ├── sitemap.ts  robots.ts  icon.svg  not-found.tsx
│   └── globals.css           # ดีไซน์ซิสเท็มทั้งหมด (Tailwind v4 @theme)
│
├── components/
│   ├── layout/               # Header, DesktopNav, MobileNav, Footer,
│   │                         # MobileContactBar, PageHero
│   ├── ui/                   # Container, Section, Button, Card, Badge,
│   │                         # Icon, Figure, Note, Breadcrumb, PlaceholderBadge
│   ├── cards/                # SolutionCard, ProjectCard, ProductCard,
│   │                         # KnowledgeCard, BusinessTypeCard
│   ├── sections/             # บล็อกที่ใช้ซ้ำหลายหน้า (Process, FAQ, Lead, …)
│   ├── home/                 # ส่วนที่ใช้เฉพาะหน้าแรก
│   ├── forms/LeadForm.tsx    # ฟอร์มขอประเมิน (client component เดียวที่ใหญ่)
│   ├── consent/              # แบนเนอร์คุกกี้ + ปุ่มแก้ไขการตั้งค่า
│   ├── knowledge/            # ตัวเรนเดอร์เนื้อหาบทความ + สารบัญ
│   └── seo/JsonLd.tsx
│
├── content/
│   ├── types.ts              # โมเดลข้อมูล (รูปทรงเดียวกับ CMS)
│   ├── index.ts              # loader — จุดเดียวที่ต้องแก้เมื่อต่อ CMS
│   └── th/                   # เนื้อหาภาษาไทยทั้งหมด
│       ├── projects.ts  articles.ts  products.ts
│       └── solutions.ts  faqs.ts  pages.ts
│
└── lib/
    ├── site.ts               # NAP, เมนู, CTA, disclaimer (แหล่งข้อมูลเดียว)
    ├── seo.ts                # ตัวสร้าง metadata + canonical + hreflang
    ├── schema.ts             # ตัวสร้าง Schema.org
    ├── i18n.ts               # โครงสำหรับเพิ่มภาษาอังกฤษภายหลัง
    ├── pending.ts            # ทะเบียนข้อมูลที่รอการยืนยัน
    └── utils.ts
```

---

## การจัดการเนื้อหา

โมเดลข้อมูลใน `src/content/types.ts` ออกแบบให้ตรงกับ collection ของ headless CMS
(Sanity / Strapi / Payload) แบบหนึ่งต่อหนึ่ง:

- `Project` — id, slug, title, location, customerType, systemCapacityKw, phase,
  solarPanel, panelQuantity, inverter, battery, systemType, estimatedSavings,
  gallery, description, publishedAt
- `Article` — id, slug, title, summary, content, category, tags, featuredImage,
  publishedAt, updatedAt
- `Product` — id, brand, name, category, description, specifications, image

**การต่อ CMS:** แก้เฉพาะ body ของฟังก์ชันใน `src/content/index.ts` ให้ไปเรียก CMS
ฟังก์ชันเหล่านี้เป็น `async` อยู่แล้ว จึงไม่ต้องแก้หน้าเว็บหรือคอมโพเนนต์ใด ๆ เลย

---

## การรองรับภาษาอังกฤษในอนาคต

ภาษาไทยคือภาษาหลักและเสิร์ฟที่ root path (`/`, `/projects`, …)
โครงสร้างพร้อมสำหรับภาษาอังกฤษแล้ว:

1. `src/lib/i18n.ts` มี `locales`, `defaultLocale`, `enabledLocales` และ
   `localeHref()` อยู่แล้ว
2. `buildMetadata()` สร้าง `alternates.languages` (hreflang) อัตโนมัติ
   ตาม `enabledLocales`
3. `src/content/index.ts` รับ `locale` และ fallback กลับเป็นภาษาไทยเสมอ

**ขั้นตอนเพิ่มภาษาอังกฤษ:** สร้าง `src/content/en/*` → เพิ่ม `en` ใน `bundles`
→ เพิ่ม `'en'` ใน `enabledLocales` → สร้าง route group `/en` ที่เรียกคอมโพเนนต์
หน้าเดิมโดยส่ง `locale="en"` (URL ภาษาไทยไม่เปลี่ยน)

---

## ฟอร์มขอประเมินระบบ

`POST /api/lead` รับ `multipart/form-data` (ข้อมูล + ไฟล์บิลค่าไฟ/รูปหลังคา)
ตรวจสอบข้อมูลซ้ำฝั่งเซิร์ฟเวอร์เสมอ และมี honeypot กันบอท

การส่งต่อข้อมูลเลือกได้จาก environment:

| ตั้งค่า | ผลลัพธ์ |
| --- | --- |
| `LEAD_WEBHOOK_URL` | POST ข้อมูลเป็น JSON ไปยัง Make / Zapier / n8n / LINE OA |
| ไม่ตั้งค่า | เขียนไฟล์ลง `./.data/leads/` — **สำหรับพัฒนาเท่านั้น** |

**ขีดจำกัดที่บังคับใช้ฝั่งเซิร์ฟเวอร์** (ตรวจก่อนอ่านไฟล์เข้าหน่วยความจำ):

| รายการ | ค่า |
| --- | --- |
| ขนาด request รวม | 30 MB |
| ไฟล์แนบรวมกัน | 25 MB |
| ขนาดต่อไฟล์ | 10 MB |
| จำนวนไฟล์ | 8 |
| ชนิดไฟล์ | PDF, JPEG, PNG, WEBP, HEIC/HEIF |

ถ้ามี `Content-Length` จะตัดทิ้งตั้งแต่ยังไม่แตะ body เลย ถ้าไม่มี (chunked)
จะอ่านแบบสตรีมและยกเลิกทันทีที่เกินเพดาน — ดู `readBodyWithCap()`
**เพิ่มขีดจำกัดที่ชั้น proxy ด้วย** เช่น nginx `client_max_body_size 30m;`

**Test mode:** ส่ง `testMode=1` (เฉพาะนอก production) จะตรวจสอบครบทุกขั้นตอน
แต่ไม่ส่งต่อและไม่เขียนไฟล์ ใช้สำหรับทดสอบ end-to-end โดยไม่สร้าง lead จริง

**ทำงานได้แม้ไม่มี JavaScript:** ฟอร์มมี `action`/`method` จริง
เมื่อ JS ใช้ไม่ได้ เบราว์เซอร์จะ POST ตามปกติและ endpoint จะ redirect
กลับมาที่ `/quote?sent=1` หรือ `/quote?error=…`

**ก่อน production:** ตั้ง `LEAD_WEBHOOK_URL`, ย้ายไฟล์แนบไปเก็บใน object storage
ที่มีการควบคุมสิทธิ์ และพิจารณาเพิ่ม rate limit

---

## PDPA และความเป็นส่วนตัว

- แบนเนอร์คุกกี้ **ไม่ติ๊กช่องยินยอมไว้ล่วงหน้า** และปุ่ม "ใช้เฉพาะที่จำเป็น"
  เด่นเท่ากับ "ยอมรับทั้งหมด"
- ยังไม่มีสคริปต์วิเคราะห์หรือโฆษณาใด ๆ ติดตั้งอยู่ หากจะเพิ่ม
  ต้องโหลดหลังตรวจสอบ `getConsent()` ใน
  `src/components/consent/CookieConsent.tsx` เท่านั้น
- ฟอร์มมี checkbox ความยินยอมแบบบังคับ พร้อมอธิบายว่าเก็บอะไรและใช้ทำอะไร
  ตรงจุดนั้นเลย ไม่ใช่ซ่อนไว้ในหน้า privacy อย่างเดียว
- ประกาศความเป็นส่วนตัวและนโยบายคุกกี้เป็น **ร่าง** ควรให้ที่ปรึกษากฎหมาย
  ตรวจสอบก่อนใช้งานจริง

---

## SEO

- Title / meta description / canonical / hreflang / Open Graph ต่อหน้า
  ผ่าน `buildMetadata()`
- ภาพ OG สร้างเป็น PNG จริงที่ `/opengraph-image`
  `resolveSocialImage()` บังคับว่า **og:image / twitter:image /
  Article structured-data image ต้องเป็นไฟล์ raster เท่านั้น**
  ถ้าหน้าไหนยังใช้ภาพ `.svg` อยู่จะ fallback ไปใช้ PNG นั้นให้อัตโนมัติ
  และจะสลับไปใช้ภาพถ่ายจริงเองทันทีที่ไฟล์เป็น `.jpg` / `.webp`
- `sitemap.xml` และ `robots.txt` สร้างจาก content loader เดียวกับหน้าเว็บ
  จึงไม่มีทางหลุดจากกัน
- Structured data: `Organization` + `LocalBusiness`, `WebSite`, `Service`,
  `Article`, `FAQPage`, `BreadcrumbList`, `CreativeWork` (โครงการ)
- **ไม่มี** `aggregateRating` หรือ review markup — ห้ามสร้างรีวิวปลอม

---

## Accessibility

ยึดตาม WCAG 2.2 ระดับ AA เท่าที่ทำได้จริง:

- HTML เชิงความหมาย ลำดับหัวข้อถูกต้อง (ตรวจอัตโนมัติแล้ว ไม่มีการข้ามระดับ)
- Skip link, focus indicator ที่มองเห็นชัด, focus trap ในเมนูมือถือ
- FAQ ใช้ `<details>`/`<summary>` ของเบราว์เซอร์ — เข้าถึงได้และไม่ต้องใช้ JS
- ฟอร์มมี `<label>` จริงทุกช่อง, `aria-describedby` สำหรับคำอธิบาย,
  error summary ที่โฟกัสและประกาศได้
- **คอนทราสต์:** ปุ่มสีส้มและสีเขียว LINE ใช้ตัวอักษรสีกรมท่า ไม่ใช่สีขาว
  (ขาวบนส้ม = 2.6:1 และขาวบนเขียว LINE = 2.3:1 ซึ่งไม่ผ่าน AA
  ส่วนกรมท่าบนสีเดียวกัน = 7.5:1 และ 8.5:1)
- ไม่ใช้สีเพียงอย่างเดียวสื่อความหมาย — เมนูหน้าปัจจุบันมีขีดใต้,
  กล่องหมายเหตุมีทั้งไอคอนและข้อความกำกับ

---

## Performance

- Server Component เป็นค่าเริ่มต้น — มี client component เพียง 4 ตัว
  (เมนูมือถือ, เมนูเดสก์ท็อป, ฟอร์ม, แบนเนอร์คุกกี้)
- ไม่มีไลบรารี animation, ไม่มีไลบรารีไอคอน, ไม่มี CSS framework runtime
- ฟอนต์ self-host ผ่าน `next/font` (ไม่มี request ไป Google, ไม่มี layout shift)
- ภาพผ่าน `next/image` พร้อม AVIF/WebP และ `sizes` ที่ระบุชัดทุกจุด
  มีเพียงภาพ LCP เท่านั้นที่ตั้ง `priority`
- แผนที่ Google ใช้ `loading="lazy"` และจะแสดงก็ต่อเมื่อตั้งค่า env แล้ว

---

## เอกสารเพิ่มเติม

- [`docs/content-confirmation.md`](docs/content-confirmation.md) — รายการข้อมูลที่ต้องยืนยัน
- [`docs/photo-brief.md`](docs/photo-brief.md) — ภาพถ่ายที่ต้องการ
