import { Detail } from "@/models/Transaction";

export function getSubtotalAmount(details: Detail[]) {
  return details.reduce((acc, detail) => {
    return detail.unitPrice * detail.quantity + acc;
  }, 0);
}
