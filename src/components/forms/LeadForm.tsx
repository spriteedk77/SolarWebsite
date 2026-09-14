'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LineCTA, PhoneCTA } from '@/components/cta/ContactCTAs';
import { useSiteData } from '@/components/SiteProvider';
import {
  packageMessage,
  segmentPlaceType,
  type LeadSegment,
} from '@/lib/quote-params';
import { cn } from '@/lib/utils';
import {
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
  UPLOAD_ACCEPT,
} from '@/lib/upload-policy';
import { SpamChallenge } from './SpamChallenge';

/**
 * Solar assessment request form.
 *
 * PDPA handling:
 *  - the consent checkbox is required and is never pre-checked
 *  - what is collected and why is stated next to the checkbox, not only in the
 *    privacy notice
 *  - uploads are sent over HTTPS straight to our own endpoint, not to a
 *    third-party form service
 *
 * Accessibility:
 *  - every control has a real <label>; hints are wired with aria-describedby
 *  - failed fields get aria-invalid plus an inline message, and an error
 *    summary is announced and focused after a failed submit
 *  - status changes are announced through a live region
 *
 * The form retains native POST handling, but production spam verification
 * requires JavaScript. The noscript notice directs users to phone or LINE.
 */

const MAX_FILE_MB = MAX_FILE_BYTES / 1024 / 1024;
const ACCEPTED = UPLOAD_ACCEPT;

const placeTypes = [
  'บ้านพักอาศัย',
  'ร้านค้า',
  'ร้านอาหาร',
  'สำนักงาน',
  'คลินิก',
  'โรงงาน',
  'คลังสินค้า',
  'อื่น ๆ',
];

const billRanges = [
  'ต่ำกว่า 3,000 บาท',
  '3,000 – 5,000 บาท',
  '5,001 – 10,000 บาท',
  '10,001 – 30,000 บาท',
  '30,001 – 100,000 บาท',
  'มากกว่า 100,000 บาท',
  'ยังไม่ทราบ',
];

const systemInterests = [
  { value: 'solar', label: 'Solar' },
  { value: 'solar-battery', label: 'Solar + Battery' },
  { value: 'unsure', label: 'ยังไม่แน่ใจ' },
];

