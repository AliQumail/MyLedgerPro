export function buildReminderMessage(
  customerName: string,
  currency: string,
  toTake: number,
  toGive: number
): string {
  if (toTake > 0) {
    return `Hi ${customerName}, this is a friendly reminder that you have an outstanding balance of ${currency} ${toTake.toLocaleString()} with us. Please arrange payment at your earliest convenience. Thank you! - LedgerFlow`;
  }
  if (toGive > 0) {
    return `Hi ${customerName}, just a note that we owe you ${currency} ${toGive.toLocaleString()}. We'll settle this soon. Thank you! - LedgerFlow`;
  }
  return `Hi ${customerName}, your account is fully settled. Thank you for being a valued customer! - LedgerFlow`;
}

export function openWhatsAppReminder(phoneNo: string, message: string): void {
  const digits = phoneNo.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/${digits}?text=${text}`, '_blank');
}
