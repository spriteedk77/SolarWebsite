import { defineType, defineField, defineArrayMember } from 'sanity';

const requiredString = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'string',
    group,
    validation: (r) => r.required(),
  });
const optionalString = (name: string, title: string, group?: string) =>
  defineField({ name, title, type: 'string', group });
const text = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'text',
    rows: 3,
    group,
    validation: (r) => r.required(),
  });
const strings = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    group,
    of: [defineArrayMember({ type: 'string' })],
  });
const number = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'number',
    group,
    validation: (r) => r.required().positive(),
  });
const slug = (group = 'details') =>
  defineField({
    name: 'slug',
    title: 'ชื่อใน URL',
    type: 'slug',
    group,
    options: { source: 'title', maxLength: 96 },
    description:
      'ใช้ตัวอักษร a–z ตัวเลข และขีดกลาง เช่น clinic-chiang-mai หลังเผยแพร่แล้วควรคง URL เดิม',
    validation: (r) =>
      r
        .required()
        .custom(
          (v) =>
            !v?.current ||
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.current) ||
            'ใช้ตัวอักษรภาษาอังกฤษตัวเล็ก ตัวเลข และขีดกลาง',
        ),
  });
const phase = (group?: string) =>
  defineField({
    name: 'phase',
    title: 'ระบบไฟฟ้า',
    type: 'string',
    group,
    options: { list: ['1 เฟส', '3 เฟส'] },
    validation: (r) => r.required(),
  });
const seo = [
  defineField({
    name: 'seoTitle',
    title: 'ชื่อสำหรับผลการค้นหา',
    type: 'string',
    group: 'seo',
    validation: (r) => r.max(100),
    description: 'หากเว้นว่าง ใช้ชื่อเนื้อหา',
  }),
  defineField({
    name: 'seoDescription',
    title: 'คำอธิบายสำหรับผลการค้นหา',
    type: 'text',
    rows: 3,
    group: 'seo',
    validation: (r) => r.max(240),
    description: 'หากเว้นว่าง ใช้คำอธิบายย่อ',
  }),
];
const verified = (group?: string) =>
  defineField({
    name: 'approvedForPublication',
    title: 'ตรวจสอบข้อมูลและสิทธิ์ใช้ภาพแล้ว',
    type: 'boolean',
    group,
    initialValue: false,
    description:
      'ยืนยันข้อมูลจริง สิทธิ์เปิดเผยชื่อลูกค้า/สถานที่ รูปภาพ ราคา และเงื่อนไขก่อนเผยแพร่ ห้ามใช้จำนวน 600+/700+ จนกว่าลูกค้ายืนยัน',
    validation: (r) =>
      r
        .required()
        .custom(
          (v) => v === true || 'ต้องตรวจสอบข้อมูลและสิทธิ์ใช้ภาพก่อนเผยแพร่',
        ),
  });
