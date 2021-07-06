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

export const unorderedListContainer = styled.div`
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 1.5rem;
    padding: 2rem 0rem;

    @media (max-width: 400px) {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }
`;

export const marginContainer = styled.div`
  margin: var(--main-margin);

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
`;

export const formBox = styled.div`
  padding-top: 0rem;
  width: 18rem;
  background: #272727;
  color: white;
  border-radius: 3px;
  box-shadow: 8px 8px 10px 0 rgba(0, 0, 0, 0.4);

  .error-message {
    padding: 0rem 2rem;
    padding-top: 1rem;
    margin-bottom: -1rem;
    color: red;
  }

  .form-header {
    background: var(--light-pink);
    color: var(--main-bg-color);
    padding: 1rem 2rem;
    font-weight: 700;
    font-size: 1.7rem;
    text-align: center;
  }

  .input-ctn {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding: 0.5rem 0rem;
  }

  form {
    padding: 1rem 2rem;
  }

  label,
  h4,
  p {
    font-weight: 600;
    font-size: 0.7rem;
    padding: 0.2rem 0rem;
  }
  a {
    color: #24a0ed;
    text-decoration: underline;

    &:hover {
      color: #218ed1;
    }
  }

  input {
    width: 100%;
    margin: 0.5rem 0rem;
    padding: 0.3rem 0.4rem;
    border-radius: 2px;
    color: black;
    box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.4);
  }
`;
