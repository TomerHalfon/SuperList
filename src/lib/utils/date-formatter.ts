export function formatRelativeDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  // For Hebrew, use different formatting
  if (locale === 'he') {
    if (diffInMinutes < 1) {
      return 'עכשיו';
    } else if (diffInMinutes < 60) {
      return `לפני ${diffInMinutes} דקות`;
    } else if (diffInHours < 24) {
      return `לפני ${diffInHours} שעות`;
    } else if (diffInDays === 1) {
      return 'אתמול';
    } else if (diffInDays < 7) {
      return `לפני ${diffInDays} ימים`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `לפני ${weeks} שבועות`;
    } else {
      return date.toLocaleDateString('he-IL', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  }

  // English formatting
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export function formatAbsoluteDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  const localeCode = locale === 'he' ? 'he-IL' : 'en-US';
  return date.toLocaleDateString(localeCode, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
