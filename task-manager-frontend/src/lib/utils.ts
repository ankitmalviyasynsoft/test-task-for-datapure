import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'No due date';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDueDateBadge(dateString?: string | null): { text: string; isPastDue: boolean } {
  if (!dateString) return { text: 'No due date', isPastDue: false };
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return { text: 'Due today', isPastDue: false };
    if (isTomorrow(date)) return { text: 'Due tomorrow', isPastDue: false };
    const past = isPast(date);
    return {
      text: format(date, 'MMM d'),
      isPastDue: past,
    };
  } catch {
    return { text: dateString, isPastDue: false };
  }
}

