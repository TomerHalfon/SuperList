import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Can be imported from a shared config
export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Get the locale from the cookie if available
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie');
  let cookieLocale: string | null = null;
  
  if (cookieHeader) {
    const localeMatch = cookieHeader.match(/locale=([^;]+)/);
    if (localeMatch) {
      cookieLocale = localeMatch[1];
    }
  }

  // Use cookie locale if valid, otherwise use the provided locale
  const validLocale: Locale = (cookieLocale && locales.includes(cookieLocale as Locale)) 
    ? (cookieLocale as Locale) 
    : (locales.includes(locale as any) ? (locale as Locale) : 'en');

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
    timeZone: 'UTC',
    now: new Date(),
  };
});
