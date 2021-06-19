import {
  addMovieToList,
  getMovieById,
  getMovieDetails,
  getSimilarMovies,
  isMovieAlreadyInList,
  removeMovieInList,
} from "../../util/movieSearch";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMovieYear, movieImageUrlPath } from "../../util/inputFields";
import { marginContainer, primeButton } from "../../styles/uiComponents";
import IntroText from "../../components/IntroText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { genres } from "../../data/genre";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";
import InvalidInput from "../../components/modal/InvalidInput";
import PosterCards from "../../components/PosterCards";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";
// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper/core";
// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

const MovieName = (props) => {
  const movie = props.movieData;
  const movieImage = movieImageUrlPath(movie.poster_path);
  const movieBackdrop = movieImageUrlPath(movie.backdrop_path);
  const movieYear = getMovieYear(movie.release_date);
  const genreIds = genres();
  const movieGenre = [];
  const router = useRouter();

  const movieURL = `https://theatrum.vercel.app/${router.asPath}`;

  console.log(router);
  const [isAdded, setIsAdded] = useState(props.isAdded);
  const [session, loading] = useSession();
  const [count, setCount] = useState(props.count);
  const [countOpen, setCountOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //copy to clipboard
  const [text, setText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  // When using NextJS, getInitialProps is called before the page renders only for the first time.
  //On subsequent page renders (client side routing), NextJS executes it on the client,
  //but this means that data is not available before page render.
  // isAdded does not get updated with prop the second time without useEffect
  useEffect(() => {
    setIsAdded(props.isAdded);
  }, [props.imdbID]);

  for (let i = 0; i < movie.genre_ids.length; i++) {
    genreIds.forEach((genre) => {
      genre.id === movie.genre_ids[i] ? movieGenre.push(genre.name) : "";
    });
  }

  const addMovieToListHandler = async () => {
    if (session && !isAdded && count < 5) {
      const { response, data } = await addMovieToList(
        props.imdbID,
        session.user.email,
        movie.title,
        movieYear,
        movieImage
      );
      setIsAdded(true);
    }
    if (count === 5) {
      setCountOpen(true);
    }

    return null;
  };

  const removeMovieInListHandler = async () => {
    if (session && isAdded) {
      const { response, data } = await removeMovieInList(
        props.imdbID,
        session.user.email
      );
      setIsAdded(false);
      setCount(count - 1);
    }
  };

  return (
    <MoviePage className="main-body">
      {isOpen && (
        <PopupImage>
          <img
            src={
              movie.backdrop_path === null
                ? "/images/notfound.jpg"
                : movieBackdrop
            }
            alt={movie.title}
          />
        </PopupImage>
      )}

      {countOpen && (
        <InvalidInput
          warning="Error"
          error="Max number of likes reached!"
          setIsOpen={setCountOpen}
        />
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

      <MainMargin>
        <MovieCard>
          <div className="image-section">
            <img
              className="single-poster-image"
              src={
                movie.poster_path === null ? "/images/notfound.jpg" : movieImage
              }
              alt={movie.original_title}
            />

            {session ? (
              <div className="btn-select-group">
                {isAdded ? (
                  <RemoveButton onClick={removeMovieInListHandler}>
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
            <div className="movie-text-clip">
              <IntroText first={movie.title} second="" last="" />

              <CopyToClipboard text={movieURL} onCopy={onCopyText}>
                <img
                  src="/images/copy-clip.svg"
                  alt="copy to clipboard"
                  className="copy-clip-svg"
                />
              </CopyToClipboard>

              {isCopied && (
                <div className="copied-link">
                  <p>Copied!</p>
                </div>
              )}
            </div>

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

        <h3 className="similar-movies">Similar Movies</h3>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="mySwiper"
        >
          {props.similarMovies &&
            props.similarMovies.map((movie, i) => (
              <SwiperSlide key={movie.imdbID}>
                <PosterCards movie={movie} i={i} profile={true} />
              </SwiperSlide>
            ))}
        </Swiper>
      </MainMargin>
    </MoviePage>
  );
};

const MoviePage = styled.div`
  position: relative;

  .react-share-btn {
    background: red;
    height: 5rem;
    width: 5rem;
  }

  .copied-link {
    /* position: absolute;
    top: 0;
    top: 7rem;
    right: 4rem; */
    padding: 0.3rem 1rem;
    height: 2rem;
    margin-left: 1rem;
    margin-top: 1rem;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5),
      inset 1px 1px 4px rgba(0, 0, 0, 0.7);
    border-radius: 5px;

    p {
      font-size: 0.8rem;
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

    &:hover {
      background: #252525;
    }

    &:active {
      box-shadow: inset 0 0 10px #000000;
    }
  }

  .fa-close {
    font-size: 1rem;

    cursor: pointer;
  }

  @media (max-width: 850px) {
    .copied-link {
      position: absolute;
      top: 0;
      top: 7rem;
      margin: 0;
      right: 4rem;
    }
  }

  @media (max-width: 600px) {
    padding-top: 4.5rem;

    .copied-link {
      top: 0;
      top: 4.5rem;
      right: 50%;
      transform: translateX(50%);
    }
  }
`;

const MainMargin = styled(marginContainer)`
  .swiper-slide {
    margin: 2rem 0rem;
  }

  .swiper-pagination-bullet {
    background: white;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: red;
  }

  .swiper-container {
    min-width: 15rem;
    max-width: 20rem;
    margin: 0rem;
  }

  .poster-ctn {
    margin: 0rem;
  }

  .similar-movies {
    padding-top: 3rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .image-poster {
    height: 300px;
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

  .copy-clip-svg {
    width: 1rem;
    margin-left: 1rem;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }

  .movie-text-clip {
    display: flex;
  }

  @media (max-width: 850px) {
    .image-section {
      min-width: 15rem;
    }

    .movie-info {
      padding: 0rem 2rem;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    text-align: center;

    .image-section {
      min-width: 10rem;
    }

    .movie-text-clip {
      align-items: center;
      justify-content: center;
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
  let response = false;
  let count = 0;
  const similarWithId = [];
  const error = false;
  let currentMovieId = "";
  const session = await getSession({ req: ctx.req });
  let data = null;
  const { params } = ctx;
  const imdbID = params.movieID[0].toString();

  // get movie id from tmdb api

  data = await getMovieById(imdbID);

  if (data === undefined) {
    return {
      redirect: {
        destination: `/not-found/${imdbID}`,
        permanent: false,
      },
    };
  }
  currentMovieId = data.id;

  // get similar movies using imdb id
  let similarMovies = await getSimilarMovies(currentMovieId);
  if (similarMovies.length >= 4) {
    similarMovies = similarMovies.slice(0, 3);
  }

  // make array of movie with imdb id

  for (let i = 0; i < similarMovies.length; i++) {
    const detailData = await getMovieDetails(similarMovies[i].id);

    similarWithId.push({
      Title: detailData.title,
      Poster: movieImageUrlPath(detailData.poster_path),
      imdbID: detailData.imdb_id,
      Year: getMovieYear(detailData.release_date),
    });
  }

  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    count = userProfile.likedMovies.length;

    response = await isMovieAlreadyInList(userProfile, imdbID);
  } else {
    response = null;
  }

  return {
    props: {
      movieData: data,
      similarMovies: similarWithId,
      imdbID: imdbID,
      isAdded: response,
      count: count,
      error: error,
    },
  };
}

export default MovieName;
