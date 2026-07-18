export const PublicRoutes = {
  LOGIN: "login",
};

export const PrivateRoutes = {
  PRIVATE: "private",
  DASHBOARD: "dashboard",
  HOME: "home",

  PRODUCTS: "productos",
  CATEGORIES: "categorias",

  SALES: "ventas",
  BUDGETS: "presupuestos",
  NEW_BUDGET: "nuevo",
  NEW_SALE: "nueva",
  DETAIL_SALE: "ventas/:uuid/",
  DETAIL_BUDGET: "presupuestos/:uuid/",
  PAYMENTS_SALE: "pagos/:uuid",

  CUSTOMERS: "clientes",
  CUSTOMER_DETAIL: "clientes/:uuid",

  CUOTAS: "cuotas",
  NEW_CUOTA: "nueva",

  PAYMENTS: "pagos",
  NEW_PAYMENT: "nuevo",

  SETTINGS: "settings",
};

export enum Roles {
  ENC_MONITOREO = "enc_monitoreo",
  ENC_VENTAS = "enc_ventas",
}
