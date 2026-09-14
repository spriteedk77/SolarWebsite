'use client';

import Script from 'next/script';
import { useRef, useState, useEffect } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          size: 'compact';
          'response-field-name': string;
        },
      ) => string;
      remove: (id: string) => void;
    };
  }
}
export function SpamChallenge() {
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready || !ref.current || !sitekey || !window.turnstile) return;
    const id = window.turnstile.render(ref.current, {
      sitekey,
      action: 'lead',
      // Fits the form's inner column even at 375px; normal mode requires 300px.
      size: 'compact',
      'response-field-name': 'cf-turnstile-response',
    });
    return () => window.turnstile?.remove(id);
  }, [ready, sitekey]);
  if (!sitekey || process.env.NEXT_PUBLIC_STATIC_PREVIEW === '1') return null;
  return (
    <div className="min-w-0">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={ref} />
      <noscript>
        กรุณาติดต่อทางโทรศัพท์หรือ LINE หากไม่ได้เปิด JavaScript
      </noscript>
    </div>
  );
}
