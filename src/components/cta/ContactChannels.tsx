import { Icon } from '@/components/ui/Icon';
import { LineIcon } from '@/components/brand/LineIcon';
import { cn } from '@/lib/utils';
import type { SiteData } from '@/lib/site-data';

/**
 * The site's contact channels — Facebook, LINE and phone — as one icon+text
 * list.
 *
 * This is the single presentation of the contact set. Every block that lists
 * how to reach NP88 Solar renders it, so a channel cannot go missing from one
 * page and be present on another, and so a new channel is added in one place.
 * The URLs come from `contact` (src/lib/site.ts, or the CMS once it is live) —
 * nothing here hardcodes an address.
 *
 * A channel with no URL configured is dropped rather than rendered dead, which
 * is why Facebook only appeared once `contact.facebookUrl` was filled in.
 *
 * ⚠️ Not for the action buttons. `ContactCTAs` is the "call now / chat now"
 * pair and the sticky bar is the mobile equivalent; those are conversion
 * prompts, and Facebook is not one. This component is the directory.
 */
export function ContactChannels({
  contact,
  tone = 'light',
  layout = 'stack',
  analytics,
  className,
}: {
  contact: SiteData['contact'];
  /** `dark` = on the navy ground; `light` = on white and soft surfaces. */
  tone?: 'dark' | 'light';
  /** `row` wraps across the line; `stack` is one channel per line. */
  layout?: 'row' | 'stack';
  /** Prefix for data-analytics, e.g. 'hero' -> 'hero-facebook'. */
  analytics?: string;
  className?: string;
}) {
  const dark = tone === 'dark';

  const channels = [
    {
      key: 'facebook' as const,
      href: contact.facebookUrl,
      label: `Facebook ${contact.facebookName}`,
      external: true,
    },
    {
      key: 'line' as const,
      href: contact.lineUrl,
      label: `LINE ${contact.lineId}`,
      external: true,
    },
    {
      key: 'phone' as const,
      href: contact.phoneHref,
      label: contact.phone,
      external: false,
    },
  ].filter((channel) => channel.href);

  return (
    <ul
      className={cn(
        'flex flex-col',
        layout === 'row'
          ? 'gap-x-7 gap-y-1 sm:flex-row sm:flex-wrap sm:items-center'
          : 'gap-y-1',
        className,
      )}
    >
      {channels.map((channel) => (
        <li key={channel.key}>
          <a
            href={channel.href}
            {...(channel.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            {...(analytics
              ? { 'data-analytics': `${analytics}-${channel.key}` }
              : {})}
            className={cn(
              'inline-flex min-h-11 items-center gap-2.5 text-body font-medium underline-offset-4',
              dark
                ? 'text-white hover:underline'
                : 'font-semibold text-navy-900 hover:text-solar-700',
            )}
          >
            {channel.key === 'line' ? (
              // The official LINE asset, never a redrawn mark.
              <LineIcon />
            ) : (
              <Icon
                name={channel.key}
                className={cn(
                  'h-5 w-5 shrink-0',
                  dark ? 'text-sky-brand' : 'text-solar-600',
                )}
              />
            )}
            <span className="break-words">{channel.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
