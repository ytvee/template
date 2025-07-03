import { parsedJwtToken } from "@/utils/types/parseToken.types";

export class JWTManager {
  public static parseJwt(token: string): parsedJwtToken {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((char) => {
          return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  public static isTokenExpiried(authToken: string): boolean {
    const parsedToken = this.parseJwt(authToken);
    if (parsedToken.exp) {
      //multiplication to 1000 for converting millisecond to seconds
      return parsedToken.exp * 1000 <= Date.now();
    } else {
      return false;
    }
  }
}
