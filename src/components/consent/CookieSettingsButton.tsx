'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getConsent, type ConsentState } from './CookieConsent';

/**
 * Lets a visitor revisit their cookie choice from the cookie policy page.
 * Clearing the stored decision brings the consent banner back on next render.
 */
export function CookieSettingsButton() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(getConsent());
    setMounted(true);
  }, []);

  const reset = () => {
    try {
      window.localStorage.removeItem('np88-cookie-consent-v1');
    } catch {
      /* storage unavailable — nothing was stored to begin with */
    }
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="rounded-card border border-hairline bg-paper-soft p-5 sm:p-6">
      <h2 className="text-h3">การตั้งค่าคุกกี้ของคุณ</h2>
      <p className="mt-2 text-caption text-ink-700">
        {consent
          ? `สถานะปัจจุบัน — คุกกี้ที่จำเป็น: เปิดเสมอ · การวิเคราะห์: ${
              consent.analytics ? 'ยินยอม' : 'ไม่ยินยอม'
            } · การตลาด: ${consent.marketing ? 'ยินยอม' : 'ไม่ยินยอม'}`
          : 'คุณยังไม่ได้เลือกการตั้งค่าคุกกี้ ขณะนี้เว็บไซต์ใช้เฉพาะคุกกี้ที่จำเป็นเท่านั้น'}
      </p>
      <Button variant="secondary" className="mt-4" onClick={reset}>
        เปลี่ยนการตั้งค่าคุกกี้
      </Button>
    </div>
  );
}
