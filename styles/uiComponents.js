import styled from "styled-components";

export const primeButton = styled.button`
  color: ${(props) => (props.primary ? "white" : "rgb(27, 27, 27)")};
  font-size: 1rem;
  padding: 0.3rem 1.5rem;
  border-radius: 2px;
  font-weight: 500;
  border: ${(props) =>
    props.primary ? "1px solid white" : "1px solid rgb(27, 27, 27)"};
  background: ${(props) => (props.primary ? "rgb(27, 27, 27)" : "white")};
  transition: all 0.7s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: ${(props) => (!props.primary ? "rgb(27, 27, 27)" : "")};
    color: ${(props) =>
      !props.primary ? "rgb(255, 205, 205)" : "rgb(255, 205, 205)"};

    border: ${(props) =>
      !props.primary ? "1px solid white" : "1px solid rgb(255, 205, 205)"};
  }
`;
