function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("de-DE", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function formatDateShort(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("de-DE", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatDuration(ms) {
  if (typeof ms !== "number") return "-";
  if (ms < 1e3) return `${ms} ms`;
  return `${(ms / 1e3).toFixed(1)} s`;
}
function prettifyJson(payload) {
  if (!payload) return "{}";
  try {
    const parsed = JSON.parse(payload);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return payload;
  }
}
export {
  formatDate as a,
  formatDuration as b,
  formatDateShort as f,
  prettifyJson as p
};
