export interface TimeZoneOption {
  value: string;
  label: string;
  offset: string;
  numericOffset: number;
}

const parseOffset = (offset: string): number => {
  const match = offset.match(/UTC([+-]\d+)(?:\/[+-]\d+)?/);
  return match ? parseInt(match[1]) : 0;
};

const createTimeZoneOption = (
  value: string,
  label: string,
  offset: string,
): TimeZoneOption => ({
  value,
  label,
  offset,
  numericOffset: parseOffset(offset),
});

const unsortedTimeZones: TimeZoneOption[] = [
  createTimeZoneOption("Africa/Tunis", "Tunisia", "UTC+1"),
  createTimeZoneOption("UTC", "UTC", "UTC+0"),
  createTimeZoneOption("Europe/London", "London", "UTC+0/+1"),
  createTimeZoneOption("Europe/Paris", "Paris", "UTC+1/+2"),
  createTimeZoneOption("Europe/Berlin", "Berlin", "UTC+1/+2"),
  createTimeZoneOption("America/New_York", "New York", "UTC-5/-4"),
  createTimeZoneOption("America/Chicago", "Chicago", "UTC-6/-5"),
  createTimeZoneOption("America/Denver", "Denver", "UTC-7/-6"),
  createTimeZoneOption("America/Los_Angeles", "Los Angeles", "UTC-8/-7"),
  createTimeZoneOption("Asia/Dubai", "Dubai", "UTC+4"),
  createTimeZoneOption("Asia/Tokyo", "Tokyo", "UTC+9"),
  createTimeZoneOption("Australia/Sydney", "Sydney", "UTC+10/+11"),
];

export const timeZoneOptions = [...unsortedTimeZones].sort((a, b) => {
  // First sort by numeric offset
  if (a.numericOffset !== b.numericOffset) {
    return a.numericOffset - b.numericOffset;
  }
  // If offsets are equal, sort alphabetically by label
  return a.label.localeCompare(b.label);
});

export const formatTimeZone = (timeZone: string): string => {
  const option = timeZoneOptions.find((tz) => tz.value === timeZone);
  return option ? `${option.label} (${option.offset})` : timeZone;
};

export const getUserTimeZone = (): string => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    timeZoneOptions.find((tz) => tz.value === userTimeZone)?.value ||
    "Africa/Tunis"
  );
};
