import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import {
  addMovieToList,
  removeMovieInList,
  searchForMovies,
} from "../../util/movieSearch";
import {
  getPropsMovieData,
  addSelectedFromUser,
} from "../../util/componentHelper";
import { getSession, useSession } from "next-auth/client";
import styled from "styled-components";
import SearchForm from "../../components/SearchForm";
import { connectToDatabase } from "../../util/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const MovieSearch = (props) => {
  const result = getPropsMovieData(props);
  const updatedResult = addSelectedFromUser(
    result.map((v) => ({ ...v, selected: false })),
    props.userList
  );

  const [userList, setUserList] = useState(updatedResult);
  const [count, setCount] = useState(props.userList.length || 0);

  const [session, loading] = useSession();
  const [error, setError] = useState("none");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {}, [userList]);

  const addMovieToListHandler = async (imdbId) => {
    if (session) {
      setIsLogged(true);
      const { response, data } = await addMovieToList(
        imdbId,
        session.user.email
      );
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
    } else {
      setIsLogged(false);
    }
  };

  const favouriteHandler = async (e, idx, movieId) => {
    if (!userList[idx].selected) {
      if (count < 5) {
        e.target.style.color = "red";
        setCount(count + 1);

        let temp = userList;
        temp[idx].selected = true;
        setUserList(temp);
        temp = null;

        console.log(movieId);

        const response = await addMovieToListHandler(movieId);
      }
    } else {
      e.target.style.color = "66ff00";
      setCount(count - 1);

      let temp = userList;
      temp[idx].selected = false;
      setUserList(temp);
      temp = null;

      console.log(movieId);

      const response = await removeMovieFromListHandler(movieId);
    }
  };

  return (
    <Container>
      <main className="search-results">
        <h1 className="search-slug-title">SEARCH FOR A MOVIE</h1>

        <SearchForm />

        <ul className="remove-extra center-flex">
          {updatedResult.map((movie, i) => (
            <li key={movie.imdbID}>
              <PosterCtn>
                <img
                  className="image-poster"
                  src={movie.Poster}
                  alt={movie.Title}
                />

                <h2 className="poster-title">{movie.Title}</h2>

                <div className="favourite-buttons">
                  {session ? (
                    <FontAwesomeIcon
                      className="fa-user"
                      icon={faHeart}
                      size="lg"
                      style={
                        userList[i].selected
                          ? {
                              color: "red",
                              transition: "all 1s ease",
                              zIndex: "50",
                            }
                          : {
                              color: "#66ff00",
                              transition: "all 1s ease",
                              zIndex: "50",
                            }
                      }
                      value={i}
                      movieId={movie.imdbID}
                      onClick={(e) => {
                        favouriteHandler(e, i, movie.imdbID);
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="fa-user"
                      icon={faHeart}
                      size="lg"
                      style={{ color: "grey", zIndex: "50" }}
                    />
                  )}

                  <FontAwesomeIcon
                    className="fa-user fa-user-2"
                    icon={faHeart}
                    size="lg"
                  />
                </div>
              </PosterCtn>
            </li>
          ))}
        </ul>
      </main>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 6rem;
  min-height: 100vh;
  background: var(--main-bg-color);

  .search-slug-title {
    font-size: 3rem;
    text-align: center;
    font-weight: 700;
    padding: 1rem;
    text-shadow: 3px 3px 0px rgba(255, 205, 205, 0.5);
    color: white;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .search-results {
    margin: var(--main-margin);

    @media only screen and (min-width: 2000px) {
      width: var(--max-width-rem);
      margin: 0rem;
      margin: auto;
    }

    @media (max-width: 900px) {
      margin: var(--tablet-margin);
    }

    @media (max-width: 370px) {
      margin: var(--mobile-margin);
    }
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 1rem;
    padding: 2rem 0rem;

    @media (max-width: 320px) {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }
`;

const PosterCtn = styled.div`
  color: white;
  position: relative;
  background: black;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 16px 0 rgba(98, 98, 98, 0.2);
  }

  .image-poster {
    width: 100%;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    height: 500px;
    object-fit: cover;

    @media (max-width: 700px) {
      height: 400px;
    }
  }

  .poster-title {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    padding: 1rem 0rem;
    text-shadow: 3px 3px 0px rgba(255, 205, 205, 0.5);
  }

  .fa-user {
    position: absolute;
    top: 0;
    right: 0;
    top: 5%;
    right: 7%;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 20;
    &:hover {
      transform: scale(1.1);
    }
  }

  .fa-user-2 {
    font-size: 2.3rem;
    color: #000000;
    transform: translate(-1%, -2%);

    &:hover {
      transform: none;
    }
  }
`;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });
  let nominationLimit = null;

  const { params } = ctx;
  const { slug } = params;
  let error = false;

  // get movies from ctx
  const data = await searchForMovies(slug[0], slug[1]);

  // get user profile

  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    nominationLimit = userProfile.likedMovies;
    client.close();
  }

  if (data.Response === "False") {
    error = true;
  }

  return {
    props: { data: data, error: error, userList: nominationLimit },
  };
}

export default MovieSearch;
