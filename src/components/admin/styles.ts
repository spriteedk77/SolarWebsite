export const adminFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2';

export const adminButtonBase =
  `inline-flex min-h-11 cursor-pointer select-none items-center justify-center rounded-lg font-semibold transition-[background-color,border-color,color,opacity,transform,box-shadow] active:scale-[0.98] ${adminFocus} disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100`;

export const adminPrimaryButton =
  `${adminButtonBase} bg-solar-600 px-6 text-white hover:bg-solar-700 active:bg-solar-800`;

export const adminPublishButton =
  `${adminButtonBase} bg-navy-900 px-6 text-white hover:bg-navy-800 active:bg-navy-950`;

export const adminSecondaryButton =
  `${adminButtonBase} border border-solar-600 bg-white px-5 text-solar-700 hover:bg-solar-50 active:bg-solar-100`;

export const adminNeutralButton =
  `${adminButtonBase} border border-hairline bg-white px-4 text-navy-900 hover:border-solar-400 hover:bg-soft active:bg-navy-50`;

export const adminDangerButton =
  `${adminButtonBase} border border-red-300 bg-white px-5 text-red-700 hover:border-red-500 hover:bg-red-50 active:bg-red-100`;

export const adminNavLink =
  `inline-flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-caption font-semibold text-navy-900 transition-colors hover:bg-soft active:bg-navy-100 ${adminFocus}`;

export const adminInput =
  `mt-1 min-w-0 max-w-full w-full rounded-lg border border-hairline bg-white px-4 py-3 text-body text-ink-900 transition-[border-color,box-shadow] hover:border-solar-400 active:border-solar-600 focus:border-solar-600 focus:outline-none focus:ring-2 focus:ring-solar-100`;

export const adminCheckbox =
  `h-5 w-5 shrink-0 cursor-pointer rounded border-hairline text-solar-600 transition-[box-shadow,transform] hover:ring-2 hover:ring-solar-100 active:scale-95 ${adminFocus}`;
