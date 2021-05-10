import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const PosterCards = ({
  movie,
  i,
  session,
  userList,
  removeMovieFromListHandler,
  addMovieToListHandler,
  setUserList,
  count,
  setCount,
}) => {
  //

  console.log("i am count", count);

  const favouriteHandler = async (e, idx, movieId) => {
    console.log(userList[idx].selected);
    if (!userList[idx].selected) {
      console.log(count);
      if (count < 5) {
        console.log("hi");
        e.target.style.color = "red";
        setCount(count + 1);

        let temp = userList;
        temp[idx].selected = true;
        setUserList(temp);
        temp = null;

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
    <PosterCtn>
      <img className="image-poster" src={movie.Poster} alt={movie.Title} />

      <h2 className="poster-title">
        ({movie.Year}) {movie.Title}
      </h2>

      <div className="favourite-buttons">
        {session && userList ? (
          <FontAwesomeIcon
            className="fa-user"
            icon={faHeart}
            size="lg"
            style={
              userList[i].selected
                ? {
                    color: "red",
                    zIndex: "50",
                  }
                : {
                    color: "#66ff00",
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
  );
};

const PosterCtn = styled.div`
  color: white;
  position: relative;
  background: black;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid white;

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
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    padding: 1rem 0.3rem;
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
    z-index: 20;
    &:hover {
      transform: scale(1.15);
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

export default PosterCards;
