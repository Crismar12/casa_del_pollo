const hasTimeComponent = (dateString: string): boolean => dateString.includes('T');

const localeOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const formatDateLocal = (dateString: string): string => {
  const date = hasTimeComponent(dateString)
    ? new Date(dateString)
    : (() => {
        const [year, month, day] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      })();
  return date.toLocaleDateString('es-PE', localeOptions);
};

export const formatDateTimeLocal = (dateString: string): string => {
  const date = hasTimeComponent(dateString)
    ? new Date(dateString)
    : (() => {
        const [year, month, day] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      })();
  return date.toLocaleString('es-PE', {
    ...localeOptions,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
