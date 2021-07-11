import { useState, useRef } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/client";
import styled from "styled-components";
import { formBox, marginContainer, primeButton } from "../styles/uiComponents";
import Link from "next/link";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";
import NextHead from "../components/layout/NextHead";

const UserLogin = (props) => {
  const loginEmail = useRef();
  const loginPassword = useRef();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = loginEmail.current.value;
    const password = loginPassword.current.value;

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    setError(result.error);
    const session = await getSession();

    try {
      if (session) {
        router.push(`/profile`);
      }
    } catch (error) {}

    setIsLoading(false);
  };

  return (
    <div className="main-body center-flex">
      <NextHead title="Login" desc="Theatrum login page." />
      <FormContainer className="center-flex">
        <FormBox>
          <div className="form-header">
            <h1>Welcome Back!</h1>
          </div>

          {error && (
            <div className="error-message">
              <p> {error}</p>
            </div>
          )}
          <form onSubmit={loginHandler} className="center-flex">
            <div className="email-ctn input-ctn">
              <label htmlFor="loginemail">Your Email</label>
              <input
                ref={loginEmail}
                type="email"
                id="loginemail"
                required
                placeholder="Email Address"
              />
            </div>

            <div className="password-ctn input-ctn">
              <label htmlFor="loginpassword">Your Password</label>
              <input
                ref={loginPassword}
                type="password"
                id="loginpassword"
                required
                placeholder="Password"
              />
            </div>

            <h4>
              Don't have an account? <Link href="/signup">Sign Up</Link>
            </h4>

            <SubmitButton primary type="submit">
              Login
            </SubmitButton>

            {isLoading && (
              <div className="spinner">
                <Spinner thickness="3px" speed="0.65s" />
              </div>
            )}
          </form>
        </FormBox>
      </FormContainer>
    </div>
  );
};

const FormContainer = styled(marginContainer)`
  height: 100%;

  .spinner {
  }
`;

const FormBox = styled(formBox)``;

const SubmitButton = styled(primeButton)`
  margin: 1rem 0rem;
`;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default UserLogin;
