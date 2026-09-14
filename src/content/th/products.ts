import type { ImageAsset, Product } from '../types';

/**
 * ⚠️ CONTENT RULE
 * รายการนี้คือ "อุปกรณ์ที่ NP88 Solar ใช้ในงานติดตั้งจริง" เท่านั้น
 * ห้ามระบุสถานะตัวแทนจำหน่าย ความเป็นพาร์ทเนอร์อย่างเป็นทางการ หรือใบรับรองใด ๆ
 * สเปกที่แสดงจำกัดอยู่เฉพาะค่าที่ปรากฏในข้อมูลโครงการที่ได้รับมา
 */

const img = (src: string, alt: string): ImageAsset => ({
  src,
  alt,
  width: 1200,
  height: 900,
  placeholder: true,
});

export const products: Product[] = [
  {
    id: 'pd-ja-620',
    brand: 'JA Solar',
    name: 'JA Solar N-Type 620W',
    category: 'แผงโซลาร์',
    description:
      'แผงโซลาร์เซลล์ชนิด N-Type กำลังผลิต 620 วัตต์ต่อแผง ใช้ในงานระบบขนาดใหญ่ที่ต้องการกำลังผลิตสูงต่อพื้นที่หลังคา',
    specifications: [
      { label: 'กำลังผลิตต่อแผง', value: '620 W' },
      { label: 'ชนิดเซลล์', value: 'N-Type' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 178.56 kW จังหวัดลำปาง (288 แผง)' },
    ],
    image: img('/images/placeholder/equipment-panel.svg', 'แผงโซลาร์ JA Solar N-Type 620W'),
    usedInProjects: ['commercial-rooftop-178kw-lampang'],
  },
  {
    id: 'pd-ja-625',
    brand: 'JA Solar',
    name: 'JA Solar N-Type 625W',
    category: 'แผงโซลาร์',
    description:
      'แผงโซลาร์เซลล์ชนิด N-Type กำลังผลิต 625 วัตต์ต่อแผง ใช้กับระบบขนาดกลางสำหรับสถานประกอบการ',
    specifications: [
      { label: 'กำลังผลิตต่อแผง', value: '625 W' },
      { label: 'ชนิดเซลล์', value: 'N-Type' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 30 kW อำเภอแม่แตง เชียงใหม่ (48 แผง)' },
    ],
    image: img('/images/placeholder/equipment-panel.svg', 'แผงโซลาร์ JA Solar N-Type 625W'),
    usedInProjects: ['solar-rooftop-30kw-mae-taeng'],
  },
  {
    id: 'pd-ja-bifacial',
    brand: 'JA Solar',
    name: 'JA Solar N-Type Bifacial Double Glass 625W',
    category: 'แผงโซลาร์',
    description:
      'แผงชนิด Bifacial โครงสร้างกระจกสองชั้น รับแสงได้ทั้งด้านหน้าและด้านหลัง โครงสร้างกระจกสองชั้นออกแบบมาเพื่อการใช้งานระยะยาว',
    specifications: [
      { label: 'กำลังผลิตต่อแผง', value: '625 W' },
      { label: 'ชนิดเซลล์', value: 'N-Type Bifacial' },
      { label: 'โครงสร้าง', value: 'กระจกสองชั้น (Double Glass)' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 22.50 kW อำเภอเมืองเชียงใหม่ (36 แผง)' },
    ],
    image: img(
      '/images/placeholder/equipment-panel.svg',
      'แผงโซลาร์ JA Solar N-Type Bifacial กระจกสองชั้น 625W',
    ),
    usedInProjects: ['solar-rooftop-22-5kw-mueang-chiang-mai'],
  },
  {
    id: 'pd-aiko-770',
    brand: 'AIKO',
    name: 'AIKO STELLAR Dual-Glass 770W',
    category: 'แผงโซลาร์',
    description:
      'แผงโซลาร์รุ่น STELLAR โครงสร้างกระจกสองชั้น กำลังผลิต 770 วัตต์ต่อแผง ให้กำลังผลิตสูงต่อพื้นที่ เหมาะกับหลังคาที่มีพื้นที่จำกัด',
    specifications: [
      { label: 'กำลังผลิตต่อแผง', value: '770 W' },
      { label: 'โครงสร้าง', value: 'Dual-Glass' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 10.78 kW 8Items Clinic เชียงใหม่ (14 แผง)' },
    ],
    image: img('/images/placeholder/equipment-panel.svg', 'แผงโซลาร์ AIKO STELLAR Dual-Glass 770W'),
    usedInProjects: ['8items-clinic-solar-battery-chiang-mai'],
  },
  {
    id: 'pd-deye-10k',
    brand: 'Deye',
    name: 'Deye 10K',
    category: 'อินเวอร์เตอร์',
    description:
      'อินเวอร์เตอร์ที่ใช้ในระบบ Hybrid ทำงานร่วมกับแบตเตอรี่ และรองรับการตั้งค่าระบบ Zero Export',
    specifications: [
      { label: 'ใช้กับระบบ', value: 'Hybrid (Solar + Battery) 3 เฟส' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 10.78 kW 8Items Clinic เชียงใหม่' },
      {
        label: 'การรับประกัน',
        value: '10 ปี',
        note: 'ตามเงื่อนไขที่ระบุในโครงการดังกล่าว ไม่ใช่เงื่อนไขมาตรฐานของทุกงาน',
      },
    ],
    image: img('/images/placeholder/equipment-inverter.svg', 'อินเวอร์เตอร์ Deye 10K'),
    usedInProjects: ['8items-clinic-solar-battery-chiang-mai'],
  },
  {
    id: 'pd-dyness',
    brand: 'Dyness',
    name: 'Dyness PowerBrick SC',
    category: 'แบตเตอรี่',
    description:
      'ชุดแบตเตอรี่สำหรับเก็บพลังงานที่ผลิตได้เกินความต้องการในช่วงกลางวัน เพื่อนำมาใช้ต่อในช่วงที่แสงแดดลดลง',
    specifications: [
      { label: 'ความจุที่ติดตั้ง', value: '16.07 kWh' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 10.78 kW 8Items Clinic เชียงใหม่' },
    ],
    image: img('/images/placeholder/equipment-battery.svg', 'แบตเตอรี่ Dyness PowerBrick SC'),
    usedInProjects: ['8items-clinic-solar-battery-chiang-mai'],
  },
  {
    id: 'pd-sigen-neo',
    brand: 'SigenEnergy',
    name: 'SigenEnergy NEO',
    category: 'แบตเตอรี่',
    description:
      'ชุดระบบพลังงานสำหรับบ้านที่ใช้ในแพ็กเกจ Solar + Battery ขนาด 5 kW 1 เฟส พร้อมแบตเตอรี่ความจุ 7.52 kWh',
    specifications: [
      { label: 'ขนาดระบบในแพ็กเกจ', value: '5 kW 1 เฟส' },
      { label: 'ความจุแบตเตอรี่', value: '7.52 kWh' },
      { label: 'ใช้กับ', value: 'แพ็กเกจ Solar สำหรับบ้าน (ดูรายละเอียดที่หน้า Solar สำหรับบ้าน)' },
    ],
    image: img('/images/placeholder/equipment-battery.svg', 'ชุดระบบพลังงาน SigenEnergy NEO'),
  },
  {
    id: 'pd-merc-optimizer',
    brand: 'Smart PV Optimizer',
    name: 'MERC-1300W-P',
    category: 'Optimizer',
    description:
      'อุปกรณ์ที่ทำงานในระดับแผง ช่วยให้แผงที่โดนเงาบังหรือมีสิ่งสกปรกไม่ฉุดกำลังผลิตของทั้งสตริง และทำให้ตรวจสอบการทำงานแยกรายแผงได้',
    specifications: [
      { label: 'ระดับการทำงาน', value: 'ระดับแผง (Module-level)' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 178.56 kW จังหวัดลำปาง' },
    ],
    image: img(
      '/images/placeholder/equipment-optimizer.svg',
      'Smart PV Optimizer รุ่น MERC-1300W-P',
    ),
    usedInProjects: ['commercial-rooftop-178kw-lampang'],
  },
  {
    id: 'pd-monitoring',
    brand: 'Energy Monitoring',
    name: 'ระบบติดตามพลังงานผ่านแอปพลิเคชัน',
    category: 'Monitoring',
    description:
      'ดูข้อมูลการผลิตไฟ การใช้พลังงาน และสถานะแบตเตอรี่ได้ด้วยตนเอง ทำให้ตรวจพบความผิดปกติได้เร็วกว่าการรอดูจากบิลค่าไฟ',
    specifications: [
      { label: 'ข้อมูลที่ดูได้', value: 'การผลิตไฟ การใช้พลังงาน และสถานะแบตเตอรี่' },
      { label: 'ใช้ในโครงการ', value: 'ระบบ 10.78 kW 8Items Clinic เชียงใหม่' },
      {
        label: 'แอปพลิเคชันที่รองรับ',
        value: 'ขึ้นอยู่กับอุปกรณ์ที่ติดตั้งในแต่ละโครงการ',
      },
    ],
    image: img('/images/placeholder/monitoring-app.svg', 'หน้าจอระบบติดตามพลังงาน'),
    usedInProjects: ['8items-clinic-solar-battery-chiang-mai'],
  },
];

/** Brand names shown in the "brands & technology" strip. */
export const brands = ['AIKO', 'JA Solar', 'Deye', 'Dyness', 'SigenEnergy'] as const;
