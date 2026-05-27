export function calculateDueDate(rentalDays: number): Date {
  const due = new Date();
  due.setUTCDate(due.getUTCDate() + rentalDays);
  due.setUTCHours(23, 59, 59, 999);
  return due;
}

export function isOverdue(dueDate: Date, returnedAt: Date | null): boolean {
  if (returnedAt) return false;
  return new Date() > dueDate;
}

export function calculateRentalDuration(
  rentedAt: Date,
  returnedAt?: Date | null,
): number {
  const end = returnedAt ?? new Date();
  const diffMs = end.getTime() - rentedAt.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
