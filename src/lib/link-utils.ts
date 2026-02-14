export const trimLink = (value = '') => value.trim();

export const LINK_PLACEHOLDER_PATTERN = /\b(?:placeholder|todo|xxxxx|temp|tbd|tba|n\/a)\b/i;
export const HTTP_LINK_PATTERN = /^https?:\/\//i;

export const isPlaceholder = (value = '') => {
  const normalized = trimLink(value);
  if (!normalized) {
    return false;
  }

  return LINK_PLACEHOLDER_PATTERN.test(normalized.toLowerCase());
};

export const isInternalPath = (value = '') => {
  const normalized = trimLink(value);
  return normalized.startsWith('/') && !normalized.startsWith('//');
};

export const isExternalUrl = (value = '') => {
  const normalized = trimLink(value);
  return HTTP_LINK_PATTERN.test(normalized);
};

export const isCanonicalLink = (value = '') => {
  const normalized = trimLink(value);
  if (!normalized) {
    return false;
  }

  return isInternalPath(normalized) || isExternalUrl(normalized);
};

export const isUnavailableLink = (value = '') => {
  const normalized = trimLink(value).toLowerCase();
  return !normalized || isPlaceholder(normalized);
};

export const sanitizeLink = (value = '') => trimLink(value);

export const isSafeHttpUrl = (value = '') => {
  const normalized = trimLink(value);
  if (!isExternalUrl(normalized)) {
    return false;
  }

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
