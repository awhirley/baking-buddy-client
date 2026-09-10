export function formatAddedDate(iso: string): string {
  const trimmed = iso.replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(trimmed);

  if (isNaN(date.getTime())) return "recently";

  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursPart = hours > 0 ? `${hours} hour${hours === 1 ? "" : "s"}` : "";
  const minutesPart = minutes > 0 ? `${minutes} minute${minutes === 1 ? "" : "s"}` : "";

  if (hoursPart && minutesPart) return `${hoursPart} ${minutesPart}`;
  if (hoursPart) return hoursPart;
  if (minutesPart) return minutesPart;
  return "0 minutes";
}