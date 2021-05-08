import { hash, compare } from "bcryptjs";

export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

export const verifyPassword = async (password, hasedPassword) => {
  const result = await compare(password, hasedPassword);
  console.log(result);
  return result;
};
