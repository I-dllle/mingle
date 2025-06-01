export const getDateString = (dateStr: string) => dateStr.split('T')[0];

export const getTimeString = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
