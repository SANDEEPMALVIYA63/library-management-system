// export const cleanString = (value?: string) => {
//   if (value === undefined || value === null) return undefined;
//   const trimmed = value.trim();
//   return trimmed === '' ? undefined : trimmed;
// };

// export const cleanNumber = (value?: number) => {
//   if (value === undefined || value === null) return undefined;
//   return Number.isNaN(value) ? undefined : value;
// };

// export function cleanStringField(
//   value: string | undefined,
// ): string | undefined {
//   if (value === undefined || value === null) return undefined;
//   if (value.trim() === '' || value.trim() === 'string') return undefined;
//   return value.trim();
// }

// export function cleanIntField(value: number | undefined): number | undefined {
//   if (value === undefined || value === null) return undefined;
//   if (value === 0) return undefined; // 0 ko invalid maano agar 0 valid nahi hai
//   return value;
// }
