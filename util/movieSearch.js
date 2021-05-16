import axios from "axios";

export const searchForMovies = async (title, year) => {
  let response;
  let data;

  const safeTitle = title || "";
  const safeYear = year || "";

  try {
    response = await axios.get(
      `http://www.omdbapi.com/?s=${safeTitle}&y=${safeYear}&type=movie&apikey=${process.env.OMDB_ID}`
    );
    data = await response.data;

    if (data.Response === "False") {
      response = await axios.get(
        `http://www.omdbapi.com/?t=${safeTitle}&y=${safeYear}&type=movie&apikey=${process.env.OMDB_ID}`
      );
      data = await response.data;
    }
  } catch (error) {
    console.log("error: ", error);
    data = { Response: "False" };
  }

  return data;
};

export const getMovieById = async (imdbID) => {
  let response;
  let data;
  try {
    response = await axios.get(
      `https://api.themoviedb.org/3/find/${imdbID}?api_key=${process.env.TMDB_ID}&language=en-US&external_source=imdb_id`
    );
    data = await response.data.movie_results[0];
  } catch (error) {
    data = null;
  }

  return data;
};

export const getSimilarMovies = async (imdbID) => {
  let response;
  let data;
  try {
    response = await axios.get(
      `https://api.themoviedb.org/3/movie/${imdbID}/similar?api_key=${process.env.TMDB_ID}&language=en-US&page=1`
    );
    data = await response.data.results;
  } catch (error) {
    data = null;
  }

  return data;
};

export const getMovieDetails = async (movieid) => {
  let response;
  let data;
  try {
    response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieid}?api_key=${process.env.TMDB_ID}&language=en-US`
    );
    data = await response.data;
  } catch (error) {
    data = null;
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

export const addMovieToList = async (
  imdbId,
  email,
  movieTitle,
  movieYear,
  moviePoster
) => {
  const response = await fetch("/api/movies/modify-list", {
    method: "PATCH",
    body: JSON.stringify({
      email: email,
      imdbID: imdbId,
      movieTitle: movieTitle,
      movieYear: movieYear,
      moviePoster: moviePoster,
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
