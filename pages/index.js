import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import SearchForm from "../components/SearchForm";

export default function Home(props) {
  const [title, setTitle] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  return (
    <HomePage className="center-flex">
      <div className="home-page center-flex">
        <h1 className="h1-head">
          {" "}
          PICK <span className="ulti-h1"> YOUR</span> MOVIES{" "}
        </h1>

        <h3 className="h3-head">
          {" "}
          Theatrum makes finding your favourite movies easier{" "}
        </h3>

        <SearchForm />
      </div>
    </HomePage>
  );
}

const HomePage = styled.main`
  min-height: 100vh;
  background: url("/images/main-bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  overflow-x: hidden;

  .home-page {
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

  .h1-head {
    font-size: 5rem;
    text-align: center;
    font-weight: 700;
    padding: 2rem 3rem;
    text-shadow: 5px 5px 0px rgba(255, 205, 205, 0.5);

    .ulti-h1 {
      color: var(--light-pink);
    }
  }

  h3 {
    font-size: 1.3rem;
    padding: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    text-shadow: 2px 2px 0px rgba(255, 205, 205, 0.5);
    color: white;
    letter-spacing: 0.25rem;
    text-align: center;
  }

  /* mobile media queries*/

  @media (max-width: 768px) {
    .h1-head {
      font-size: 3rem;
      padding: 0rem 1rem;
    }

    .h3-head {
      font-size: 0.8rem;
      padding: 2rem 1rem;
    }
  }
`;
