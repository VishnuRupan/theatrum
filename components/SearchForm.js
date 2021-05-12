import React from "react";
import { useState, useRef } from "react";
import styled from "styled-components";
import { primeButton } from "../styles/uiComponents";
import { useRouter } from "next/router";
import InvalidInput from "./modal/InvalidInput";
import { set } from "mongoose";

const SearchForm = () => {
  const [title, setTitle] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [isOpen, setIsOpen] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const searchMovieHandler = (e) => {
    e.preventDefault();

    if (!title || title === "") {
      setError("Please enter a title.");
      setIsOpen(true);
      return;
    } else {
      setError(null);
    }

    router.push(`/search/${title}/${movieYear}`);
  };
  return (
    <FormContainer className="search-form-ctn">
      <form onSubmit={searchMovieHandler} className="search-form center-flex">
        <div className="form-ctn center-flex">
          <input
            className="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Movie Title"
          />

          <input
            className="year-input"
            type="text"
            value={movieYear}
            onChange={(e) => setMovieYear(e.target.value)}
            placeholder="Year"
          />
        </div>

        <SearchButton type="submit" primary>
          Search
        </SearchButton>
      </form>

      {isOpen && <InvalidInput warning="Error" setIsOpen={setIsOpen} error={error} />}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  .search-form {
    flex-direction: row;
  }

  .form-ctn {
    flex-direction: row;
  }

  input {
    margin: 2rem 0.5rem;
    color: var(--main-bg-color);
    font-size: 1.2rem;
    padding: 0.3rem 0.7rem;
    border: none;
    border-radius: 2px;
    font-weight: 500;
  }

  .title-input {
    width: 20rem;
  }

  .year-input {
    width: 4rem;
  }

  /* mobile media queries*/

  @media (max-width: 768px) {
    .title-input {
      width: 10rem;
    }

    input {
      font-size: 0.9rem;
      margin: 0.5rem;
    }

    .search-form {
      flex-direction: column;
    }
  }
`;

const SearchButton = styled(primeButton)`
  margin: 1rem;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 1rem 0rem;
  }
`;

export default SearchForm;
