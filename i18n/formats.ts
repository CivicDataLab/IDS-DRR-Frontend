export const formats = {
  dateTime: {
    // "September 16, 2024" in en-US
    longDate: {
      dateStyle: 'long',
      timeZone: 'UTC',
    },
    // "September 2024" in en-US
    monthYear: {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    },
    // "Sep 2024" in en-US
    monthYearShort: {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    },
  },
} as const;
