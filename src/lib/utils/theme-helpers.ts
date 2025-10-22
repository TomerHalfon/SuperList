import { ThemeMode, THEME_INFO, LocalizedThemeInfo } from '@/types/theme';
import { themes } from '@/lib/theme/themes';

/**
 * Get localized theme information using translations
 * @param themeId - The theme ID
 * @param t - Translation function from next-intl
 * @returns Localized theme information
 */
export function getLocalizedThemeInfo(
  themeId: ThemeMode, 
  t: (key: string) => string
): LocalizedThemeInfo {
  const baseInfo = THEME_INFO[themeId];
  
  return {
    id: themeId,
    name: t(`themes.${themeId}.name`),
    description: t(`themes.${themeId}.description`),
    category: baseInfo.category,
  };
}

/**
 * Generate a dynamic gradient based on theme colors
 * @param themeId - The theme ID
 * @returns CSS gradient string using primary and secondary colors from the theme
 */
export function getThemeGradient(themeId: ThemeMode): string {
  const theme = themes[themeId];
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  
  return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
}

/**
 * Get all localized theme information
 * @param t - Translation function from next-intl
 * @returns Record of all localized theme information
 */
export function getAllLocalizedThemeInfo(
  t: (key: string) => string
): Record<ThemeMode, LocalizedThemeInfo> {
  const result: Record<ThemeMode, LocalizedThemeInfo> = {} as Record<ThemeMode, LocalizedThemeInfo>;
  
  Object.keys(THEME_INFO).forEach((themeId) => {
    result[themeId as ThemeMode] = getLocalizedThemeInfo(themeId as ThemeMode, t);
  });
  
  return result;
}

/**
 * Get theme categories with localized names
 * @param t - Translation function from next-intl
 * @returns Array of theme categories with localized names
 */
export function getThemeCategories(t: (key: string) => string) {
  return [
    {
      id: 'standard' as const,
      name: t('themes.categories.standard'),
      themes: Object.values(THEME_INFO).filter(theme => theme.category === 'standard')
    },
    {
      id: 'nature' as const,
      name: t('themes.categories.nature'),
      themes: Object.values(THEME_INFO).filter(theme => theme.category === 'nature')
    },
    {
      id: 'specialty' as const,
      name: t('themes.categories.specialty'),
      themes: Object.values(THEME_INFO).filter(theme => theme.category === 'specialty')
    }
  ];
}
