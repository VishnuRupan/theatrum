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

export const isMovieAlreadyInList = async (userProfile, imdb) => {
  const result = await userProfile.likedMovies.some(
    (movie) => movie["imdbID"] === imdb
  );

  return result;
};

export const addMovieToList = async (imdbId, email) => {
  const response = await fetch("/api/movies/modify-list", {
    method: "PATCH",
    body: JSON.stringify({
      email: email,
      imdbID: imdbId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return { response, data };
};

export const removeMovieInList = async (imdbId, email) => {
  const response = await fetch("/api/movies/modify-list", {
    method: "DELETE",
    body: JSON.stringify({
      email: email,
      imdbID: imdbId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return { response, data };
};
