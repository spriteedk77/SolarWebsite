'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: content is always visible, even before hydration. */
export function ScrollEffects({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const main = mainRef.current;
    if (!main || !('IntersectionObserver' in window)) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet<Element>();
    const animated = new Set<HTMLElement>();
    const finish = (element: HTMLElement) => {
      element.classList.remove('scroll-enter');
      element.style.removeProperty('--scroll-delay');
      animated.delete(element);
    };
    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        if (motion.matches || element.contains(document.activeElement)) continue;
        element.style.setProperty('--scroll-delay', `${Math.min(order++, 2) * 60}ms`);
        element.classList.add('scroll-enter');
        animated.add(element);
      }
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

    const observeContent = () => {
      main.querySelectorAll<HTMLElement>('[data-scroll-reveal]').forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        // A card and its image should move together, not animate twice.
        if (element.parentElement?.closest('[data-scroll-reveal]')) return;
        // Keep the initial viewport and restored scroll positions immediately readable.
        if (motion.matches || element.getBoundingClientRect().top < window.innerHeight) return;
        observer.observe(element);
      });
    };
    const onMotionChange = () => {
      if (!motion.matches) return;
      observer.disconnect();
      animated.forEach(finish);
    };
    const onFinish = (event: Event) => {
      if (event.target instanceof HTMLElement && animated.has(event.target)) finish(event.target);
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>('[data-scroll-reveal]');
      if (element) {
        observer.unobserve(element);
        finish(element);
      }
    };

    observeContent();
    // Include content delivered later by server streaming or client navigation.
    const changes = new MutationObserver(observeContent);
    changes.observe(main, { childList: true, subtree: true });
    motion.addEventListener('change', onMotionChange);
    main.addEventListener('animationend', onFinish);
    main.addEventListener('focusin', onFocus);
    return () => {
      observer.disconnect();
      changes.disconnect();
      motion.removeEventListener('change', onMotionChange);
      main.removeEventListener('animationend', onFinish);
      main.removeEventListener('focusin', onFocus);
      animated.forEach(finish);
    };
  }, [pathname]);

  return <main id="main" ref={mainRef}>{children}</main>;
}
