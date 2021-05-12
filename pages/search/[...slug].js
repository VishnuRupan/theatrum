import { useState, useEffect } from "react";
import { searchForMovies } from "../../util/movieSearch";
import {
  getPropsMovieData,
  addSelectedFromUser,
} from "../../util/componentHelper";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import SearchForm from "../../components/SearchForm";
import { connectToDatabase } from "../../util/db";
import PosterCards from "../../components/PosterCards";
import IntroText from "../../components/IntroText";
import {
  unorderedListContainer,
  marginContainer,
} from "../../styles/uiComponents";

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
    <Container className="main-body">
      <MainSection>
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
      </MainSection>
    </Container>
  );
};

const Container = styled(unorderedListContainer)``;

const MainSection = styled(marginContainer)``;

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
