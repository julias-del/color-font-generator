function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);

  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = x =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function generatePalette({ base, saturation, lightness, harmony }) {
  const baseHue = base
    ? parseInt(base.replace("#", "").slice(0, 2), 16)
    : Math.floor(Math.random() * 360);

  let hues = [];

  switch (harmony) {
    case "analogous":
      hues = [baseHue, baseHue + 20, baseHue - 20, baseHue + 40, baseHue - 40];
      break;

    case "complementary":
      hues = [baseHue, baseHue + 180, baseHue + 30, baseHue - 30];
      break;

    case "triadic":
      hues = [baseHue, baseHue + 120, baseHue + 240, baseHue + 60];
      break;

    default:
      hues = Array.from({ length: 5 }, () => Math.random() * 360);
  }

  return hues.map(h =>
    hslToHex((h + 360) % 360, saturation, lightness)
  );
}