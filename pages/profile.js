import React, { useState, useRef, useEffect } from "react";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../util/db";
import { removeMovieInList } from "../util/movieSearch";
import styled from "styled-components";
import PosterCards from "../components/PosterCards";
import IntroText from "../components/IntroText";
import InvalidInput from "../components/modal/InvalidInput";
import {
  marginContainer,
  primeButton,
  unorderedListContainer,
} from "../styles/uiComponents";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import SearchForm from "../components/SearchForm";

const profile = (props) => {
  const [session, loading] = useSession();
  const [movieList, setMovieList] = useState(props.likedMovies);
  const [count, setCount] = useState(props.likedMovies.length);
  const [badgeOpen, setBadgeOpen] = useState(false);

  // confirm delete state
  const [confirm, setConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(null);
  const [imdb, setImdb] = useState("");

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
      <MainSection>
        <IntroText first="Welcome" span={session.user.name} last="" />

        <TopPicks>
          <h3> Your Current Top Picks: </h3>
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
    row-gap: 5.5rem;

    li {
      position: relative;
      width: 20rem;

      img {
        height: 300px;
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

  console.log("session in getServer - profile: ", session);

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

  console.log("user-profile gSSp profile -", userProfile);

  const nominationLimit = userProfile.likedMovies.length === 5 ? true : false;
  client.close();

  return {
    props: {
      session: session,
      likedMovies: userProfile.likedMovies,
      email: userProfile.email,
      limit: nominationLimit,
    },
  };
}

export default profile;