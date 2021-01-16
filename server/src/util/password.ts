import { hash, compare } from 'bcrypt';

let SALT = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, SALT);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await compare(password, hash);
};