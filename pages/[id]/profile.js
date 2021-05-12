import React, { useState, useRef } from "react";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";
import { addMovieToList, removeMovieInList } from "../../util/movieSearch";
import styled from "styled-components";
import PosterCards from "../../components/PosterCards";
import IntroText from "../../components/IntroText";
import InvalidInput from "../../components/modal/InvalidInput";
import { primeButton } from "../../styles/uiComponents";

const profile = (props) => {
  const [session, loading] = useSession();
  const [movieList, setMovieList] = useState(props.likedMovies);
  const [count, setCount] = useState(props.likedMovies.length);

  const addMovieToListHandler = async (imdbId) => {
    // if (session) {
    //   const { response, data } = await addMovieToList(
    //     imdbId,
    //     session.user.email
    //   );
    //   setMovieList(data);
    // }
    return null;
  };

  const removeMovieInListHandler = async (imdbId) => {
    if (session) {
      const { response, data } = await removeMovieInList(
        imdbId,
        session.user.email
      );
      setMovieList(data);
    }
  };

  console.log("user list in add: ", movieList);

  return (
    <ProfilePage>
      <main className="profile-section">
        <IntroText first="Welcome" span={session.user.name} last="" />

        <TopPicks>
          <h3> Your Current Top Picks: </h3>
          <ul className="regular-ul remove-extra">
            {movieList &&
              movieList.map((movie, i) => (
                <li key={movie.imdbID}>
                  <PosterCards
                    movie={movie}
                    i={i}
                    userList={movieList}
                    setUserList={setMovieList}
                    // addMovieToListHandler={addMovieToListHandler}
                    // removeMovieFromListHandler={removeMovieInListHandler}
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
              ))}
          </ul>
        </TopPicks>
      </main>
    </ProfilePage>
  );
};

const ProfilePage = styled.div`
  padding-top: 6rem;
  min-height: 100vh;
  background: var(--main-bg-color);
  color: white;

  .search-form-ctn {
    padding: 2rem 0rem;

    form {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;

      input {
        margin: 0rem;
        margin-right: 0.5rem;
      }
      button {
        margin: 1rem 0rem;
      }
    }
  }

  .intro-text {
    text-align: left;
    padding: 0rem;
  }

  .profile-section {
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
`;

const TopPicks = styled.div`
  padding: 2rem 0rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .regular-ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 5.5rem;
    padding: 2rem 0rem;

    li {
      position: relative;
    }

    .poster-ctn {
      width: 20rem;

      img {
        height: 300px;
      }

      @media (max-width: 400px) {
        width: 15rem;
      }
    }
  }

  .singular {
    display: flex;
    flex-wrap: wrap;
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

  ///console.log(session);

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
  client.close();
  ///console.log(userProfile);

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
