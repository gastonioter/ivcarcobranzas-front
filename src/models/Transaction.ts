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
  customerId: z.string().nonempty("El cliente es requerido"),
  iva: z.number().nonnegative("El iva no puede ser negativo").finite(),
  sellerId: z.string().nonempty(),
  details: z
    .array(
      z.object({
        uuid: string().uuid(),
        product: z.string(),
        quantity: z
          .string()
          .transform((val) => Number(val))
          .or(z.number())
          .refine((val) => val > 0, {
            message: "La cantidad debe ser un número positivo",
          }),

        unitPrice: z
          .string()
          .transform((val) => Number(val))
          .or(z.number())
          .refine((val) => val > 0, {
            message: "El precio unitario debe ser un número positivo",
          }),
      })
    )
    .min(1, "Debe agregar al menos un producto"),
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
