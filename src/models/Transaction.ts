import { string, z } from "zod";

export interface Transaction {
  uuid: string;
  serie: string;
  details: Detail[];
  customer: SaleCustomer;
  totalAmount: number;
  createdAt: Date;
  iva: number;
  seller: Seller;
}

export interface Detail {
  uuid: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const CreateTransactionSchema = z.object({
  customerId: z.string(),
  iva: z.number(),
  sellerId: z.string(),
  details: z.array(
    z.object({
      uuid: string().uuid(),
      product: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
    })
  ),
});

export type TransactionFormData = z.infer<typeof CreateTransactionSchema>;

interface Seller {
  email: string;
}
interface SaleCustomer {
  uuid: string;
  firstName: string;
  lastName: string;
}
