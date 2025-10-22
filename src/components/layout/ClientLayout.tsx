'use client';

import React from 'react';
import { useLocale } from 'next-intl';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const locale = useLocale();
  const isRTL = locale === 'he';

  // Update the HTML lang and dir attributes
  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [locale, isRTL]);

  return <>{children}</>;
};
