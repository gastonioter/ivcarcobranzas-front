export interface Transaction {
  uuid: string;
  serie: string;
  details: DetailDTO[];
  customer?: SaleCustomerDTO;
  createdAt: Date;
  iva: number;
  sellerId: string;
}

export interface TransactionFormData {
  customerId: string;
  sellerId: string;
  details: Detail[];
  iva: number;
}

interface DetailDTO {
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SaleCustomerDTO {
  uuid: string;
  firstName: string;
  lastName: string;
}

type Detail = Omit<DetailDTO, "total">;
