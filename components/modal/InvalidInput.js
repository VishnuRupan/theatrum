import { useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup } from "@chakra-ui/react";

const InvalidInput = (props) => {
  return (
    <InvalidInputContainer>
      <Alert>
        <div className="container center-flex">
          <div className="close-btn">
            {props.setIsOpen && (
              <FontAwesomeIcon
                className="fa-user"
                icon={faTimes}
                size="lg"
                onClick={() => props.setIsOpen(false)}
              />
            )}
          </div>
          <h2>
            {" "}
            <span className="error">{props.warning}:</span> {props.error}
          </h2>
        </div>

        {props.setError && (
          <div className="button-group">
            <Button
              onClick={() => {
                props.setError(true);
                props.setIsOpen(false);
              }}
              className="yes-btn"
              colorScheme="green"
            >
              Yes
            </Button>

            <Button
              className="chakra-btn"
              onClick={() => {
                props.setError(false);
                props.setIsOpen(false);
              }}
              className="no-btn"
              colorScheme="red"
            >
              No
            </Button>
          </div>
        )}
      </Alert>
    </InvalidInputContainer>
  );
};

const InvalidInputContainer = styled.div`
  position: absolute;
  background: rgba(27, 27, 27, 0.85);
  min-height: 100%;
  min-width: 100vw;
  top: 0;
  left: 0;
  z-index: 100;
`;

const Alert = styled.div`
  position: fixed;
  z-index: 999;
  color: black;
  background: white;
  top: 0;
  left: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18rem;
  height: 10rem;
  border-radius: 3px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  @media (max-width: 360px) {
    width: 95%;
  }
  .container {
    position: relative;
    height: 10rem;
  }

  .error {
    font-weight: bold;
  }

  .button-group {
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      width: 100%;
      border-radius: 0px;
    }

    .yes-btn {
      border-bottom-left-radius: 3px;
    }

    .no-btn {
      border-bottom-right-radius: 3px;
    }
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
