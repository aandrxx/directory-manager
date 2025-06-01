import { getParentPath } from './directories.map';

describe('getParentPath', () => {
  test('should return the parent path for a nested path', () => {
    expect(getParentPath('parent/child')).toBe('parent');
  });

  test('should return the parent path for a deeply nested path', () => {
    expect(getParentPath('root/parent/child')).toBe('root/parent');
  });

  test('should return an empty string for a top-level path', () => {
    expect(getParentPath('root')).toBe('');
  });

  test('should handle paths with trailing slashes correctly', () => {
    expect(getParentPath('parent/child/')).toBe('parent');
  });

  test('should return empty string for empty path', () => {
    expect(getParentPath('')).toBe('');
  });

  test('should handle paths with multiple consecutive slashes', () => {
    expect(getParentPath('parent//child')).toBe('parent');
  });
});
