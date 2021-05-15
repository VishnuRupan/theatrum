import React from "react";
import { marginContainer, primeButton } from "../../styles/uiComponents";
import styled from "styled-components";
import SearchForm from "../../components/SearchForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="main-body">
      <MainBody>
        <SearchForm />
        <h2> Sorry, this movie doesn't have any details. </h2>
        <GoBack
          onClick={() => {
            router.back();
          }}
          primary
        >
          <FontAwesomeIcon
            className="fa-close"
            icon={faLongArrowAltLeft}
            size="1x"
          />
          Go Back
        </GoBack>
      </MainBody>
    </div>
  );
};

const MainBody = styled(marginContainer)`
  h2 {
    padding: 2rem 0rem;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .fa-close {
    margin-right: 1rem;
  }
`;

const GoBack = styled(primeButton)``;

export default NotFound;
