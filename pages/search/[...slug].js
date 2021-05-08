import React from "react";
import Head from "next/head";
import axios from "axios";
import { searchForMovies } from "../../util/movieSearch";
import { getPropsMovieData } from "../../util/componentHelper";

const MovieSearch = (props) => {
  const result = getPropsMovieData(props);

  return (
    <div>
      {result.map((e) => (
        <p key={e.imdbID}>
          {e.Title} - {e.imdbID}
        </p>
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
