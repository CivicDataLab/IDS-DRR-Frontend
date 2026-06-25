import { ClassNameValue, twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs);
}

// Returns the UTC calendar date of `input` as "YYYY-MM-DD".
// Use where a machine-readable ISO date string is needed.
export function toISODate(input: string | number): string {
  return new Date(input).toISOString().split('T')[0];
}

// Parses a "YYYY_MM" period string into a Date at UTC midnight on the first
// of the month, or null if the string is malformed.
export function parsePeriodString(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month] = value.split('_');
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  // Guard against invalid values that would create an invalid Date
  if (
    Number.isNaN(yearNum) ||
    Number.isNaN(monthNum) ||
    monthNum < 1 ||
    monthNum > 12
  ) {
    return null;
  }
  return new Date(Date.UTC(yearNum, monthNum - 1));
}

export async function copyToClipboard(url: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }
  const textArea = document.createElement('textarea');
  textArea.value = url;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

export function toTitleCase(str: string | null | undefined) {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, function (char: string) {
    return char.toUpperCase();
  });
}

export async function downloadStateReport(link: string, fileName: string) {
  try {
    const response = await fetch(link, {
      method: 'GET',
      // cache: 'no-store', // Prevent caching for dynamic downloads
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const elLink = document.createElement('a');
    elLink.href = url;
    elLink.download = fileName; // Specify the filename for download
    elLink.style.display = 'none'; // Hide the link element

    document.body.appendChild(elLink);
    elLink.click();

    // Clean up
    document.body.removeChild(elLink);
    URL.revokeObjectURL(url); // Clean up the URL object
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}
