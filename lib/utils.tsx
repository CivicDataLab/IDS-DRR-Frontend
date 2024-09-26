import React from 'react';
import { AlertDialog, Button } from 'opub-ui';
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
export function formatDateString(dateString: string, isHyphenated = false) {
  if (isHyphenated) {
    return dateString.replace('_', '-');
  }
  // Split the string into year and month parts
  const [year, month] = dateString.split('_');

  // Create a Date object with the specified year and month (subtract 1 from the month, as months in JavaScript are zero-based)
  const dateObject = new Date(parseInt(year), parseInt(month) - 1);

  // Format the date as "Month Year"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(dateObject);

  return formattedDate;
}

export function deSlugify(slug: string) {
  // Replace hyphens or underscores with spaces
  const deSlugified = slug.replace(/[-_]/g, ' ');
  // Capitalize the first letter of each word
  return deSlugified.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function slugify(string: string) {
  return string
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (excluding spaces and hyphens)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace consecutive hyphens with a single hyphen
}

const convertMap: any = {
  border: (value: { width: any; style: any; color: any }) => {
    return `${value.width} ${value.style} ${value.color}`;
  },
  shadow: (value: {
    offsetX: any;
    offsetY: any;
    blur: any;
    spread: any;
    color: any;
  }) => {
    return `${value.offsetX} ${value.offsetY} ${value.blur} ${value.spread} ${value.color}`;
  },
  default: (value: any) => {
    return value;
  },
};

export function convertValue(value: any, category: any) {
  return convertMap[category] ? convertMap[category](value) : value;
}

export const blobToBase64 = function (blob: Blob) {
  let reader = new FileReader();
  reader.onload = function () {
    let dataUrl: any = reader.result;
    let base64 = dataUrl?.split(',')[1];

    return base64;
  };
  reader.readAsDataURL(blob);
};

// function to convert bytes into friendly format
export function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

export const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export function handleRedirect(event: any, link: any) {
  event.preventDefault();
  const confirmation = window.confirm(
    `You are being redirected to "${link}". `
  );
  if (confirmation) {
    window.open(link, '_blank');
  }
}

export function copyCurrentURL() {
  const currentURL = window.location.href;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        console.log('URL copied to clipboard:', currentURL);
        alert('URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL.');
      });
  } else {
    // For browsers not supporting clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = currentURL;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const success = document.execCommand('copy');
      if (success) {
        console.log('URL copied to clipboard:', currentURL);
        alert('URL copied to clipboard!');
      } else {
        console.error('Failed to copy URL.');
        alert('Failed to copy URL.');
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL.');
    }

    document.body.removeChild(textArea);
  }
}

export function copyDefinedURL(url: any) {
  const currentURL = url;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        console.log('URL copied to clipboard:', currentURL);
        alert('URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL.');
      });
  } else {
    // For browsers not supporting clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = currentURL;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const success = document.execCommand('copy');
      if (success) {
        console.log('URL copied to clipboard:', currentURL);
        alert('URL copied to clipboard!');
      } else {
        console.error('Failed to copy URL.');
        alert('Failed to copy URL.');
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL.');
    }

    document.body.removeChild(textArea);
  }
}

export function toTitleCase(str: string) {
  return str.replace(/\b\w/g, function (char: string) {
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
