// Normalisasi nomor telepon Indonesia ke format internasional yang dibutuhkan
// link wa.me (tanpa angka nol di depan, tanpa simbol). Sama persis logikanya
// dengan App\Support\Phone::toWhatsapp() di versi Laravel.
export function toWhatsapp(phone: string | null | undefined): string | null {
  if (!phone || !phone.trim()) return null;

  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

export function waLink(phone: string | null | undefined, message: string): string | null {
  const number = toWhatsapp(phone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
