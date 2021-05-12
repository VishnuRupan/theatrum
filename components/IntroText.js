import styled from "styled-components";

const IntroText = (props) => {
  return (
    <Text className="intro-text">
      {props.first} <span className="h1-name-span"> {props.span}</span>{" "}
      {props.last}
    </Text>
  );
};

const Text = styled.h1`
  font-size: 3rem;
  text-align: left;
  font-weight: 700;
  padding: 1rem;
  text-shadow: 3px 3px 0px rgba(255, 205, 205, 0.5);
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  .h1-name-span {
    color: var(--light-pink);
  }
`;

export default IntroText;
