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
import InvalidInput from "../../components/modal/InvalidInput";

const MovieSearch = (props) => {
  const result = getPropsMovieData(props);

  const updatedResult = addSelectedFromUser(result, props.userList);

  const userListLen = () => {
    return props.userList ? props.userList.length : 0;
  };

  const [userList, setUserList] = useState(updatedResult);
  const [count, setCount] = useState(userListLen());
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    setUserList(updatedResult);
  }, [props]);

  return (
    <Container className="main-body">
      <MainSection>
        <IntroText first="SEARCH FOR" span="ANY" last="MOVIE" />

        <SearchForm />

        <ul className="remove-extra center-flex">
          {!props.error ? (
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
                  setIsOpen={setIsOpen}
                />
              </li>
            ))
          ) : (
            <h2 className="no-movie-found">
              Could not find results for "{props.searchQuery}"
            </h2>
          )}

          {isOpen && (
            <InvalidInput
              warning="Error"
              error="Max number of likes reached!"
              setIsOpen={setIsOpen}
            />
          )}
        </ul>
      </MainSection>
    </Container>
  );
};

const Container = styled(unorderedListContainer)``;

const MainSection = styled(marginContainer)`
  .no-movie-found {
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });
  let userList = null;

  const { params } = ctx;
  const { slug } = params;
  let error = false;
  let data = { Response: "False" };
  let movieData = [];

  // get movies from ctx and adding selected field
  try {
    data = await searchForMovies(slug[0], slug[1]);
    movieData = data.Search.map((v) => ({ ...v, selected: false }));
  } catch (error) {
  }

  // get user profile
  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    userList = userProfile.likedMovies;
    client.close();
  }

  if (data.Response === "False") {
    error = true;
  }

  return {
    props: {
      data: movieData,
      error: error,
      userList: userList,
      searchQuery: slug[0],
    },
  };
}

export default MovieSearch;
