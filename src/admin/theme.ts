import { buildLegacyTheme } from 'sanity';

/**
 * The Studio, in NP88 Solar's colours.
 *
 * The admin is part of the website, not a separate product, so it should not
 * look like one. These are the same tokens the site uses — navy #001D78 for
 * structure, solar blue #036DC9 for anything actionable, orange #F2A323 kept
 * for a single accent, and the soft grey ground behind the page.
 *
 * The Studio takes a flat palette rather than CSS variables, so the values are
 * repeated here from globals.css. They are brand constants, not theme
 * decisions: if the brand ever changes, both move together.
 */
const brand = {
  navy: '#001D78',
  navySoft: '#123252',
  solar: '#036DC9',
  solarLight: '#4fa5f6',
  flare: '#F2A323',
  soft: '#F4F1F8',
  white: '#FFFFFF',
  hairline: '#e2e8f0',
  ink: '#001D78',
  inkMuted: '#4c5b6a',
  danger: '#b91c1c',
  success: '#15803d',
  warning: '#b45309',
};

export const np88StudioTheme = buildLegacyTheme({
  '--black': brand.ink,
  '--white': brand.white,

  '--gray': brand.inkMuted,
  '--gray-base': brand.inkMuted,

  '--component-bg': brand.white,
  '--component-text-color': brand.ink,

  // The top bar and navigation, in the site's navy.
  '--main-navigation-color': brand.navy,
  '--main-navigation-color--inverted': brand.white,

  // Anything the editor can act on is the site's blue.
  '--brand-primary': brand.solar,

  '--default-button-color': brand.inkMuted,
  '--default-button-primary-color': brand.solar,
  '--default-button-success-color': brand.success,
  '--default-button-warning-color': brand.warning,
  '--default-button-danger-color': brand.danger,

  '--state-info-color': brand.solar,
  '--state-success-color': brand.success,
  '--state-warning-color': brand.flare,
  '--state-danger-color': brand.danger,

  '--focus-color': brand.solarLight,
});

export const np88Brand = brand;
