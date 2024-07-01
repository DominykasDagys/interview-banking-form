export const LANGUAGES = {
  EN: "en",
  LT: "lt",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const IntlLocales = {
  en: "en-US",
  lt: "lt-LT",
} as const;
