import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  SessionUser,
  Web3AuthSessionPayloadSocialMedia,
  Web3AuthSessionPayloadWeb3,
} from '../type';
interface IAuthService {
  getUserSession(): Promise<SessionUser | undefined>;
  decodeToken(token: string): Promise<jwt.JwtPayload>;
  verifyWeb3AuthToken(
    token: string,
    type: 'social' | 'web3'
  ): Promise<{
    payload: Web3AuthSessionPayloadSocialMedia | Web3AuthSessionPayloadWeb3;
    isValid: boolean;
  }>;
  createToken(payload: SessionUser): Promise<string>;
  saveToken(token: string, key: string): void;
  getToken(): string | null;
}
class AuthService implements IAuthService {
  constructor() {}
  getToken(): string | null {
    return localStorage.getItem('bloom:token');
  }
  saveToken(token: string, key: string): void {
    localStorage.setItem(key, token);
  }
  async createToken(payload: SessionUser): Promise<string> {
    const { data } = await axios.post('/api/createToken', { payload });
    this.saveToken(data.token, 'bloom:token');
    return data.token as string;
  }
  async verifyWeb3AuthToken(
    token: string,
    type: 'social' | 'web3'
  ): Promise<{
    payload: Web3AuthSessionPayloadSocialMedia | Web3AuthSessionPayloadWeb3;
    isValid: boolean;
  }> {
    const { data } = await axios.get<{
      payload: any;
      isValid: boolean;
    }>(`/api/verifyToken?type=${type}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  }
  async getUserSession(): Promise<SessionUser | undefined> {
    const token = localStorage.getItem('bloom:token') as string;
    if (!token) return;
    const user = (await this.decodeToken(token)) as SessionUser;
    return user;
  }
  async decodeToken(token: string): Promise<jwt.JwtPayload> {
    //Example
    try {
      const { data } = await axios.get<{
        isValid: boolean;
        payload: JwtPayload;
      }>('/api/verifyToken?bloom=true', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return data.payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService();
