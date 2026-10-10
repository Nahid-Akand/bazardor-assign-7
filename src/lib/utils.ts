
export function toBengaliNumber(value: number | string): string {
  const bengaliDigits = "০১২৩৪৫৬৭৮৯";

  return String(value).replace(/[0-9]/g, (digit) =>
    bengaliDigits[Number(digit)],
  );
}

export function formatPrice(price: number): string {
  return `${toBengaliNumber(price.toLocaleString("en-US"))} টাকা`;
}

export function formatUnit(unit: string): string {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    l: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };

  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

export function formatPercent(value: number): string {
  return `${toBengaliNumber(value.toFixed(1))}%`;
}
