import { useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const InvalidInput = (props) => {
  return (
    <InvalidInputContainer>
      <Alert>
        <div className="container center-flex">
          <div className="close-btn">
            <FontAwesomeIcon
              className="fa-user"
              icon={faTimes}
              size="lg"
              onClick={() => props.setError(null)}
            />
          </div>
          <h2>
            {" "}
            <span className="error">Error:</span> {props.error}
          </h2>
        </div>
      </Alert>
    </InvalidInputContainer>
  );
};

const InvalidInputContainer = styled.div`
  position: absolute;
  background: rgba(27, 27, 27, 0.8);
  min-height: 100vh;
  min-width: 100vw;
  top: 0;
  left: 0;
`;

const Alert = styled.div`
  position: absolute;
  z-index: 999;
  color: black;
  background: white;
  top: 0;
  left: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18rem;
  height: 8rem;
  border-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  padding: 0.5rem;

  .container {
    position: relative;
    height: 8rem;
  }

  .error {
    font-weight: bold;
  }

  h2 {
    text-align: center;
  }

  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    right: 5%;
    top: 5%;
    cursor: pointer;
  }
`;

export default InvalidInput;
