export function isValidPromptPay(id: string): boolean {
  if (!id) return false;

  const cleaned = id.replace(/-/g, "").trim();

  // 1. Thai mobile number (e.g., 0812345678)
  const mobileRegex = /^0[0-9]{9}$/;

  // 2. Thai national ID (13 digits)
  const natIdRegex = /^[1-9][0-9]{12}$/;

  // 3. E-wallet PromptPay ID (common: 15 digits)
  const eWalletRegex = /^[0-9]{15}$/;

  return (
    mobileRegex.test(cleaned) ||
    natIdRegex.test(cleaned) ||
    eWalletRegex.test(cleaned)
  );
}
