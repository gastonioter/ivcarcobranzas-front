export interface User {
  userId: string;
  role: UserRoles;
}

export enum UserRoles {
  VENTAS = "enc_ventas",
  MONITOREO = "enc_monitoreo",
  ADMIN = "admin",
}