const status = [
  defineField({
    name: 'featured',
    title: 'แนะนำบนหน้าแรก',
    type: 'boolean',
    group: 'publishing',
    initialValue: false,
  }),
  defineField({
    name: 'publishedAt',
    title: 'วันที่เผยแพร่',
    type: 'datetime',
    group: 'publishing',
    initialValue: () => new Date().toISOString(),
    description: 'เลือกวันในอดีตหรือวันนี้ เนื้อหาวันอนาคตยังไม่แสดงบนเว็บไซต์',
    validation: (r) => r.required(),
  }),
  defineField({
    name: 'updatedAt',
    title: 'วันที่ปรับปรุงเนื้อหา (ถ้ามี)',
    type: 'datetime',
    group: 'publishing',
    description: 'เว้นว่างเพื่อใช้วันที่แก้ไขล่าสุดในระบบ',
  }),
  verified('publishing'),
];
const image = defineType({
  name: 'siteImage',
  title: 'รูปภาพ',
  type: 'image',
  fields: [
    requiredString('alt', 'คำอธิบายภาพสำหรับผู้ใช้โปรแกรมอ่านหน้าจอ'),
    optionalString('caption', 'คำบรรยายใต้ภาพ'),
    defineField({
      name: 'legacySrc',
      title: 'ภาพประกอบเดิม',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
  validation: (r) =>
    r.custom((v) => Boolean(v?.asset) || 'อัปโหลดรูปภาพก่อนเผยแพร่'),
});
const table = defineType({
  name: 'contentTable',
  title: 'ตาราง',
  type: 'object',
  fields: [
    optionalString('caption', 'ชื่อตาราง'),
    defineField({
      name: 'head',
      title: 'หัวคอลัมน์',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'rows',
      title: 'แถวข้อมูล',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          title: 'แถว',
          fields: [
            defineField({
              name: 'cells',
              title: 'ข้อความแต่ละคอลัมน์',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  validation: (r) =>
    r.custom((v) => {
      const t = v as
        { head?: string[]; rows?: { cells?: string[] }[] } | undefined;
      return (
        !t?.rows ||
        t.rows.every((row) => row.cells?.length === t.head?.length) ||
        'ทุกแถวต้องมีจำนวนช่องเท่ากับหัวคอลัมน์'
      );
    }),
});
const richText = defineType({
  name: 'richText',
  title: 'เนื้อหา',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'ย่อหน้า', value: 'normal' },
        { title: 'หัวข้อหลัก', value: 'h2' },
        { title: 'หัวข้อย่อย', value: 'h3' },
        { title: 'ข้อความอ้างอิง', value: 'blockquote' },
      ],
      lists: [
        { title: 'รายการหัวข้อ', value: 'bullet' },
        { title: 'รายการลำดับ', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'ตัวหนา', value: 'strong' },
          { title: 'ตัวเอียง', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'ลิงก์',
            fields: [
              defineField({
                name: 'href',
                title: 'ปลายทางลิงก์',
                type: 'url',
                validation: (r) =>
                  r
                    .required()
                    .uri({
                      allowRelative: true,
                      scheme: ['https', 'http', 'mailto', 'tel'],
                    }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'siteImage' }),
    defineArrayMember({ type: 'contentTable' }),
  ],
});
const body = defineField({
  name: 'content',
  title: 'รายละเอียด',
  type: 'richText',
  group: 'details',
  validation: (r) => r.required().min(1),
});
const groups = [
  { name: 'details', title: 'ข้อมูลโครงการ', default: true },
  { name: 'system', title: 'ระบบ Solar' },
  { name: 'equipment', title: 'อุปกรณ์' },
  { name: 'savings', title: 'ผลประหยัดโดยประมาณ' },
  { name: 'images', title: 'รูปภาพ' },
  { name: 'seo', title: 'SEO' },
  { name: 'publishing', title: 'สถานะเผยแพร่' },
];
const project = defineType({
  name: 'project',
  title: 'ผลงานติดตั้ง',
  type: 'document',
  groups,
  fields: [
    requiredString('title', 'ชื่อโครงการ', 'details'),
    slug(),
    optionalString('customerName', 'ชื่อลูกค้า (เมื่อได้รับอนุญาต)', 'details'),
    defineField({
      name: 'customerType',
      title: 'ประเภทลูกค้า',
      type: 'string',
      group: 'details',
      options: {
        list: [
          ['residential', 'บ้าน'],
          ['sme', 'ธุรกิจ SME'],
          ['restaurant', 'ร้านอาหาร'],
          ['shop', 'ร้านค้า'],
          ['clinic', 'คลินิก'],
          ['office', 'สำนักงาน'],
          ['warehouse', 'คลังสินค้า'],
          ['factory', 'โรงงาน'],
          ['commercial', 'อาคารพาณิชย์'],
        ].map(([value, title]) => ({ value, title })),
      },
    }),
    requiredString('location', 'สถานที่', 'details'),
    requiredString('province', 'จังหวัด', 'details'),
    text('summary', 'คำอธิบายย่อ', 'details'),
    body,
    number('systemCapacity', 'กำลังติดตั้ง (kW)', 'system'),
    phase('system'),
    requiredString('systemType', 'ประเภทระบบ', 'system'),
    defineField({
      name: 'zeroExport',
      title: 'ใช้ Zero Export',
      type: 'boolean',
      group: 'system',
      initialValue: false,
    }),
    optionalString('monitoring', 'ระบบติดตามการผลิตไฟ', 'system'),
    requiredString('solarPanels', 'รุ่นแผง Solar', 'equipment'),
    defineField({
      name: 'panelQuantity',
      title: 'จำนวนแผง',
      type: 'number',
      group: 'equipment',
      validation: (r) => r.required().integer().positive(),
    }),
    optionalString('inverter', 'อินเวอร์เตอร์', 'equipment'),
    optionalString('battery', 'แบตเตอรี่', 'equipment'),
    optionalString('optimizer', 'Optimizer', 'equipment'),
    defineField({
      name: 'estimatedSavings',
      title: 'ประหยัดค่าไฟโดยประมาณ (บาท/เดือน)',
      type: 'number',
      group: 'savings',
      description:
        'กรอกเฉพาะตัวเลขที่ยืนยันแหล่งข้อมูลได้ เว็บไซต์จะแสดงข้อจำกัดว่าไม่ใช่การรับประกัน',
      validation: (r) => r.min(0),
    }),
    strings('standards', 'มาตรฐานที่ยืนยันได้', 'system'),
    strings('servicesIncluded', 'ขอบเขตงาน', 'system'),
    defineField({
      name: 'warranty',
      title: 'การรับประกันที่ยืนยันแล้ว',
      type: 'array',
      group: 'equipment',
      of: [
        {
          type: 'object',
          fields: [
            requiredString('label', 'หัวข้อ'),
            requiredString('value', 'รายละเอียด'),
            optionalString('note', 'เงื่อนไข'),
          ],
        },
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'ภาพหน้าปก',
      type: 'siteImage',
      group: 'images',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'ภาพเพิ่มเติม',
      type: 'array',
      of: [{ type: 'siteImage' }],
      group: 'images',
    }),
    ...seo,
    ...status,
  ],
  preview: {
    select: { title: 'title', subtitle: 'province', media: 'coverImage' },
  },
});
const article = defineType({
  name: 'article',
  title: 'บทความความรู้',
  type: 'document',
  groups: [
    { name: 'details', title: 'เนื้อหาบทความ', default: true },
    { name: 'images', title: 'รูปภาพ' },
    { name: 'seo', title: 'SEO' },
    { name: 'publishing', title: 'สถานะเผยแพร่' },
  ],
  fields: [
    requiredString('title', 'ชื่อบทความ', 'details'),
    slug(),
    text('summary', 'คำอธิบายย่อ', 'details'),
    body,
    defineField({
      name: 'category',
      title: 'หมวดหมู่',
      type: 'string',
      group: 'details',
      options: {
        list: [
          'พื้นฐาน Solar',
          'สำหรับบ้าน',
          'สำหรับธุรกิจ',
          'เทคโนโลยี',
          'ความคุ้มค่า',
          'ในพื้นที่ภาคเหนือ',
        ],
      },
      validation: (r) => r.required(),
    }),
    strings('tags', 'คำสำคัญ', 'details'),
    requiredString('author', 'ผู้เขียน', 'details'),
    defineField({
      name: 'featuredImage',
      title: 'ภาพหน้าปก',
      type: 'siteImage',
      group: 'images',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'related',
      title: 'บทความที่เกี่ยวข้อง',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    }),
    defineField({
      name: 'faq',
      title: 'คำถามท้ายบทความ',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            requiredString('question', 'คำถาม'),
            text('answer', 'คำตอบ'),
          ],
        },
      ],
    }),
    ...seo,
    ...status,
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'featuredImage' },
  },
});
const company = defineType({
  name: 'company',
  title: 'ข้อมูลบริษัทและช่องทางติดต่อ',
  type: 'document',
  fields: [
    requiredString('companyName', 'ชื่อบริษัทที่แสดงบนเว็บ'),
    requiredString('legalName', 'ชื่อนิติบุคคล'),
    requiredString('tagline', 'สโลแกน'),
    text('description', 'คำอธิบายบริษัท'),
    requiredString('phone', 'เบอร์โทรที่แสดง'),
    defineField({
      name: 'phoneE164',
      title: 'เบอร์โทรสำหรับปุ่มโทร',
      type: 'string',
      description: 'รูปแบบสากล เช่น +66956971915',
      validation: (r) => r.required().regex(/^\+[1-9]\d{7,14}$/),
    }),
    requiredString('lineId', 'LINE ID'),
    ...[
      'lineUrl',
      'facebookUrl',
      'googleBusinessProfileUrl',
      'googleMapsEmbedUrl',
    ].map((name) =>
      defineField({
        name,
        title: (
          {
            lineUrl: 'ลิงก์ LINE',
            facebookUrl: 'ลิงก์เพจ Facebook',
            googleBusinessProfileUrl: 'ลิงก์ Google Business Profile',
            googleMapsEmbedUrl: 'ลิงก์แผนที่ฝัง (ไม่จำเป็น)',
          } as Record<string, string>
        )[name],
        type: 'url',
        validation: (r) =>
          name === 'lineUrl'
            ? r.required().uri({ scheme: ['https'] })
            : r.uri({ scheme: ['https'] }),
      }),
    ),
    optionalString('businessHours', 'เวลาทำการที่ยืนยันแล้ว'),
    defineField({
      name: 'address',
      title: 'ที่อยู่',
      type: 'object',
      fields: [
        requiredString('street', 'เลขที่ หมู่ ถนน ตำบล'),
        requiredString('district', 'อำเภอ'),
        requiredString('province', 'จังหวัด'),
        requiredString('postalCode', 'รหัสไปรษณีย์'),
        requiredString('country', 'รหัสประเทศ (TH)'),
        requiredString('countryName', 'ชื่อประเทศ'),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'serviceAreas',
      title: 'พื้นที่ให้บริการ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            requiredString('name', 'จังหวัด'),
            requiredString('nameEn', 'ชื่อภาษาอังกฤษ'),
            defineField({
              name: 'slug',
              title: 'รหัสพื้นที่ในลิงก์',
              type: 'string',
              validation: (r) => r.required().regex(/^[a-z0-9-]+$/),
            }),
            defineField({
              name: 'primary',
              title: 'พื้นที่หลัก',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        },
      ],
      validation: (r) =>
        r
          .required()
          .min(1)
          .custom(
            (v) =>
              !v ||
              new Set(v.map((a) => (a as { slug?: string }).slug)).size ===
                v.length ||
              'รหัสพื้นที่ต้องไม่ซ้ำกัน',
          ),
    }),
    verified(),
  ],
});
const siteSettings = defineType({
  name: 'siteSettings',
  title: 'หน้าแรกและข้อความหลัก',
  type: 'document',
  fields: [
    text('homepageHeadline', 'หัวเรื่องหน้าแรก (ขึ้นบรรทัดใหม่ได้)'),
    text('homepageDescription', 'คำอธิบายหน้าแรก'),
    requiredString('homepageServiceMessage', 'ข้อความเล็กเหนือหัวเรื่อง'),
    requiredString('primaryCTA', 'ข้อความปุ่มประเมินระบบ'),
    requiredString('secondaryCTA', 'ข้อความปุ่มดูผลงาน'),
    text('footerInformation', 'คำอธิบายท้ายเว็บไซต์'),
    defineField({
      name: 'heroImage',
      title: 'ภาพพื้นหลังหน้าแรก (2400 × 1350 ขึ้นไป)',
      type: 'siteImage',
    }),
    defineField({
      name: 'executivePortrait',
      title: 'ภาพผู้บริหาร (แนวตั้ง 4:5, 1200 × 1500 ขึ้นไป)',
      type: 'siteImage',
    }),
    defineField({
      name: 'contactInformation',
      title: 'ข้อมูลบริษัท ช่องทางติดต่อ และพื้นที่ให้บริการ',
      type: 'reference',
      to: [{ type: 'company' }],
      options: { filter: '_id == "company"' },
      description: 'ใช้ข้อมูลบริษัทชุดเดียวกันทั้งเว็บไซต์',
      validation: (r) => r.required(),
    }),
    verified(),
  ],
});
const promotion = defineType({
  name: 'promotion',
  title: 'โปรโมชั่น / แพ็กเกจ',
  type: 'document',
  groups: [
    { name: 'details', title: 'ข้อมูลแพ็กเกจ', default: true },
    { name: 'publishing', title: 'ช่วงเวลาและสถานะ' },
  ],
  fields: [
    requiredString('title', 'ชื่อแพ็กเกจ', 'details'),
    slug(),
    number('price', 'ราคา (บาท)', 'details'),
    number('systemSize', 'ขนาดระบบ (kW)', 'details'),
    phase('details'),
    requiredString('solarPanel', 'รุ่นแผง', 'details'),
    defineField({
      name: 'panelQuantity',
      title: 'จำนวนแผง',
      type: 'number',
      group: 'details',
      validation: (r) => r.required().positive().integer(),
    }),
    optionalString('battery', 'แบตเตอรี่', 'details'),
    strings('includedServices', 'บริการที่รวม', 'details'),
    text('terms', 'เงื่อนไขและข้อจำกัด', 'details'),
    defineField({
      name: 'image',
      title: 'รูปภาพ',
      type: 'siteImage',
      group: 'details',
    }),
    defineField({
      name: 'active',
      title: 'เปิดใช้งาน',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
    }),
    defineField({
      name: 'startDate',
      title: 'วันเริ่ม',
      type: 'datetime',
      group: 'publishing',
    }),
    defineField({
      name: 'endDate',
      title: 'วันสิ้นสุด',
      type: 'datetime',
      group: 'publishing',
      validation: (r) =>
        r.custom(
          (v, ctx) =>
            !v ||
            !ctx.document?.startDate ||
            Date.parse(v) > Date.parse(String(ctx.document.startDate)) ||
            'วันสิ้นสุดต้องหลังวันเริ่ม',
        ),
    }),
    verified('publishing'),
  ],
});
export const schemaTypes = [
  image,
  table,
  richText,
  project,
  article,
  company,
  siteSettings,
  promotion,
];
