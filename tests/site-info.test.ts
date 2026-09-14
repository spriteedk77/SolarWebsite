import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fromDocuments,
  requiredAddressDefaults,
  toPatches,
  validate,
  type SiteInfoValues,
} from '../src/admin/site-info/model';
import { defaultSiteData } from '../src/lib/site-data';

const good = (): SiteInfoValues => ({
  phone: '095-697-1915',
  phoneE164: '+66956971915',
  lineId: '@np88solar',
  lineUrl: 'https://line.me/R/ti/p/@np88solar',
  facebookUrl: 'https://www.facebook.com/np88solar',
  businessHours: '',
  companyName: 'NP88 Solar',
  legalName: 'NP88 Engineering Co., Ltd.',
  tagline: 'ออกแบบระบบพลังงาน',
  description: 'ออกแบบและติดตั้ง Solar Rooftop',
  street: '123 หมู่ 4',
  district: 'เมือง',
  province: 'เชียงใหม่',
  postalCode: '50000',
  serviceAreas: 'เชียงใหม่ | Chiang Mai | chiang-mai | หลัก\nลำพูน | Lamphun | lamphun',
  homepageHeadline: 'ออกแบบระบบพลังงาน',
  homepageDescription: 'พร้อมสำรวจ ออกแบบ และติดตั้ง',
  homepageServiceMessage: 'CONTACT',
  primaryCTA: 'ส่งบิลค่าไฟให้ประเมินฟรี',
  secondaryCTA: 'ดูผลงานติดตั้ง',
  footerInformation: 'NP88 Engineering Co., Ltd.',
});

test('the form accepts the values the site already ships with', () => {
  assert.equal(validate(good()), null);
});

test('a phone number that is not international is rejected', () => {
  for (const phoneE164 of ['0956971915', '+0956971915', '66956971915', ''])
    assert.ok(validate({ ...good(), phoneE164 })?.phoneE164, phoneE164);
});

test('contact links must be https, and Facebook may be left empty', () => {
  assert.ok(validate({ ...good(), lineUrl: 'http://line.me/x' })?.lineUrl);
  assert.ok(validate({ ...good(), lineUrl: '' })?.lineUrl);
  // Facebook is optional; an empty value is not an error, a plain one is.
  assert.equal(validate({ ...good(), facebookUrl: '' }), null);
  assert.ok(validate({ ...good(), facebookUrl: 'facebook.com/x' })?.facebookUrl);
});

test('button labels are capped where the button would wrap', () => {
  assert.ok(validate({ ...good(), primaryCTA: 'ก'.repeat(51) })?.primaryCTA);
  assert.equal(validate({ ...good(), primaryCTA: 'ก'.repeat(50) }), null);
});

test('reading a document that is missing fields yields empty strings, not undefined', () => {
  const values = fromDocuments(null, undefined);
  for (const [key, value] of Object.entries(values))
    assert.equal(typeof value, 'string', key);
  // And an empty form fails validation rather than being written as blank.
  assert.ok(validate(values));
});

test('saving touches only the fields the form owns', () => {
  const { company, settings } = toPatches(good());
  // Everything this form does not show must be absent from the patch, so a
  // save cannot wipe it.
  for (const key of [
    'googleBusinessProfileUrl',
    'googleMapsEmbedUrl',
    'approvedForPublication',
    '_id',
    '_type',
  ])
    assert.equal(key in company, false, key);
  assert.equal('contactInformation' in settings, false);
});

test('service areas are parsed once and written as the exact shape the site reads', () => {
  const { company } = toPatches(good());
  assert.deepEqual(company.serviceAreas, [
    { name: 'เชียงใหม่', nameEn: 'Chiang Mai', slug: 'chiang-mai', primary: true },
    { name: 'ลำพูน', nameEn: 'Lamphun', slug: 'lamphun', primary: false },
  ]);
  assert.ok(validate({ ...good(), serviceAreas: 'เชียงใหม่ | | chiang-mai' })?.serviceAreas);
  assert.ok(validate({ ...good(), serviceAreas: 'เชียงใหม่ | Chiang Mai | เชียงใหม่' })?.serviceAreas);
});

test('a save cannot delete the address fields the form does not show', () => {
  // The bug this exists for: writing an `address` object replaces it, and it
  // carries the country code and its name, which the website requires and
  // this form never shows. The patch has to address each line on its own.
  const { company } = toPatches(good());
  assert.equal('address' in company, false, 'must not replace the whole object');
  assert.equal(company['address.street'], '123 หมู่ 4');
  assert.equal(company['address.province'], 'เชียงใหม่');
  for (const key of ['address.country', 'address.countryName'])
    assert.equal(key in company, false, `${key} is not this form's to set`);
});

test('the fields a previous save may have dropped can be restored', () => {
  const defaults = requiredAddressDefaults();
  assert.deepEqual(Object.keys(defaults).sort(), [
    'address.country',
    'address.countryName',
  ]);
  for (const value of Object.values(defaults))
    assert.equal(typeof value === 'string' && value.length > 0, true);
});

test('values are trimmed on the way into the document', () => {
  const { company, settings } = toPatches({
    ...good(),
    phone: '  095-697-1915  ',
    homepageHeadline: '  หัวเรื่อง  ',
  });
  assert.equal(company.phone, '095-697-1915');
  assert.equal(settings.homepageHeadline, 'หัวเรื่อง');
});

test('a round trip through a document keeps every value', () => {
  const values = good();
  const { company, settings } = toPatches(values);
  // Rebuild the document the way Sanity applies a patch of dotted paths.
  const applied: Record<string, unknown> = { address: {} };
  for (const [key, value] of Object.entries(company)) {
    const [head, tail] = key.split('.');
    if (tail) (applied.address as Record<string, unknown>)[tail] = value;
    else applied[head] = value;
  }
  assert.deepEqual(fromDocuments(applied, settings), values);
});

test('the site data the repo ships would pass this form', () => {
  // Guards against the form demanding something the real content cannot meet.
  const { contact } = defaultSiteData;
  assert.equal(validate({ ...good(), phone: contact.phone, phoneE164: contact.phoneE164, lineId: contact.lineId, lineUrl: contact.lineUrl }), null);
});
