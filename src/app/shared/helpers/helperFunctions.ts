export function formatDate(inputDate: string | Date): string {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  //return `${day}-${month}-${year} hora: ${hour}:${minutes}`;
  return `${day}-${month}-${year}`;
}
