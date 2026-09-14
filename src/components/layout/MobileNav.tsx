'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { LineCTA, PhoneCTA } from '@/components/cta/ContactCTAs';
import { cta, primaryNav, quoteLinks, serviceAreas } from '@/lib/site';

/**
 * Mobile navigation drawer.
 *
 * Accessibility notes:
 *  - the toggle owns `aria-expanded` / `aria-controls`
 *  - the panel is a labelled dialog, focus moves into it on open and returns
 *    to the toggle on close
 *  - Escape closes it, and focus is trapped while it is open
 *  - background scrolling is locked so the page behind cannot move
 *
 * The panel is portalled to <body> so it is always positioned against the
 * viewport, never against the header — any filter, transform or containment on
 * an ancestor would otherwise become the containing block for `position:fixed`.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-haspopup="dialog"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-hairline text-navy-900 xl:hidden"
      >
        <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
        <span className="sr-only">{open ? 'ปิดเมนู' : 'เปิดเมนูหลัก'}</span>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-navy-950/60"
            tabIndex={-1}
          />
          <div
            ref={panelRef}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="เมนูหลัก"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-hairline text-navy-900"
              >
                <Icon name="close" className="h-6 w-6" />
                <span className="sr-only">ปิดเมนู</span>
              </button>
            </div>

            <nav aria-label="เมนูหลัก" className="flex-1 px-5 py-4">
              <ul className="flex flex-col">
                {primaryNav.map((item) => (
                  <li key={item.href} className="border-b border-hairline/70 last:border-0">
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      className="flex flex-col gap-0.5 py-3.5 aria-[current=page]:text-solar-700"
                    >
                      <span className="font-semibold text-navy-900">{item.label}</span>
                      {item.hint && (
                        <span className="text-caption text-ink-600">{item.hint}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-caption text-ink-600">
                พื้นที่ให้บริการ: {serviceAreas.map((a) => a.name).join(' · ')}
              </p>
            </nav>

            <div className="sticky bottom-0 space-y-2.5 border-t border-hairline bg-white px-5 py-4">
              <ButtonLink href={quoteLinks.general} variant="primary" size="lg" fullWidth>
                {cta.primary}
              </ButtonLink>
              <LineCTA size="lg" fullWidth />
              <PhoneCTA size="lg" fullWidth />
            </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
