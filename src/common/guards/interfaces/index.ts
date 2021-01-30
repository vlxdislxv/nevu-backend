import { User } from 'src/user/db/user.entity';

export interface VerifyResp {
  uid: number;
  iat: number;
  exp: number;
}

export interface AuthWSResponse {
  success: boolean;
}

export interface AuthWSRequest {
  user: User;
  token: string;
}
