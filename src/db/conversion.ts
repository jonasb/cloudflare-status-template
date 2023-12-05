export function convertDate(date: string): Date;
export function convertDate(date: string | null): Date | null;
export function convertDate(date: string | null) {
  return date ? new Date(date) : null;
}
