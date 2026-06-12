import {
  cn,
  copyToClipboard,
  downloadStateReport,
  parsePeriodString,
  toISODate,
  toTitleCase,
} from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('toISODate', () => {
  it('returns UTC date as YYYY-MM-DD', () => {
    expect(toISODate('2024-03-15T12:00:00Z')).toBe('2024-03-15');
  });
});

describe('parsePeriodString', () => {
  it('parses valid YYYY_MM strings', () => {
    const date = parsePeriodString('2025_03');
    expect(date).toEqual(new Date(Date.UTC(2025, 2)));
  });

  it('returns null for empty or invalid input', () => {
    expect(parsePeriodString(null)).toBeNull();
    expect(parsePeriodString(undefined)).toBeNull();
    expect(parsePeriodString('')).toBeNull();
    expect(parsePeriodString('invalid')).toBeNull();
    expect(parsePeriodString('2025_13')).toBeNull();
    expect(parsePeriodString('abcd_03')).toBeNull();
  });
});

describe('toTitleCase', () => {
  it('capitalizes each word', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('returns empty string for falsy input', () => {
    expect(toTitleCase(null)).toBe('');
    expect(toTitleCase(undefined)).toBe('');
    expect(toTitleCase('')).toBe('');
  });
});

describe('copyToClipboard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses navigator.clipboard when available', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await expect(copyToClipboard('https://example.com')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('https://example.com');
  });

  it('returns false when clipboard write fails', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error('denied')) },
    });

    await expect(copyToClipboard('https://example.com')).resolves.toBe(false);
  });

  it('falls back to execCommand when clipboard API is unavailable', async () => {
    Object.assign(navigator, { clipboard: undefined });
    const execCommand = jest.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    await expect(copyToClipboard('fallback-url')).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('returns false when execCommand throws', async () => {
    Object.assign(navigator, { clipboard: undefined });
    document.execCommand = jest.fn().mockImplementation(() => {
      throw new Error('copy failed');
    });

    await expect(copyToClipboard('fallback-url')).resolves.toBe(false);
  });
});

describe('downloadStateReport', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'blob:mock');
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    jest.restoreAllMocks();
  });

  it('downloads a PDF when fetch succeeds', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(blob),
    });

    const click = jest.fn();
    const anchor = document.createElement('a');
    anchor.click = click;
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);

    await downloadStateReport('https://example.com/report.pdf', 'report.pdf');

    expect(fetch).toHaveBeenCalledWith('https://example.com/report.pdf', {
      method: 'GET',
    });
    expect(anchor.download).toBe('report.pdf');
    expect(click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('logs an error when fetch fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await downloadStateReport('https://example.com/missing.pdf', 'report.pdf');

    expect(consoleError).toHaveBeenCalled();
  });
});
