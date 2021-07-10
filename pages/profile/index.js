import React, { useState, useRef, useEffect } from "react";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";
import { removeMovieInList } from "../../util/movieSearch";
import styled from "styled-components";
import PosterCards from "../../components/PosterCards";
import IntroText from "../../components/IntroText";
import InvalidInput from "../../components/modal/InvalidInput";
import {
  marginContainer,
  primeButton,
  unorderedListContainer,
} from "../../styles/uiComponents";

import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";
import SearchForm from "../../components/SearchForm";
import NextHead from "../../components/layout/NextHead";
import CopyClipboard from "../../components/CopyClipboard";

const profile = (props) => {
  const [session, loading] = useSession();
  const [movieList, setMovieList] = useState(props.likedMovies);
  const [count, setCount] = useState(props.likedMovies.length);
  const [badgeOpen, setBadgeOpen] = useState(false);

  // confirm delete state
  const [confirm, setConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(null);
  const [imdb, setImdb] = useState("");

  let stringMovieList = `${session.user.name}'s Movie List: `;

  if (movieList.length > 0) {
    movieList.forEach((movie, idx) => {
      if (movieList.length - 1 === idx) {
        stringMovieList =
          `${stringMovieList}` + `${movie.Title} (${movie.Year})`;
      } else {
        stringMovieList =
          `${stringMovieList}` + `${movie.Title} (${movie.Year}), `;
      }
    });
  }

  const removeMovieInListHandler = async (imdbId) => {
    setImdb(imdbId);
    setIsOpen(true);
  };

  useEffect(async () => {
    if (session && !isOpen && confirm) {
      const { response, data } = await removeMovieInList(
        imdb,
        session.user.email
      );
      setMovieList(data);
      setConfirm(false);
    }

    if (movieList.length === 5) {
      setBadgeOpen(true);
    } else {
      setBadgeOpen(false);
    }
  }, [imdb, isOpen, confirm]);

  return (
    <ProfilePage className="main-body">
      <NextHead
        title={`${session.user.name}'s Profile`}
        year=""
        desc={`${session.user.name}'s profile page. Create a list of your top 5 movies to share with your friends.`}
      />

      <MainSection>
        <IntroText first="Welcome" span={session.user.name} last="" />

        <TopPicks>
          <h3> Your Current Top Picks: </h3>
          {movieList.length > 0 && <CopyClipboard copyText={stringMovieList} />}
          {badgeOpen && (
            <Alert status="success" variant="solid" className="success-badge">
              <AlertIcon />
              You've favourited 5 movies!
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setBadgeOpen(false)}
              />
            </Alert>
          )}

          <ul className="search-results">
            {props.likedMovies.length === 0 ? (
              <SearchCtn>
                <SearchForm />
              </SearchCtn>
            ) : (
              movieList.map((movie, i) => (
                <li key={movie.imdbID}>
                  <PosterCards
                    movie={movie}
                    i={i}
                    userList={movieList}
                    setUserList={setMovieList}
                    count={count}
                    setCount={setCount}
                    profile={true}
                  />

                  <RemoveButton
                    onClick={() => removeMovieInListHandler(movie.imdbID)}
                  >
                    Remove from list
                  </RemoveButton>
                </li>
              ))
            )}
            {isOpen && (
              <InvalidInput
                warning="Confirm"
                error="Are you sure?"
                setIsOpen={setIsOpen}
                setError={setConfirm}
              />
            )}
          </ul>
        </TopPicks>
      </MainSection>
    </ProfilePage>
  );
};

const ProfilePage = styled.div`
  .intro-text {
    text-align: left;
    padding: 0rem;
  }

  .copied-text-icon {
    padding-top: 1rem;
  }
`;

const SearchCtn = styled.div`
  .search-form-ctn,
  .search-form {
    justify-content: flex-start;

    input {
      margin-left: 0rem;
    }
  }
`;

const MainSection = styled(marginContainer)``;

const TopPicks = styled(unorderedListContainer)`
  padding: 2rem 0rem;

  .success-badge {
    margin-top: 1rem;
    width: 20rem;

    @media (max-width: 400px) {
      width: 15rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .search-results {
    //row-gap: 5.5rem;
    display: flex;
    flex-wrap: wrap;

    li {
      position: relative;

      margin: 2rem 0rem;
      margin-right: 1.5rem;

      width: 20rem;

      img {
        height: 400px;
      }

      @media (max-width: 400px) {
        width: 15rem;
      }
    }
  }
`;

const RemoveButton = styled(primeButton)`
  width: 20rem;
  margin: 0.5rem 0rem;
  border: white;
  position: absolute;
  left: 0;
  background: #8e0000;
  color: white;
  border: 1px solid #8e0000;

  &:hover {
    background: #b30000;
    color: white;
  }

  @media (max-width: 400px) {
    width: 15rem;
  }
`;

//////////////////////////////////

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const db = client.db().collection("users");

  const userProfile = await db.findOne({ email: session.user.email });

  const nominationLimit = userProfile.likedMovies.length === 5 ? true : false;
  //client.close();

  //user profile
  return {
    props: {
      likedMovies: userProfile.likedMovies,
      limit: nominationLimit,
    },
  };
}

export default profile;
