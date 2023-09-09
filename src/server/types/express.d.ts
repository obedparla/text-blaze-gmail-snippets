declare namespace Express {
  export interface Request {
    user: User & {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
