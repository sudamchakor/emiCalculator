import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  capitalizeFirstLetter,
  truncateText,
  getInitials,
  isValidEmail,
  isValidPhoneNumber,
  isValidPassword,
  calculateReadingTime,
} from '../../src/utils/formatting';

describe('Formatting Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency with default Indian Rupee symbol', () => {
      expect(formatCurrency(123456.78)).toBe('₹1,23,456.78');
    });

    it('should format currency with custom symbol', () => {
      expect(formatCurrency(1234.56, '$')).toBe('$1,234.56');
    });

    it('should handle zero value', () => {
      expect(formatCurrency(0)).toBe('₹0.00');
    });

    it('should handle negative value', () => {
      expect(formatCurrency(-123.45)).toBe('-₹123.45');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567890.12)).toBe('₹1,23,45,67,890.12');
    });

    it('should handle non-numeric input gracefully', () => {
      expect(formatCurrency(null)).toBe('₹0.00');
      expect(formatCurrency(undefined)).toBe('₹0.00');
      expect(formatCurrency('abc')).toBe('₹0.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with two decimal places', () => {
      expect(formatPercentage(0.12345)).toBe('12.35%');
    });

    it('should format percentage with custom decimal places', () => {
      expect(formatPercentage(0.12345, 1)).toBe('12.3%');
    });

    it('should handle zero value', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });

    it('should handle whole numbers', () => {
      expect(formatPercentage(1)).toBe('100.00%');
    });

    it('should handle non-numeric input gracefully', () => {
      expect(formatPercentage(null)).toBe('0.00%');
      expect(formatPercentage(undefined)).toBe('0.00%');
      expect(formatPercentage('xyz')).toBe('0.00%');
    });
  });

  describe('formatNumber', () => {
    it('should format number with Indian locale by default', () => {
      expect(formatNumber(1234567.89)).toBe('12,34,567.89');
    });

    it('should format number with custom locale options', () => {
      expect(formatNumber(12345.67, { style: 'decimal', minimumFractionDigits: 0 })).toBe('12,346');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234.5)).toBe('-1,234.5');
    });

    it('should handle non-numeric input gracefully', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
      expect(formatNumber('abc')).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('should format date to "DD Mon, YYYY" by default', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      expect(formatDate(date)).toBe('15 Jan, 2023');
    });

    it('should handle invalid date input', () => {
      expect(formatDate('invalid date')).toBe('Invalid Date');
      expect(formatDate(null)).toBe('Invalid Date');
    });

    it('should format date with custom options', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      expect(formatDate(date, { weekday: 'long' })).toBe('Sunday');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle string with single letter', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('should handle string with leading spaces', () => {
      expect(capitalizeFirstLetter('  word')).toBe('  word'); // Should not trim
    });

    it('should handle non-string input gracefully', () => {
      expect(capitalizeFirstLetter(null)).toBe('');
      expect(capitalizeFirstLetter(undefined)).toBe('');
      expect(capitalizeFirstLetter(123)).toBe('123'); // Numbers are converted to string
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...');
    });

    it('should not truncate text shorter than max length', () => {
      expect(truncateText('Short text', 15)).toBe('Short text');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('should handle max length less than 3', () => {
      expect(truncateText('Text', 2)).toBe('T..'); // Default ellipsis length is 3, so min length is 3
    });

    it('should handle non-string input gracefully', () => {
      expect(truncateText(null, 10)).toBe('');
      expect(truncateText(undefined, 10)).toBe('');
      expect(truncateText(12345, 3)).toBe('12...');
    });
  });

  describe('getInitials', () => {
    it('should return initials for a full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should return initial for a single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle multiple spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle non-string input gracefully', () => {
      expect(getInitials(null)).toBe('');
      expect(getInitials(undefined)).toBe('');
      expect(getInitials(123)).toBe('1'); // Converts to string "123" -> "1"
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('john.doe123@sub.domain.co.in')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(123)).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for valid 10-digit phone numbers', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('9876543210')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhoneNumber('12345')).toBe(false);
      expect(isValidPhoneNumber('12345678901')).toBe(false);
      expect(isValidPhoneNumber('abc1234567')).toBe(false);
      expect(isValidPhoneNumber(null)).toBe(false);
      expect(isValidPhoneNumber(undefined)).toBe(false);
      expect(isValidPhoneNumber(1234567890)).toBe(false); // Should be string
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)', () => {
      expect(isValidPassword('Password123!')).toBe(true);
      expect(isValidPassword('P@ssw0rd1')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(isValidPassword('password123')).toBe(false); // No uppercase
      expect(isValidPassword('PASSWORD123')).toBe(false); // No lowercase
      expect(isValidPassword('Password!!')).toBe(false); // No number
      expect(isValidPassword('Password123')).toBe(false); // No special char
      expect(isValidPassword('P@ss1')).toBe(false); // Too short
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
      expect(isValidPassword(12345678)).toBe(false);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time for a given text', () => {
      const shortText = 'This is a short text.'; // 5 words
      expect(calculateReadingTime(shortText)).toBe(1); // Assuming 200 words per minute

      const longText = 'Word '.repeat(200); // 200 words
      expect(calculateReadingTime(longText)).toBe(1);

      const veryLongText = 'Word '.repeat(300); // 300 words
      expect(calculateReadingTime(veryLongText)).toBe(2);
    });

    it('should return 1 for empty or very short text', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('Hello')).toBe(1);
      expect(calculateReadingTime(null)).toBe(1);
      expect(calculateReadingTime(undefined)).toBe(1);
    });

    it('should handle non-string input gracefully', () => {
      expect(calculateReadingTime(12345)).toBe(1);
    });
  });
});