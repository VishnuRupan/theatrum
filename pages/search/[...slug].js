import { useState, useEffect } from "react";
import {
  addMovieToList,
  removeMovieInList,
  searchForMovies,
} from "../../util/movieSearch";
import {
  getPropsMovieData,
  addSelectedFromUser,
  countSelected,
} from "../../util/componentHelper";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import SearchForm from "../../components/SearchForm";
import { connectToDatabase } from "../../util/db";
import PosterCards from "../../components/PosterCards";
import IntroText from "../../components/IntroText";

const MovieSearch = (props) => {
  const result = getPropsMovieData(props);
  const updatedResult = addSelectedFromUser(
    result.map((v) => ({ ...v, selected: false })),
    props.userList
  );

  const userListLen = () => {
    return props.userList ? props.userList.length : 0;
  };

  const [userList, setUserList] = useState(updatedResult);
  const [count, setCount] = useState(userListLen());

  return (
    <Container>
      <main className="search-results">
        <IntroText first="SEARCH FOR" span="ANY" last="MOVIE" />

        <SearchForm />

        <ul className="remove-extra center-flex">
          {updatedResult[0].Response != "False" ? (
            updatedResult.map((movie, i) => (
              <li key={movie.imdbID}>
                <PosterCards
                  userList={userList}
                  setUserList={setUserList}
                  movie={movie}
                  i={i}
                  setCount={setCount}
                  count={count}
                  profile={false}
                />
              </li>
            ))
          ) : (
            <h1 style={{ color: "red" }}> umm... try again?</h1>
          )}
        </ul>
      </main>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 6rem;
  min-height: 100vh;
  background: var(--main-bg-color);

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
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 1.5rem;
    padding: 2rem 0rem;

    @media (max-width: 400px) {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
