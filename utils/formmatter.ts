import Decimal from "decimal.js";
import { IntlShape } from "next-intl";

export function moneyFormat(value: number | string | Decimal): string {
  const decimals = 2;

  const decimalValue = new Decimal(value);

  // Use Intl.NumberFormat
  const formatted = new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(decimalValue.toNumber());

  return `${formatted}`;
}

export function dateFormat(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function dateTimeFormat(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatModifiedTime(
  date: Date,
  t: IntlShape["formatMessage"],
): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  if (hours < 24) return t("hoursAgo", { count: hours });

  const isYesterday = days === 1;
  const time = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isYesterday) return t("yesterdayAt", { time: time });

  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatBankAccountNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  // Standard 10-digit formatting: 3-1-5-1 (SCB, KBank, etc.)
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  // 11-digit standard format: 3-1-5-2
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 9)}-${digits.slice(9, 11)}`;
  }

  // 12-digit format: 3-1-6-2 (some TTB & GSB)
  if (digits.length === 12) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 10)}-${digits.slice(10, 12)}`;
  }

  // Fallback: return cleaned digits
  return digits;
}

export function formatMetaMoney(
  meta?: Record<string, string | number | Date>,
): Record<string, string | number | Date> {
  if (!meta) return {};

  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => {
      if (typeof value === "number") {
        return [key, moneyFormat(value)];
      }
      return [key, value];
    }),
  );
}
