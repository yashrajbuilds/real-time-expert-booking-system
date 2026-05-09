const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const normalizeDateKey = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (DATE_KEY_PATTERN.test(trimmedValue)) return trimmedValue;

    const parsedDate = new Date(trimmedValue);
    if (!Number.isNaN(parsedDate.getTime())) return parsedDate.toISOString().slice(0, 10);
  }

  return null;
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

module.exports = { normalizeDateKey, isNonEmptyString };
