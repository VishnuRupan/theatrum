import {
  addMovieToList,
  getMovieById,
  getSimilarMovies,
  isMovieAlreadyInList,
  removeMovieInList,
} from "../../util/movieSearch";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMovieYear, movieImageUrlPath } from "../../util/inputFields";
import { primeButton } from "../../styles/uiComponents";
import IntroText from "../../components/IntroText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { genres } from "../../data/genre";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";

const MovieName = (props) => {
  const movie = props.movieData;
  const movieImage = movieImageUrlPath(movie.poster_path);
  const movieBackdrop = movieImageUrlPath(movie.backdrop_path);
  const movieYear = getMovieYear(movie.release_date);
  const genreIds = genres();
  const movieGenre = [];
  const [isAdded, setIsAdded] = useState(props.isAdded);

  const [session, loading] = useSession();

  const [isOpen, setIsOpen] = useState(false);

  for (let i = 0; i < movie.genre_ids.length; i++) {
    genreIds.forEach((genre) => {
      genre.id === movie.genre_ids[i] ? movieGenre.push(genre.name) : "";
    });
  }

  const addMovieToListHandler = async () => {
    if (session) {
      const { response, data } = await addMovieToList(
        props.imdbID,
        session.user.email,
        movie.title,
        movieYear,
        movieImage
      );

      setIsAdded(true);
    }
    return null;
  };

  const removeMovieInListHandler = async () => {
    if (session) {
      const { response, data } = await removeMovieInList(
        props.imdbID,
        session.user.email
      );
      setIsAdded(false);
    }
  };

  console.log(isAdded);
  return (
    <MoviePage>
      {isOpen && (
        <PopupImage>
          <img src={movieBackdrop} alt={movie.title} />
        </PopupImage>
      )}

      {isOpen && (
        <div className="font-wrapper">
          <FontAwesomeIcon
            className="fa-close"
            icon={faTimes}
            size="1x"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}

      <main>
        <MovieCard>
          <div className="image-section">
            <img
              className="single-poster-image"
              src={movieImage}
              alt={movie.original_title}
            />

            {session ? (
              <div className="btn-select-group">
                {isAdded ? (
                  <RemoveButton
                    style={isAdded}
                    onClick={removeMovieInListHandler}
                  >
                    {" "}
                    Remove From Favorites
                  </RemoveButton>
                ) : (
                  <AddButton onClick={addMovieToListHandler}>
                    {" "}
                    Add To Favorites
                  </AddButton>
                )}
              </div>
            ) : (
              <AddButton
                style={{ background: "grey", color: "white" }}
                onClick={addMovieToListHandler}
              >
                Login To Favorite
              </AddButton>
            )}
          </div>

          <div className="movie-info">
            <IntroText first={movie.title} second="" last="" />

            <h3 className="single-movie-year"> {movieYear} </h3>

            <div className="image-section mobile">
              <img
                className="single-poster-image mobile mobile-image"
                src={movieImage}
                alt={movie.original_title}
              />
            </div>

            <div className="genre-ctn">
              {movieGenre.map((genre) => (
                <GenreBubble key={genre}>
                  <h5>{genre}</h5>
                </GenreBubble>
              ))}
            </div>

            <h4 className="ratings">
              <FontAwesomeIcon className="fa-rating" icon={faStar} size="1x" />{" "}
              <span className="rating-span"> {movie.vote_average}</span> / 10
            </h4>

            <h4 className="plot-label">Plot:</h4>
            <p className="plot-para">{movie.overview}</p>

            <img
              className="backdrop "
              src={movieBackdrop}
              alt={movie.title}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </MovieCard>
      </main>
    </MoviePage>
  );
};

const MoviePage = styled.div`
  padding-top: 7rem;
  padding-bottom: 3rem;
  min-height: 100vh;
  background: var(--main-bg-color);
  color: white;
  overflow-x: hidden;
  position: relative;

  main {
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

  .font-wrapper {
    position: fixed;
    padding: 0.2rem 0.6rem;
    border-radius: 50%;
    margin-top: 4.5rem;
    position: fixed;
    z-index: 999;
    color: #ffffff;
    bottom: 0;
    left: 0;
    left: 50%;
    transform: translateX(-25%);
    bottom: 5vh;
    background: #3b3b3b;
    transition: all 0.3s ease-in-out;
    border: solid 1px #3b3b3b;

    &:hover {
      background: #000000;
      border: solid 1px white;
    }
  }

  .fa-close {
    font-size: 1rem;

    cursor: pointer;
  }
`;

const MovieCard = styled.section`
  display: flex;

  .image-section {
    min-width: 20rem;
    max-width: 20rem;
  }

  .single-poster-image {
    width: 100%;
    box-shadow: 8px 8px 10px 0 rgba(0, 0, 0, 0.4);
    border-radius: 3px;
  }

  .mobile {
    display: none;
  }

  .movie-info {
    padding: 0rem 4rem;

    h1 {
      font-weight: 700;
      text-align: left;
      padding: 0rem;
      transform: translateY(-10%);
    }

    .single-movie-year {
      font-size: 1.5rem;
      font-weight: 700;
      text-align: left;
    }

    .backdrop {
      margin: 2rem 0rem;
      width: 15rem;
      object-fit: cover;
      box-shadow: 8px 8px 10px 0 rgba(0, 0, 0, 0.4);
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }

    .genre-ctn {
      display: flex;
      flex-wrap: wrap;
      padding: 1rem 0rem;
      margin-left: -0.5rem;
    }

    .ratings {
      padding: 1rem 0rem;
      padding-bottom: 2rem;
      font-weight: 600;
    }

    .rating-span {
      font-weight: 700;
      font-size: 1.3rem;
      color: var(--light-pink);
    }

    .fa-rating {
      margin-right: 0.5rem;
    }

    .plot-label {
      font-weight: 700;
      font-size: 0.9rem;
    }

    .plot-para {
      line-height: 1.5rem;
      font-style: italic;
    }
  }

  @media (max-width: 850px) {
    .image-section {
      min-width: 15rem;
    }

    .movie-info {
      padding: 0rem 2rem;
    }
  }

  @media (max-width: 500px) {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    text-align: center;

    .image-section {
      min-width: 10rem;
    }

    .single-poster-image {
      display: none;
    }

    .mobile {
      margin: auto;
      display: flex;
    }

    .mobile-image {
      margin: 1rem 0rem;
    }

    .movie-info {
      padding: 2rem 0rem;
      .single-movie-year,
      .intro-text {
        text-align: center;
      }

      .single-movie-year {
        font-size: 1.2rem;
      }

      .backdrop {
        margin: auto;
      }

      .plot-para {
        padding: 1rem 0rem;
        padding-bottom: 2rem;
      }

      .genre-ctn {
        justify-content: center;
        align-items: center;
      }
    }
  }
`;

const PopupImage = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  background: black;
  min-width: 100vw;
  min-height: 100vh;
  z-index: 99;

  img {
    width: 100%;
    object-fit: cover;
    margin-top: 4.5rem;
    ///transform: translateY(-50%);
    box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.8);
  }
