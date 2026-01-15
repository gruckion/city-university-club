import * as Calendar from "expo-calendar";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

// Regex patterns for parsing date/time - defined at module level for performance
const TIME_RANGE_PATTERN =
  /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i;
const DATE_PATTERN =
  /(\d{1,2})(?:st|nd|rd|th)?\s*(?:-\s*\d{1,2}(?:st|nd|rd|th)?)?\s*(\w+)|(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?/i;

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
  /** Minutes before event to trigger alarm. Default: 60 (1 hour before) */
  alarmMinutesBefore?: number;
}

export interface UseAddToCalendarResult {
  /** Add event to calendar using native UI */
  addToCalendar: (eventData: CalendarEventData) => Promise<boolean>;
  /** Whether calendar permission has been granted */
  hasPermission: boolean | null;
  /** Whether an operation is in progress */
  isLoading: boolean;
  /** Request calendar permissions manually */
  requestPermission: () => Promise<boolean>;
}

/**
 * Hook to add events to the device calendar using native UI
 *
 * Uses `Calendar.createEventInCalendarAsync()` which launches the native
 * OS calendar UI, letting users choose which calendar to add to and
 * edit details before saving.
 */
export function useAddToCalendar(): UseAddToCalendarResult {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting calendar permission:", error);
      setHasPermission(false);
      return false;
    }
  }, []);

  const addToCalendar = useCallback(
    async (eventData: CalendarEventData): Promise<boolean> => {
      setIsLoading(true);

      try {
        // Check/request permission first
        let permissionGranted = hasPermission;

        if (permissionGranted === null) {
          const { status } = await Calendar.getCalendarPermissionsAsync();
          permissionGranted = status === "granted";
          setHasPermission(permissionGranted);
        }

        if (!permissionGranted) {
          permissionGranted = await requestPermission();
        }

        if (!permissionGranted) {
          Alert.alert(
            "Calendar Permission Required",
            "Please enable calendar access in your device settings to add events.",
            [{ text: "OK" }]
          );
          return false;
        }

        // Use the native calendar UI to create the event
        // This lets users choose which calendar and edit details
        const result = await Calendar.createEventInCalendarAsync({
          title: eventData.title,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          location: eventData.location,
          notes: eventData.notes,
          alarms: eventData.alarmMinutesBefore
            ? [
                {
                  relativeOffset: -eventData.alarmMinutesBefore,
                },
              ]
            : [{ relativeOffset: -60 }], // Default: 1 hour before
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        // Check if the user saved the event
        if (result.action === "saved") {
          return true;
        }

        // User cancelled - not an error, just return false
        if (result.action === "canceled") {
          return false;
        }

        return false;
      } catch (error) {
        console.error("Error adding event to calendar:", error);
        Alert.alert(
          "Calendar Error",
          "There was a problem adding the event to your calendar. Please try again.",
          [{ text: "OK" }]
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [hasPermission, requestPermission]
  );

  return {
    addToCalendar,
    hasPermission,
    isLoading,
    requestPermission,
  };
}

/**
 * Parse event date strings into Date objects
 *
 * Handles formats like:
 * - "December 18th" -> specific date in current/next year
 * - "1st - 23rd December" -> first date of range
 * - "Monthly" / "Last Friday of month" -> next occurrence
 *
 * For complex recurring dates, returns the next reasonable occurrence.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Date parsing inherently requires many branches for different formats
export function parseEventDateTime(
  dateRange: string,
  time: string,
  year?: number
): { startDate: Date; endDate: Date } {
  const currentYear = year ?? new Date().getFullYear();

  // Parse time like "7:00 PM - 11:00 PM" or "12:00 PM - 3:00 PM"
  const timeMatch = time.match(TIME_RANGE_PATTERN);

  let startHour = 12;
  let startMinute = 0;
  let endHour = 14;
  let endMinute = 0;

  if (timeMatch) {
    startHour = Number.parseInt(timeMatch[1], 10);
    startMinute = Number.parseInt(timeMatch[2], 10);
    const startPeriod = timeMatch[3].toUpperCase();

    endHour = Number.parseInt(timeMatch[4], 10);
    endMinute = Number.parseInt(timeMatch[5], 10);
    const endPeriod = timeMatch[6].toUpperCase();

    // Convert to 24-hour format
    if (startPeriod === "PM" && startHour !== 12) {
      startHour += 12;
    }
    if (startPeriod === "AM" && startHour === 12) {
      startHour = 0;
    }
    if (endPeriod === "PM" && endHour !== 12) {
      endHour += 12;
    }
    if (endPeriod === "AM" && endHour === 12) {
      endHour = 0;
    }
  }

  // Month name to number mapping
  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  // Try to extract a date from the dateRange
  // Format: "December 18th" or "18th December" or "1st - 23rd December"
  const dateMatch = dateRange.match(DATE_PATTERN);

  let month = 11; // Default to December
  let day = 1;

  if (dateMatch) {
    if (dateMatch[1] && dateMatch[2]) {
      // Format: "18th December" or "1st - 23rd December"
      day = Number.parseInt(dateMatch[1], 10);
      const monthName = dateMatch[2].toLowerCase();
      if (months[monthName] !== undefined) {
        month = months[monthName];
      }
    } else if (dateMatch[3] && dateMatch[4]) {
      // Format: "December 18th"
      const monthName = dateMatch[3].toLowerCase();
      if (months[monthName] !== undefined) {
        month = months[monthName];
      }
      day = Number.parseInt(dateMatch[4], 10);
    }
  }

  // Handle recurring events - use next month
  if (
    dateRange.toLowerCase().includes("monthly") ||
    dateRange.toLowerCase().includes("last friday")
  ) {
    const now = new Date();
    month = now.getMonth();
    // For "Last Friday of month", calculate it
    if (dateRange.toLowerCase().includes("last friday")) {
      const lastDay = new Date(currentYear, month + 1, 0);
      const dayOfWeek = lastDay.getDay();
      const daysFromFriday = (dayOfWeek + 2) % 7;
      day = lastDay.getDate() - daysFromFriday;
    } else {
      day = 15; // Default to middle of month for generic monthly
    }
  }

  const startDate = new Date(currentYear, month, day, startHour, startMinute);
  const endDate = new Date(currentYear, month, day, endHour, endMinute);

  // If the date is in the past, use next year
  if (startDate < new Date()) {
    startDate.setFullYear(currentYear + 1);
    endDate.setFullYear(currentYear + 1);
  }

  return { startDate, endDate };
}
