import { jwtDecode, JwtPayload } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const { exp: expirationtTime } = decodedToken;

    if (!expirationtTime) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

    return expirationtTime < currentTime;
  } catch {
    console.error("Error al decodificar el token:");
    return true; // Si hay error, se considera expirado
  }
};
