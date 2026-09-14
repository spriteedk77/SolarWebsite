import { Icon } from '@/components/ui/Icon';

/**
 * FAQ accordion built on native <details>/<summary>.
 *
 * Native disclosure gives keyboard operation, screen-reader expanded state and
 * in-page find for free, and ships no JavaScript. The only enhancement is a
 * CSS-rotated "+" marker, which is decorative — the state is announced by the
 * element itself.
 */
export function FAQAccordion({
  items,
  /** Opens the first item so the pattern is obvious at a glance. */
  openFirst = false,
}: {
  items: { question: string; answer: string }[];
  openFirst?: boolean;
}) {
  return (
    <div className="divide-y divide-hairline overflow-hidden rounded-card border border-hairline bg-white">
      {items.map((item, index) => (
        <details
          key={item.question}
          className="faq group"
          open={openFirst && index === 0}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-body font-semibold text-navy-900 hover:bg-paper-soft sm:px-6 sm:py-5">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="faq-icon mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-solar-50 text-solar-700 transition-transform duration-200"
            >
              <Icon name="plus" className="h-4 w-4" strokeWidth={2} />
            </span>
          </summary>
          <div className="px-5 pb-5 text-body text-ink-700 sm:px-6 sm:pb-6">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
