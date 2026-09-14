/**
 * Contract for the query parameters the marketing pages attach to /quote links.
 *
 * Shared by the link builders in `site.ts`, the quote page that reads them and
 * the form that pre-fills from them, so a link can never carry a value the form
 * does not understand.
 */

export const leadSegments = ['home', 'business'] as const;
export type LeadSegment = (typeof leadSegments)[number];

export function isSegment(value: string): value is LeadSegment {
  return (leadSegments as readonly string[]).includes(value);
}

/** Place type pre-selected for each segment, matching the form's options. */
export const segmentPlaceType: Record<LeadSegment, string> = {
  home: 'บ้านพักอาศัย',
  business: '',
};

/** Human-readable names for packages that can be deep-linked. */
export const packageNames: Record<string, string> = {
  'sigenenergy-neo': 'SigenEnergy NEO 5 kW 1 เฟส พร้อมแบตเตอรี่ 7.52 kWh',
};

/** Pre-filled enquiry text when someone arrives from a package card. */
export function packageMessage(slug: string): string {
  const name = packageNames[slug];
  return name
    ? `สนใจสอบถามรายละเอียดแพ็กเกจ ${name} ครับ/ค่ะ`
    : 'สนใจสอบถามรายละเอียดแพ็กเกจที่แสดงบนเว็บไซต์ครับ/ค่ะ';
}
