import { Product } from "@/models";
import { Detail } from "@/models/Transaction";

export interface TransactionState {
  iva: number;
  details: Detail[];
  customerId: string;
  subtotal: number;
}

export const initialState: TransactionState = {
  iva: 0,
  details: [],
  customerId: "",
  subtotal: 0,
};
export type Action =
  | { readonly type: "delete-item"; payload: string }
  | { readonly type: "add-item"; payload: Product }
  | { readonly type: "update-item"; payload: Detail }
  | { readonly type: "update-customer"; payload: string }
  | { readonly type: "update-iva"; payload: number }
  | { readonly type: "setState"; payload: TransactionState };

export function reducer(
  state = initialState,
  action: Action
): TransactionState {
  const { type, payload } = action;
  if (type == "update-customer") {
    return {
      ...state,
      customerId: payload,
    };
  }

  if (type == "update-iva") {
    return {
      ...state,
      iva: payload,
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
      subtotal: newSubtotal(newDetails),
    };
  }

  if (type == "delete-item") {
    const newDetails = state.details.filter((item) => item.uuid !== payload);
    return {
      ...state,

      details: newDetails,
      subtotal: newSubtotal(newDetails),
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
      subtotal: newSubtotal(details),
    };
  }

  function newSubtotal(details: Detail[]) {
    return details.reduce((acc, detail) => {
      return detail.unitPrice * detail.quantity + acc;
    }, 0);
  }

  return state;
}
