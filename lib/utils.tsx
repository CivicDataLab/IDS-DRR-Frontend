import { ClassNameValue, twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs);
}

export function formatDate(
  input: string | number,
  isHyphenated = false
): string {
  const date = new Date(input);
  // If hyphendated it would return date in this format - 2023-01-01 else in April 1, 2021
  return isHyphenated
    ? new Date(
        date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      )
        .toISOString()
        .split('T')[0]
    : date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
}

// util function to format data in the following format "2023_08"
export function formatDateString(
  dateString: string | null | undefined,
  isHyphenated = false
) {
  if (!dateString) {
    return '';
  }

  if (isHyphenated) {
    return dateString.replace('_', '-');
  }

  // Split the string into year and month parts
  const [year, month] = dateString.split('_');

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  // Guard against invalid values that would create an invalid Date
  if (
    Number.isNaN(yearNum) ||
    Number.isNaN(monthNum) ||
    monthNum < 1 ||
    monthNum > 12
  ) {
    return '';
  }

  // Create a Date object with the specified year and month (subtract 1 from the month, as months in JavaScript are zero-based)
  const dateObject = new Date(yearNum, monthNum - 1);

  if (Number.isNaN(dateObject.getTime())) {
    return '';
  }

  // Format the date as "Month Year"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(dateObject);

  return formattedDate;
}

export function handleRedirect(event: any, link: any) {
  event.preventDefault();
  const confirmation = window.confirm(
    `You are being redirected to "${link}". `
  );
  if (confirmation) {
    window.open(link, '_blank');
  }
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

export function formatReferenceDate(
  input: string | number | any,
  isHyphenated = false
): string {
  const date = new Date(input);
  // If hyphendated it would return date in this format - 2023-01-01 else in April 1, 2021
  return isHyphenated
    ? new Date(
        date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          // day: 'numeric',
        })
      )
        .toISOString()
        .split('T')[0]
    : date.toLocaleDateString('en-US', {
        month: 'long',
        // day: 'numeric',
        year: 'numeric',
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
