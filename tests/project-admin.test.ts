import test from 'node:test';
import assert from 'node:assert/strict';
import { projectFieldsModel, lines, warranties } from '../src/admin/projects/model';
import { textBlock, validateBlocks } from '../src/admin/articles/model';

const fields = {
  title: 'โครงการทดสอบ', slug: '', summary: 'รายละเอียดโครงการ', customerName: '', customerType: '',
  location: 'อำเภอเมือง', province: 'เชียงใหม่', systemCapacity: '12.5', phase: '3 เฟส' as const,
  solarPanels: 'Panel 625W', panelQuantity: '20', inverter: '', battery: '', optimizer: '',
  systemType: 'On-grid', zeroExport: false, monitoring: '', estimatedSavings: '', standards: '',
  servicesIncluded: '', warranty: '', publishedAt: '2026-09-15T08:30', seoTitle: '', seoDescription: '', featured: false,
};

test('project drafts accept an automatic slug and coerce numeric fields', () => {
  const parsed = projectFieldsModel.safeParse(fields);
  assert.equal(parsed.success, true);
  if (parsed.success) { assert.equal(parsed.data.systemCapacity, 12.5); assert.equal(parsed.data.panelQuantity, 20); }
});

test('project list and warranty text map to CMS arrays without blank rows', () => {
  assert.deepEqual(lines(' สำรวจ\n\nติดตั้ง\nสำรวจ '), ['สำรวจ', 'ติดตั้ง']);
  assert.deepEqual(warranties('แผง | 25 ปี | ตามเงื่อนไขผู้ผลิต\nไม่ครบ'), [{ label: 'แผง', value: '25 ปี', note: 'ตามเงื่อนไขผู้ผลิต' }]);
});

test('the shared rich editor emits real Portable Text lists and safe links', () => {
  const list = textBlock('one', 'bullet', 'สำรวจหน้างาน');
  assert.equal(list.listItem, 'bullet');
  const link = textBlock('two', 'normal', 'ติดต่อเรา', '/contact');
  assert.equal(link.markDefs[0]?.href, '/contact');
  assert.deepEqual(validateBlocks([{ kind: 'text', key: 'bad', style: 'normal', text: 'bad', link: 'javascript:alert(1)' }]), ['ลิงก์ในเนื้อหาส่วนที่ 1 ไม่ถูกต้อง']);
});
