'use client';

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from 'next-intl';

interface IntlProviderProps {
  children: React.ReactNode;
  messages: any;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({ children, messages }) => {
  const locale = useLocale();
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};
