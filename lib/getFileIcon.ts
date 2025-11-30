const iconMap: Record<string, string> = {
  pdf: "pdf.svg",

  // images
  jpg: "image.svg",
  jpeg: "image.svg",
  png: "image.svg",
  gif: "image.svg",
  webp: "image.svg",
  bmp: "image.svg",
  tiff: "image.svg",
  tif: "image.svg",
  heic: "image.svg",
  heif: "image.svg",
  svg: "image.svg",

  // excel
  xlsx: "xlsx.svg",
  xls: "xlsx.svg",

  // zips
  zip: "zip.svg",
  rar: "zip.svg",
  tar: "zip.svg",
  tgz: "zip.svg",
  "tar.gz": "zip.svg",
  tbz: "zip.svg",
  tbz2: "zip.svg",
  "tar.bz2": "zip.svg",
  "tar.xz": "zip.svg",
  txz: "zip.svg",
};

function getExt(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".tar.gz")) return "tar.gz";
  if (lower.endsWith(".tar.bz2")) return "tar.bz2";
  if (lower.endsWith(".tar.xz")) return "tar.xz";

  return lower.split(".").pop()!;
}

export default function getFileIcon(fileName: string) {
  const ext = getExt(fileName);
  const icon = iconMap[ext.toLowerCase()] ?? "unknown.svg";
  return "/fileIcons/" + icon;
}
