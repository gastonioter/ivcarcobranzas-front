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
  NEW_SALE: "nueva",
  DETAIL_SALE: "/:uuid",
  CUSTOMERS: "clientes",
  MONTHLY_FEES: "mensualidades",
  PAYMENTS: "pagos",
};

export enum Roles {
  ENC_MONITOREO = "enc_monitoreo",
  ENC_VENTAS = "enc_ventas",
}
