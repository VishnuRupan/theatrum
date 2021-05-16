import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { replaceSpaces } from "../util/inputFields";
import React, { useState, useRef } from "react";
import { useSession } from "next-auth/client";

import { addMovieToList, removeMovieInList } from "../util/movieSearch";
import InvalidInput from "./modal/InvalidInput";

const PosterCards = ({
  movie,
  i,
  userList,
  setUserList,
  count,
  setCount,
  profile,
  setIsOpen,
}) => {
  //

  const [session, loading] = useSession();

  const favouriteHandler = async (e, idx) => {
    if (session) {
      if (!userList[idx].selected && count < 5) {
        e.target.style.color = "red";
        setCount(count + 1);

        let temp = userList;
        temp[idx].selected = true;
        setUserList(temp);

        const response = await addMovieToList(
          movie.imdbID,
          session.user.email,
          movie.Title,
          movie.Year,
          movie.Poster
        );
      } else if (userList[idx].selected) {

        e.target.style.color = "66ff00";
        setCount(count - 1);

        let temp = userList;
        temp[idx].selected = false;
        setUserList(temp);

        const response = await removeMovieInList(
          movie.imdbID,
          session.user.email
        );
      } else if (count === 5 && setIsOpen) {
        setIsOpen(true);
      } else {
        return;
      }
    }
  };

  return (
    <PosterCtn className="poster-ctn">
      <Link
        replace
        href={`/movie/${movie.imdbID}/${replaceSpaces(movie.Title)}`}
      >
        <img
          className="image-poster"
          src={movie.Poster === "N/A" ? "/images/notfound.jpg" : movie.Poster}
          alt={movie.Title}
        />
      </Link>
      <Link
        replace
        href={`/movie/${movie.imdbID}/${replaceSpaces(movie.Title)}`}
      >
        <h2 className="poster-title">
          ({movie.Year}) {movie.Title}
        </h2>
      </Link>

      {!profile && (
        <div className="favourite-buttons">
          {session && userList ? (
            <FontAwesomeIcon
              className="fa-user"
              icon={faHeart}
              color={movie.selected ? "red" : "#66ff00"}
              style={{ zIndex: "50" }}
              value={i}
              onClick={(e) => {
                favouriteHandler(e, i);
              }}
            />
          ) : (
            <FontAwesomeIcon
              className="fa-user"
              icon={faHeart}
              style={{ color: "grey", zIndex: "50" }}
            />
          )}

          <FontAwesomeIcon className="fa-user fa-user-2" icon={faHeart} />
        </div>
      )}
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
  height: 100%;
  cursor: pointer;

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
