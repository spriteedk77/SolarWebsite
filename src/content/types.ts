/**
 * Content models.
 *
 * These shapes are deliberately CMS-shaped: each one maps 1:1 to a collection
 * in a headless CMS (Sanity / Strapi / Payload). Swapping the local TypeScript
 * files in `src/content/<locale>/` for CMS queries means changing only the
 * loaders in `src/content/index.ts` — no page or component has to change.
 */

export type CustomerType =
  | 'residential'
  | 'sme'
  | 'restaurant'
  | 'shop'
  | 'clinic'
  | 'office'
  | 'warehouse'
  | 'factory'
  | 'commercial';

export const customerTypeLabels: Record<CustomerType, string> = {
  residential: 'บ้านพักอาศัย',
  sme: 'ธุรกิจ SME',
  restaurant: 'ร้านอาหาร',
  shop: 'ร้านค้า',
  clinic: 'คลินิก',
  office: 'สำนักงาน',
  warehouse: 'คลังสินค้า',
  factory: 'โรงงาน',
  commercial: 'อาคารพาณิชย์',
};

export type ImageAsset = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /**
   * true = branded placeholder standing in for a photo NP88 Solar still has to
   * supply. Components render these with a visible "awaiting photo" label so a
   * placeholder can never be mistaken for a real project photograph.
   */
  placeholder?: boolean;
};

export type SpecRow = {
  label: string;
  value: string;
  /** Shown as a small note under the value (e.g. a warranty condition). */
  note?: string;
};

export type Project = {
  richContent?: import('@/cms/models').RichBlock[];
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  id: string;
  slug: string;
  title: string;
  /** Short headline used on cards. */
  summary: string;
  /** Left undefined when the customer segment has not been confirmed. */
  customerType?: CustomerType;
  /** Only set when NP88 Solar has confirmed permission to name the customer. */
  customerName?: string;
  location: string;
  province: string;
  systemCapacityKw: number;
  phase: '1 เฟส' | '3 เฟส';
  solarPanel: string;
  panelQuantity: number;
  inverter?: string;
  battery?: string;
  optimizer?: string;
  systemType: string;
  zeroExport: boolean;
  monitoring?: string;
  /** Figures quoted from NP88 Solar's own material — always shown with a disclaimer. */
  estimatedSavingsThbPerMonth?: number;
  standards?: string[];
  servicesIncluded?: string[];
  warranty?: SpecRow[];
  gallery: ImageAsset[];
  /** Narrative sections of the case study. */
  overview: string;
  objective: string[];
  solution: string[];
  installation: string[];
  benefits: string[];
  featured: boolean;
  publishedAt: string;
  /**
   * Internal editorial note: what about this project still needs sign-off from
   * NP88 Solar. Never rendered — staff notes do not belong in front of a
   * customer. It is here so the reviewer sees it next to the data it concerns;
   * the full register is in docs/content-confirmation.md.
   */
  confirmationNote?: string;
};

export type InlineBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string; tone?: 'info' | 'caution' }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string };

export type ArticleCategory =
  | 'พื้นฐาน Solar'
  | 'สำหรับบ้าน'
  | 'สำหรับธุรกิจ'
  | 'เทคโนโลยี'
  | 'ความคุ้มค่า'
  | 'ในพื้นที่ภาคเหนือ';

export type Article = {
  richContent?: import('@/cms/models').RichBlock[];
  author?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  id: string;
  slug: string;
  title: string;
  /** Meta description + card copy. Keep at 120–160 characters. */
  summary: string;
  category: ArticleCategory;
  tags: string[];
  featuredImage: ImageAsset;
  content: InlineBlock[];
  /** Rendered as an FAQPage block on the article when present. */
  faq?: { question: string; answer: string }[];
  related?: string[];
  publishedAt: string;
  updatedAt: string;
};

export type ProductCategory =
  'แผงโซลาร์' | 'อินเวอร์เตอร์' | 'แบตเตอรี่' | 'Optimizer' | 'Monitoring';

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  description: string;
  specifications: SpecRow[];
  image: ImageAsset;
  /** Slugs of projects this product was used in — powers internal linking. */
  usedInProjects?: string[];
};

export type Solution = {
  id: string;
  slug: string;
  title: string;
  /** Who it is for, in plain language. */
  forWho: string;
  /** The customer's problem, stated before any technology. */
  problem: string;
  /** The outcome, stated before any technology. */
  outcome: string;
  points: string[];
  icon: IconName;
};

export type Faq = {
  question: string;
  answer: string;
  /** Group used to split the FAQ list across pages. */
  topic: 'ทั่วไป' | 'การใช้งาน' | 'ขนาดระบบ' | 'บริการ';
};

export type BusinessType = {
  id: string;
  label: string;
  pain: string;
  icon: IconName;
};

export type IconName =
  | 'home'
  | 'building'
  | 'factory'
  | 'battery'
  | 'hybrid'
  | 'shield'
  | 'monitor'
  | 'analysis'
  | 'survey'
  | 'design'
  | 'value'
  | 'install'
  | 'support'
  | 'shop'
  | 'clinic'
  | 'restaurant'
  | 'warehouse'
  | 'office'
  | 'panel'
  | 'inverter'
  | 'optimizer';
