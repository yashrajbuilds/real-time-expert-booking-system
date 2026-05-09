export const formatDate = (dateValue) => {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const buildCategoryList = (experts = []) => {
  const categories = new Set(experts.map((expert) => expert.category).filter(Boolean));
  return ['All Categories', ...Array.from(categories).sort()];
};
