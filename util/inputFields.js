import {
  normalizeEmail,
  escape,
  isEmail,
  isStrongPassword,
  isAscii,
  isAlphanumeric,
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

export const replaceSpaces = (title) => {
  const newTitle = title.replace(/\s+/g, "-").toLowerCase();
  return newTitle;
};

export const movieImageUrlPath = (path) => {
  return `https://image.tmdb.org/t/p/original${path}`;
};

export const getMovieYear = (date) => {
  return date.substring(0, 4);
};
