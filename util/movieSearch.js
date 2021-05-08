import axios from "axios";

export const searchForMovies = async (title, year) => {
  let response;
  let data;

  const safeTitle = title || "";
  const safeYear = year || "";

  console.log(process.env.API_KEY);

  response = await axios.get(
    `http://www.omdbapi.com/?s=${safeTitle}&y=${safeYear}&apikey=${process.env.API_KEY}`
  );
  data = await response.data;

  if (data.Response === "False") {
    response = await axios.get(
      `http://www.omdbapi.com/?t=${safeTitle}&y=${safeYear}&apikey=${process.env.API_KEY}`
    );
    data = await response.data;
  }

  return data;
};

export const checkIfMoviesExists = async (title, year) => {
  const data = await searchForMovies(title, null);

  if (data.Response === "False") {
    return false;
  } else {
    return true;
  }
};
