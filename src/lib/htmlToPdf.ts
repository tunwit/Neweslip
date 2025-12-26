import { chromium } from "playwright";
import fs from "fs";

export async function htmlToPdf(html: string) {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle" });

  const pdf = await page.pdf({
    width: "210mm",
    height: "297mm", // A4
    printBackground: true,
    pageRanges: "1",
  });

  await browser.close();
  return pdf;
}
