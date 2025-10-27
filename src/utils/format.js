import { format, isValid, parseISO, differenceInDays } from 'date-fns';

/**
 * Validates if a value is a valid date
 * @param {*} date - The date value to validate
 * @returns {boolean} - True if valid date, false otherwise
 */
export function isValidDate(date) {
  if (!date) return false;
  
  // If it's already a Date object, check if it's valid
  if (date instanceof Date) {
    return isValid(date);
  }
  
  // If it's a string, try to parse it
  if (typeof date === 'string') {
    // Try parsing as ISO string
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) return true;
    
    // Try parsing as Date constructor
    const constructedDate = new Date(date);
    return isValid(constructedDate);
  }
  
  // Try converting to Date
  const convertedDate = new Date(date);
  return isValid(convertedDate);
}

/**
 * Safely formats a date with fallback for invalid dates
 * @param {Date|string|number} date - The date to format
 * @param {string} formatString - The format string (date-fns format)
 * @param {string} fallback - Fallback value for invalid dates (default: "N/A")
 * @returns {string} - Formatted date or fallback value
 */
export function safeFormat(date, formatString, fallback = 'N/A') {
  // Handle null or undefined
  if (date == null) {
    return fallback;
  }
  
  try {
    let dateToFormat = date;
    
    // If it's a string, try to parse it
    if (typeof date === 'string') {
      // Try ISO format first
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        dateToFormat = parsedDate;
      } else {
        // Try Date constructor
        dateToFormat = new Date(date);
      }
    }
    
    // If it's not a Date object, try to convert
    if (!(dateToFormat instanceof Date)) {
      dateToFormat = new Date(dateToFormat);
    }
    
    // Final validation before formatting
    if (!isValid(dateToFormat)) {
      return fallback;
    }
    
    return format(dateToFormat, formatString);
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', date);
    return fallback;
  }
}

/**
 * Safely calculates difference in days with fallback
 * @param {Date|string} date - The date to compare
 * @param {Date|string} baseDate - The base date (default: now)
 * @returns {number|null} - Difference in days or null if invalid
 */
export function safeDifferenceInDays(date, baseDate = new Date()) {
  if (!isValidDate(date)) return null;
  if (!isValidDate(baseDate)) return null;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    const parsedBaseDate = typeof baseDate === 'string' ? parseISO(baseDate) : new Date(baseDate);
    
    if (!isValid(parsedDate) || !isValid(parsedBaseDate)) return null;
    
    return differenceInDays(parsedDate, parsedBaseDate);
  } catch (error) {
    console.error('Error calculating date difference:', error);
    return null;
  }
}

/**
 * Parses a date value safely
 * @param {*} dateValue - The value to parse
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function safeParseDate(dateValue) {
  if (!dateValue) return null;
  
  try {
    if (dateValue instanceof Date) {
      return isValid(dateValue) ? dateValue : null;
    }
    
    if (typeof dateValue === 'string') {
      const parsedDate = parseISO(dateValue);
      if (isValid(parsedDate)) return parsedDate;
      
      const constructedDate = new Date(dateValue);
      return isValid(constructedDate) ? constructedDate : null;
    }
    
    const convertedDate = new Date(dateValue);
    return isValid(convertedDate) ? convertedDate : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

export default safeFormat;