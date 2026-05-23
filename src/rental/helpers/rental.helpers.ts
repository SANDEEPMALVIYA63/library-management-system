/**
 * Calculates due date by adding rentalDays to the current UTC date.
 */
export function calculateDueDate(rentalDays: number): Date {
  const due = new Date();
  due.setUTCDate(due.getUTCDate() + rentalDays);
  due.setUTCHours(23, 59, 59, 999); // end of that day
  return due;
}

/**
 * Returns true if the rental is past its due date and not yet returned.
 */
export function isOverdue(dueDate: Date, returnedAt: Date | null): boolean {
  if (returnedAt) return false;
  return new Date() > dueDate;
}

/**
 * Calculates how many days a rental ran (from rentedAt to returnedAt or today).
 */
export function calculateRentalDuration(
  rentedAt: Date,
  returnedAt?: Date | null,
): number {
  const end = returnedAt ?? new Date();
  const diffMs = end.getTime() - rentedAt.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
