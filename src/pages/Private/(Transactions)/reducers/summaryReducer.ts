export type SummaryState = {
  discount: number;
  iva: number;
};

export const initialState: SummaryState = {
  discount: 0,
  iva: 0,
};

export type Action =
  | { readonly type: "update-iva"; payload: number }
  | { readonly type: "update-discount"; payload: number };

export const reducer = (state = initialState, action: Action) => {
  const { type, payload } = action;

  if (type == "update-iva") {
    return {
      ...state,
      iva: payload,
    };
  }

  if (type == "update-discount") {
    return {
      ...state,
      discount: payload,
    };
  }

  return state;
};
