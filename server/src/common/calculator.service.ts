import { ItemRequest } from '../model/request/item.request';

export function CalculateTotalAmount(items: ItemRequest[], taxAndService?: number, discount?: number): number {
  // 1. Hitung subtotal dengan menjumlahkan harga semua item.
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  // 2. Tambahkan pajak & layanan (jika ada, jika tidak, anggap 0).
  const totalAfterTaxes = subtotal + (taxAndService ?? 0);

  // 3. Kurangi diskon (jika ada, jika tidak, anggap 0).
  const finalTotal = totalAfterTaxes - (discount ?? 0);

  // 4. Pastikan total akhir tidak kurang dari 0.
  return Math.max(0, finalTotal);
}