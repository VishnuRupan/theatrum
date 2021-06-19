import styled from "styled-components";
import SearchForm from "../../components/SearchForm";
import PosterCards from "../../components/PosterCards";
import IntroText from "../../components/IntroText";
import {
  unorderedListContainer,
  marginContainer,
} from "../../styles/uiComponents";
import NextHead from "../../components/layout/NextHead";

const Search = () => {
  return (
    <Container className="main-body">
      <NextHead title="Search Movies" desc="Search movies by title or year" />
      <MainSection>
        <IntroText first="SEARCH FOR" span="ANY" last="MOVIE" />

        <SearchForm />
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

export default Search;