type Errors = Record<string, string>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadForm({
  source = 'quote-page',
  segment,
  packageSlug,
  submitted = false,
  submitError,
}: {
  source?: string;
  segment?: LeadSegment;
  packageSlug?: string;
  submitted?: boolean;
  submitError?: string;
}) {
  const { contact, cta, serviceAreas } = useSiteData();
  const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === '1';
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>(
    submitted ? 'success' : submitError ? 'error' : 'idle',
  );
  const [serverMessage, setServerMessage] = useState(submitError ?? '');
  const [challengeKey, setChallengeKey] = useState(0);
  const [fileNames, setFileNames] = useState<{
    bill: string[];
    roof: string[];
  }>({
    bill: [],
    roof: [],
  });
  const formRef = useRef<HTMLFormElement>(null);
  /** Closes the double-submit window that React's async state cannot. */
  const submittingRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();

    if (name.length < 2) next.name = 'กรุณากรอกชื่อของคุณ';

    const digits = phone.replace(/[^0-9]/g, '');
    if (!phone) next.phone = 'กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้';
    else if (digits.length < 9 || digits.length > 10)
      next.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ เช่น 095-697-1915';

    if (!data.get('consent'))
      next.consent = 'กรุณายินยอมให้เก็บและใช้ข้อมูลก่อนส่งแบบฟอร์ม';

    const files = [...data.getAll('bill'), ...data.getAll('roof')].filter(
      (f): f is File => f instanceof File && f.size > 0,
    );
    if (files.length > MAX_FILES)
      next.files = `แนบไฟล์ได้ไม่เกิน ${MAX_FILES} ไฟล์`;
    else if (files.some((f) => f.size > MAX_FILE_MB * 1024 * 1024))
      next.files = `แต่ละไฟล์ต้องมีขนาดไม่เกิน ${MAX_FILE_MB} MB`;

    if (files.reduce((total, f) => total + f.size, 0) > MAX_TOTAL_UPLOAD_BYTES)
      next.files = 'ไฟล์แนบทั้งหมดรวมกันต้องไม่เกิน 3 MB';
    return next;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isStaticPreview) return;
    // Synchronous guard. `status` is React state, so two submits fired in the
    // same tick would both read 'idle' and both reach the network; a ref flips
    // immediately and closes that window.
    if (submittingRef.current) return;
    submittingRef.current = true;

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('source', source);

    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      submittingRef.current = false;
      setStatus('idle');
      // Move focus to the summary so the failure is announced, not just shown.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    try {
      const response = await fetch('/api/lead', { method: 'POST', body: data });
      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus('error');
        setServerMessage(
          result.message ?? 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
        );
        return;
      }

      setStatus('success');
      form.reset();
      setFileNames({ bill: [], roof: [] });
    } catch {
      setStatus('error');
      setServerMessage(
        'เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อทีมงานทาง LINE หรือโทรศัพท์',
      );
    } finally {
      setChallengeKey((key) => key + 1);
      // Released on every outcome, so a failed attempt can be retried.
      submittingRef.current = false;
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-card border border-solar-200 bg-solar-50 p-6 sm:p-8"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-solar-600 text-white">
          <Icon name="check" className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <h2 className="mt-4 text-h2">ได้รับข้อมูลของคุณแล้ว</h2>
        <p className="mt-3 text-body text-ink-700">
          ทีมงาน NP88 Solar
          จะตรวจสอบข้อมูลและติดต่อกลับเพื่อสอบถามรายละเอียดเพิ่มเติม
          หากต้องการคุยกับทีมงานทันที ติดต่อได้ทาง LINE หรือโทรศัพท์
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <LineCTA size="lg" />
          <PhoneCTA size="lg" />
        </div>
        <p className="mt-6 text-caption text-ink-600">
          ต้องการส่งข้อมูลเพิ่มเติมอีกครั้ง?{' '}
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="font-semibold text-solar-700 underline underline-offset-2"
          >
            เปิดแบบฟอร์มใหม่
          </button>
        </p>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <form
      ref={formRef}
      // Real action/method: without JavaScript the browser posts natively and
      // the endpoint redirects back to /quote?sent=1.
      action={isStaticPreview ? undefined : '/api/lead'}
      method="post"
      encType="multipart/form-data"
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
    >
      {isStaticPreview && (
        <div className="rounded-card border border-solar-300 bg-solar-50 p-4 text-caption text-navy-900 sm:p-5">
          หน้านี้เป็นเว็บไซต์พรีวิวบน GitHub Pages
          จึงยังไม่เปิดรับข้อมูลผ่านแบบฟอร์ม สามารถติดต่อทีมงานได้ทาง LINE
          หรือโทรศัพท์ด้านล่าง
        </div>
      )}
      <noscript>
        <div className="rounded-card border border-flare-300 bg-flare-50 p-4 text-caption text-flare-900">
          หากปิด JavaScript กรุณาติดต่อทีมงานผ่าน LINE หรือโทรศัพท์
          เพื่อส่งข้อมูลและรับการประเมิน โทร{' '}
          <a href={contact.phoneHref} className="font-semibold underline">
            {contact.phone}
          </a>{' '}
          หรือ LINE{' '}
          <a href={contact.lineUrl} className="font-semibold underline">
            {contact.lineId}
          </a>
        </div>
      </noscript>

      {/* Context carried from the link the visitor arrived on. */}
      <input type="hidden" name="source" value={source} />
      {segment && <input type="hidden" name="segment" value={segment} />}
      {packageSlug && (
        <input type="hidden" name="package" value={packageSlug} />
      )}
      {/* Error summary — focusable and announced after a failed submit. */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border border-flare-300 bg-flare-50 p-4 sm:p-5"
        >
          <p className="flex items-center gap-2 font-semibold text-flare-900">
            <Icon name="alert" className="h-5 w-5 shrink-0" />
            กรุณาตรวจสอบข้อมูล {errorList.length} รายการ
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-caption text-flare-900">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#lead-${field}`}
                  className="underline underline-offset-2"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot — bots fill it, people never see it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="lead-company-website">เว็บไซต์ (ไม่ต้องกรอก)</label>
        <input
          id="lead-company-website"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <fieldset className="space-y-5">
        <legend className="text-h3">ข้อมูลติดต่อ</legend>

        <Field
          id="lead-name"
          name="name"
          label="ชื่อ"
          required
          autoComplete="name"
          error={errors.name}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="lead-phone"
            name="phone"
            label="เบอร์โทร"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            hint="ใช้สำหรับติดต่อกลับเพื่อสอบถามรายละเอียดเพิ่มเติม"
            error={errors.phone}
          />
          <Field
            id="lead-lineId"
            name="lineId"
            label="LINE ID"
            hint="ไม่บังคับ — สะดวกสำหรับส่งไฟล์และพูดคุยต่อ"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="lead-province"
            name="province"
            label="จังหวัด"
            options={[...serviceAreas.map((a) => a.name), 'จังหวัดอื่น ๆ']}
            placeholder="เลือกจังหวัด"
          />
          <SelectField
            id="lead-placeType"
            name="placeType"
            label="ประเภทสถานที่"
            options={placeTypes}
            placeholder="เลือกประเภทสถานที่"
            defaultValue={segment ? segmentPlaceType[segment] : ''}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-hairline pt-6">
        <legend className="text-h3">ข้อมูลการใช้ไฟ</legend>

        <SelectField
          id="lead-billRange"
          name="billRange"
          label="ค่าไฟเฉลี่ยต่อเดือน"
          options={billRanges}
          placeholder="เลือกช่วงค่าไฟ"
          hint="ตัวเลขคร่าว ๆ ก็เพียงพอสำหรับการประเมินเบื้องต้น"
        />

        <fieldset>
          <legend className="text-body font-semibold text-navy-900">
            ประเภทระบบที่สนใจ
          </legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {systemInterests.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-hairline bg-white px-4 py-3 has-[:checked]:border-solar-500 has-[:checked]:bg-solar-50"
              >
                <input
                  type="radio"
                  name="systemInterest"
                  value={option.value}
                  className="h-4.5 w-4.5 accent-solar-600"
                />
                <span className="text-body">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="space-y-5 border-t border-hairline pt-6">
        <legend className="text-h3">แนบไฟล์ (ถ้ามี)</legend>
        <p className="text-caption text-ink-600">
          บิลค่าไฟและรูปหลังคาช่วยให้ทีมงานประเมินได้แม่นยำขึ้นมาก
          หากยังไม่สะดวกแนบตอนนี้ ส่งทาง LINE ภายหลังได้
        </p>

        {errors.files && (
          <p
            id="lead-files"
            className="text-caption font-medium text-flare-800"
          >
            {errors.files}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FileField
            id="lead-bill"
            name="bill"
            label="บิลค่าไฟ"
            hint={`ไฟล์ภาพหรือ PDF ไม่เกิน ${MAX_FILE_MB} MB ต่อไฟล์ รวมทุกไฟล์ไม่เกิน 3 MB`}
            fileNames={fileNames.bill}
            onFiles={(names) =>
              setFileNames((prev) => ({ ...prev, bill: names }))
            }
          />
          <FileField
            id="lead-roof"
            name="roof"
            label="รูปหลังคา"
            hint="ถ่ายให้เห็นพื้นที่ว่างและสิ่งกีดขวางรอบหลังคา"
            fileNames={fileNames.roof}
            onFiles={(names) =>
              setFileNames((prev) => ({ ...prev, roof: names }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="lead-message"
            className="block text-body font-semibold text-navy-900"
          >
            ข้อความเพิ่มเติม
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            defaultValue={packageSlug ? packageMessage(packageSlug) : undefined}
            className="mt-2 w-full rounded-lg border border-hairline bg-white px-4 py-3 text-body text-ink-900 placeholder:text-ink-500"
            placeholder="เช่น ช่วงเวลาที่ใช้ไฟหนัก ลักษณะหลังคา หรือคำถามที่อยากให้ทีมงานช่วยตอบ"
          />
        </div>
      </fieldset>

      <div className="border-t border-hairline pt-6">
        <div
          className={cn(
            'rounded-card border p-4 sm:p-5',
            errors.consent
              ? 'border-flare-400 bg-flare-50'
              : 'border-hairline bg-paper-soft',
          )}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="lead-consent"
              name="consent"
              value="yes"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby="lead-consent-detail"
              className="mt-1 h-5 w-5 shrink-0 accent-solar-600"
            />
            <div>
              <label
                htmlFor="lead-consent"
                className="text-body font-semibold text-navy-900"
              >
                ยินยอมให้เก็บและใช้ข้อมูล{' '}
                <span className="text-flare-700">*</span>
              </label>
              <p
                id="lead-consent-detail"
                className="mt-1.5 text-caption text-ink-700"
              >
                ข้าพเจ้ายินยอมให้ NP88 Solar เก็บรวบรวมและใช้ชื่อ เบอร์โทร LINE
                ID ข้อมูลการใช้ไฟ และไฟล์ที่แนบมา
                เพื่อวิเคราะห์และเสนอแนวทางระบบ Solar และเพื่อติดต่อกลับเท่านั้น
                โดยไม่เปิดเผยต่อบุคคลภายนอกเพื่อการตลาด
                รายละเอียดและสิทธิของเจ้าของข้อมูลระบุไว้ใน{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-solar-700 underline underline-offset-2"
                >
                  ประกาศความเป็นส่วนตัว
                </Link>
              </p>
              {errors.consent && (
                <p className="mt-2 text-caption font-medium text-flare-800">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* The fallback contact line used to sit in this row and squeeze the
            submit button onto two lines. It is secondary, so it gets its own
            line below and the button keeps the width it needs. */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SpamChallenge key={challengeKey} />
            <Button
              type="submit"
              size="lg"
              variant="primary"
              disabled={status === 'submitting' || isStaticPreview}
              className="shrink-0"
            >
              {/* Kept on one line: the label and the arrow are a single unit,
                  and the notice at the top of the form already explains why the
                  button is disabled in the preview. */}
              <span className="whitespace-nowrap">
                {status === 'submitting'
                  ? 'กำลังส่งข้อมูล…'
                  : isStaticPreview
                    ? 'ยังไม่เปิดรับข้อมูล'
                    : cta.submit}
              </span>
              {status !== 'submitting' && (
                <Icon name="arrow-right" className="h-5 w-5 shrink-0" />
              )}
            </Button>
          </div>
          <p className="text-caption text-ink-600">
            หรือติดต่อโดยตรง{' '}
            <a
              href={contact.phoneHref}
              className="font-semibold text-solar-700"
            >
              {contact.phone}
            </a>{' '}
            ·{' '}
            <a
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-solar-700"
            >
              LINE {contact.lineId}
            </a>
          </p>
        </div>

        <p aria-live="polite" className="sr-only">
          {status === 'submitting' ? 'กำลังส่งข้อมูล' : ''}
        </p>

        {status === 'error' && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-flare-50 p-4 text-caption text-flare-900"
          >
            {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
}

/* ------------------------------- field parts ------------------------------ */

const inputClass =
  'mt-2 w-full rounded-lg border bg-white px-4 py-3 text-body text-ink-900 ' +
  'placeholder:text-ink-500 aria-[invalid=true]:border-flare-500';

function Field({
  id,
  name,
  label,
  hint,
  error,
  required,
  type = 'text',
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-body font-semibold text-navy-900"
      >
        {label} {required && <span className="text-flare-700">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(' ') || undefined
        }
        className={cn(
          inputClass,
          error ? 'border-flare-500' : 'border-hairline',
        )}
        {...rest}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-caption text-ink-600">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-1.5 text-caption font-medium text-flare-800"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  options,
  placeholder,
  hint,
  defaultValue = '',
}: {
  id: string;
  name: string;
  label: string;
  options: string[];
  placeholder: string;
  hint?: string;
  defaultValue?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-body font-semibold text-navy-900"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={options.includes(defaultValue) ? defaultValue : ''}
        aria-describedby={hintId}
        className={cn(inputClass, 'border-hairline')}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className="mt-1.5 text-caption text-ink-600">
          {hint}
        </p>
      )}
    </div>
  );
}

function FileField({
  id,
  name,
  label,
  hint,
  fileNames,
  onFiles,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  fileNames: string[];
  onFiles: (names: string[]) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-body font-semibold text-navy-900"
      >
        {label}
      </label>
      <div className="mt-2 rounded-lg border border-dashed border-ink-500/40 bg-white p-4">
        <div className="flex items-center gap-3">
          <Icon name="upload" className="h-5 w-5 shrink-0 text-solar-600" />
          <input
            id={id}
            name={name}
            type="file"
            multiple
            accept={ACCEPTED}
            aria-describedby={`${id}-hint`}
            onChange={(event) =>
              onFiles(
                Array.from(event.target.files ?? []).map((file) => file.name),
              )
            }
            className="block w-full text-caption file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3.5 file:py-2 file:text-caption file:font-semibold file:text-white"
          />
        </div>
        {fileNames.length > 0 && (
          <ul className="mt-3 space-y-1 text-caption text-ink-700">
            {fileNames.map((fileName) => (
              <li key={fileName} className="flex items-center gap-2">
                <Icon
                  name="check"
                  className="h-4 w-4 shrink-0 text-solar-600"
                />
                <span className="truncate">{fileName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-caption text-ink-600">
        {hint}
      </p>
    </div>
  );
}
