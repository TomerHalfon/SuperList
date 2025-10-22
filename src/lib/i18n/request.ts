import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { locales, type Locale } from '@/i18n';

export function getLocale(request: NextRequest): Locale {
  // 1. Check cookie first (user preference)
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = getPreferredLocale(acceptLanguage);
    if (preferredLocale) {
      return preferredLocale;
    }
  }

  // 3. Default to English
  return 'en';
}

function getPreferredLocale(acceptLanguage: string): Locale | null {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, quality] = lang.trim().split(';q=');
      return {
        locale: locale.split('-')[0], // Extract language code (e.g., 'he' from 'he-IL')
        quality: quality ? parseFloat(quality) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { locale } of languages) {
    if (locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }

  return null;
}

export function setLocaleCookie(locale: Locale) {
  return `locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
