import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import {
  addMovieToList,
  removeMovieInList,
  searchForMovies,
} from "../../util/movieSearch";
import { getPropsMovieData } from "../../util/componentHelper";
import { getSession, useSession } from "next-auth/client";

const MovieSearch = (props) => {
  const result = getPropsMovieData(props);
  const [session, loading] = useSession();
  const [error, setError] = useState("none");
  const [isLogged, setIsLogged] = useState(false);

  const addMovieToListHandler = async (imdbId) => {
    if (session) {
      setIsLogged(true);
      const { response, data } = await addMovieToList(
        imdbId,
        session.user.email
      );

      if (!response.ok) {
        setError("failedAdd");
      } else {
        setError("none");
      }
    } else {
      setIsLogged(false);
    }
  };

  const removeMovieFromListHandler = async (imdbId) => {
    if (session) {
      setIsLogged(true);
      const { response, data } = await removeMovieInList(
        imdbId,
        session.user.email
      );

      if (!response.ok) {
        setError("failedRemove");
      } else {
        setError("none");
      }
    } else {
      setIsLogged(false);
    }
  };

  return (
    <div>
      {result.map((e) => (
        <div key={e.imdbID}>
          <p>
            {e.Title} - {e.imdbID}
          </p>

          <button onClick={() => addMovieToListHandler(e.imdbID)}>Add</button>
          <button onClick={() => removeMovieFromListHandler(e.imdbID)}>
            Remove
          </button>

          <br />
          <hr />
        </div>
      ))}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const { slug } = params;

  // get movies from ctx
  const data = await searchForMovies(slug[0], slug[1]);

  if (data.Response === "False") {
    return {
      redirect: {
        destination: "/search",
        permanent: false,
      },
    };
  }

  return {
    props: { data },
  };
}

export default MovieSearch;
