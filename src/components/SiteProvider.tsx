'use client';

import { createContext, useContext } from 'react';
import type { SiteData } from '@/lib/site-data';

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteData;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteData(): SiteData {
  const value = useContext(SiteContext);
  if (!value) throw new Error('SiteProvider is required');
  return value;
}