`;

const GenreBubble = styled.div`
  background: var(--light-pink);
  margin: 0.3rem 0.3rem;
  box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.8);
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    box-shadow: 8px 8px 5px 0 rgba(0, 0, 0, 0.9);
    transform: translateY(-10%);
  }

  h5 {
    font-size: 0.7rem;
    white-space: nowrap;
    font-weight: 700;
    color: var(--main-bg-color);
  }
`;

const AddButton = styled(primeButton)`
  margin-top: 1rem;
  width: 100%;
  background: #008e00;
  color: white;

  &:hover {
    background: #00b300;
  }
`;

const RemoveButton = styled(primeButton)`
  margin-top: 1rem;
  width: 100%;
  background: #8e0000;
  color: white;

  &:hover {
    background: #b30000;
  }
`;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  const { params } = ctx;
  const imdbID = params.movieID[0].toString();

  const data = await getMovieById(imdbID);
  const currentMovieId = data.id;

  const similarMovies = await getSimilarMovies(currentMovieId);
  let response = false;

  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    response = await isMovieAlreadyInList(userProfile, imdbID);
  } else {
    response = null;
  }

  return {
    props: {
      movieData: data,
      similarMoviesData: similarMovies,
      imdbID: imdbID,
      isAdded: response,
    },
  };
}

export default MovieName;
