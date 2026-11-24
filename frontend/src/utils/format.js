export const formatDate = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

export const excerpt = (text = '', length = 160) =>
  text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
