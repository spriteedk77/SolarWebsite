'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * PDPA-aligned cookie banner.
 *
 * Rules this implements:
 *  - strictly necessary cookies only until the visitor makes a choice
 *  - optional categories are NOT pre-checked
 *  - "ปฏิเสธ" is as prominent and as easy to reach as "ยอมรับ"
 *  - the choice is stored locally and can be changed from the cookie policy page
 *
 * Analytics/advertising scripts must read `getConsent()` before loading. None
 * are wired up yet — add them behind the `analytics` / `marketing` flags.
 */

const STORAGE_KEY = 'np88-cookie-consent-v1';

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

function save(state: ConsentState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — the banner simply shows again */
  }
  window.dispatchEvent(new CustomEvent('np88:consent-change', { detail: state }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  // Optional categories start switched OFF — never pre-checked.
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const decide = (next: { analytics: boolean; marketing: boolean }) => {
    save({ necessary: true, ...next, decidedAt: new Date().toISOString() });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      /* Sized to stay out of the hero's way: a single line of copy and a row of
         buttons, anchored bottom-right on desktop rather than spanning the
         viewport. The full explanation lives on the cookie policy page. */
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 px-3 pb-3 xl:inset-x-auto xl:right-6 xl:bottom-6 xl:px-0 xl:pb-0"
    >
      <div className="mx-auto max-w-xl rounded-card border border-hairline bg-white p-4 shadow-card-hover sm:p-5 xl:max-w-md">
        <h2 id="cookie-consent-title" className="text-body font-semibold text-navy-900">
          เว็บไซต์นี้ใช้คุกกี้
        </h2>
        <p className="mt-1.5 text-caption text-ink-700">
          ใช้คุกกี้ที่จำเป็นเสมอ ส่วนคุกกี้เพื่อการวิเคราะห์และการตลาดจะใช้เมื่อคุณยินยอมเท่านั้น{' '}
          <Link href="/cookie-policy" className="text-solar-700 underline underline-offset-2">
            อ่านนโยบายคุกกี้
          </Link>
        </p>

        {showDetail && (
          <fieldset className="mt-4 space-y-3 border-t border-hairline pt-4">
            <legend className="sr-only">เลือกประเภทคุกกี้ที่ยินยอม</legend>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="cookie-necessary"
                checked
                disabled
                className="mt-1 h-5 w-5 accent-solar-600"
              />
              <label htmlFor="cookie-necessary" className="text-caption">
                <span className="font-semibold text-navy-900">คุกกี้ที่จำเป็น</span> — จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์
                ไม่สามารถปิดได้
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="cookie-analytics"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-5 w-5 accent-solar-600"
              />
              <label htmlFor="cookie-analytics" className="text-caption">
                <span className="font-semibold text-navy-900">คุกกี้เพื่อการวิเคราะห์</span> —
                ช่วยให้เราเข้าใจว่าผู้เข้าชมใช้งานเว็บไซต์อย่างไร
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="cookie-marketing"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
                className="mt-1 h-5 w-5 accent-solar-600"
              />
              <label htmlFor="cookie-marketing" className="text-caption">
                <span className="font-semibold text-navy-900">คุกกี้เพื่อการตลาด</span> —
                ใช้เพื่อวัดผลและนำเสนอเนื้อหาที่เกี่ยวข้อง
              </label>
            </div>
          </fieldset>
        )}

        {/* All three choices stay equally reachable — "ใช้เฉพาะที่จำเป็น" is
            never demoted to a link or hidden behind "ตั้งค่า". Two columns on
            a phone keeps the card short enough to clear the hero's buttons. */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-row">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => decide({ analytics: true, marketing: true })}
            className="sm:flex-1"
          >
            ยอมรับทั้งหมด
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => decide({ analytics: false, marketing: false })}
            className="sm:flex-1"
          >
            ใช้เฉพาะที่จำเป็น
          </Button>
          {showDetail ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => decide({ analytics, marketing })}
              className="col-span-2 sm:flex-1"
            >
              บันทึกการตั้งค่า
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDetail(true)}
              className="col-span-2 sm:flex-1"
            >
              ตั้งค่า
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
