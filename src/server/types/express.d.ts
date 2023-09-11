declare namespace Express {
  export interface Request {
    user: User & {
      accessToken?: string;
      refreshToken?: string;
      _json?: {
        name: string;
        given_name: string;
        email: string;
      };
    };
  }
}
