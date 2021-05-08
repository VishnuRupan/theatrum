import {
  normalizeEmail,
  escape,
  isEmail,
  isStrongPassword,
  isAscii,
} from "validator";

export const sanitizeFields = (name, email, password) => {
  const sanitizedName = escape(name);
  const sanitizedEmail = normalizeEmail(email);
  const sanitizedPassword = escape(password);

  return {
    sanitizedName,
    sanitizedEmail,
    sanitizedPassword,
  };
};

export const isValidInput = (name, email, password) => {
  if (
    !email ||
    !password ||
    !name ||
    !isEmail(email) ||
    !isStrongPassword(password) ||
    !isAscii(name)
  ) {
    return true;
  } else {
    return false;
  }
};
