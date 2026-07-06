// gameUtils.js

export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}
export function isNear(x1, y1, x2, y2, radius = 60) {
  return distance(x1, y1, x2, y2) <= radius;
}