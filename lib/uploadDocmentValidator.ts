export const FILESIZELIMIT = 30 * 1024 * 1024

const forbiddenMimePatterns = [
  /^application\/x-msdownload/,     // exe, dll
  /^application\/x-ms-installer/,   // msi
  /^application\/x-sh/,             // shell script
  /^application\/x-executable/,     // linux binary
  /^application\/x-dosexec/,        // DOS binary
  /^application\/octet-stream$/,    // UNKNOWN, often dangerous
  /^text\/javascript/,
  /^application\/javascript/,
  /^text\/x-python/,
  /^application\/x-python/,
  /^application\/java-archive/,     // JAR
  /^application\/x-php/,
  /^text\/x-php/,
  /^text\/x-shellscript/,
  /^application\/x-shockwave-flash/,

  /^video\//,
];
function validateMimeType(mime: string): boolean {
  if (!mime) return false;

  if (forbiddenMimePatterns.some(pattern => pattern.test(mime))) {
    return false;
  }

  return true
}

interface uploadDocmentValidatorResult {
    success: boolean,
    message: string
}

export default function uploadDocumentValidator(files: File[]): uploadDocmentValidatorResult {
  const forbidden: File[] = [];
  const tooBig: File[] = [];

  for (const file of files) {
    if (!validateMimeType(file?.type)) {
      forbidden.push(file);
    } else if (file.size > FILESIZELIMIT) {
      tooBig.push(file);
    }
  }

  const messages: string[] = [];
  if (forbidden.length > 0) messages.push(`Forbidden files: ${forbidden.map(f => f?.name).join(", ")}`);
  if (tooBig.length > 0) messages.push(`Too big files: ${tooBig.map(f => f?.name).join(", ")}`);

  return {
    success: forbidden.length === 0 && tooBig.length === 0,
    message: messages.join("; ")
  };
}