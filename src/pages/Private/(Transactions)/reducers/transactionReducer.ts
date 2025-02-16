import { Customer, Product } from "@/models";
import { Detail, Transaction } from "@/models/Transaction";

export type SaleCustomer = Pick<Customer, "uuid" | "firstName" | "lastName">;
export interface TransactionState {
  details: Detail[];
  customer: SaleCustomer;
  readonly: boolean;
}

export const initialState: TransactionState = {
  readonly: false,
  details: [],
  customer: {
    uuid: "",
    firstName: "",
    lastName: "",
  },
};
export type Action =
  | { readonly type: "delete-item"; payload: string }
  | { readonly type: "add-item"; payload: Product }
  | { readonly type: "update-item"; payload: Detail }
  | { readonly type: "update-customer"; payload: SaleCustomer }
  | {
      readonly type: "setTransaction";
      payload: Transaction;
    };

export function reducer(
  state = initialState,
  action: Action
): TransactionState {
  const { type, payload } = action;

  if (type == "update-customer") {
    return {
      ...state,
      customer: payload,
    };
  }

  if (type == "add-item") {
    const newDetail = {
      product: payload.name,
      quantity: 1,
      total: payload.price,
      uuid: payload.uuid,
      unitPrice: payload.price,
    };
    const newDetails = [...state.details, newDetail];
    return {
      ...state,
      details: newDetails,
    };
  }

  if (type == "delete-item") {
    const newDetails = state.details.filter((item) => item.uuid !== payload);
    return {
      ...state,

      details: newDetails,
    };
  }

  if (type == "update-item") {
    const details = state.details.map((item) => {
      if (item.uuid === payload.uuid) {
        return {
          ...item,
          quantity: payload.quantity,
          total: payload.unitPrice * payload.quantity,
          unitPrice: payload.unitPrice,
        };
      }

      return item;
    });

    return {
      ...state,
      details,
      // subtotal: newSubtotal(details),
    };
  }

  if (type == "setTransaction") {
    return {
      customer: payload.customer,
      details: payload.details,
      readonly: true,
    };
  }

  return state;
}
