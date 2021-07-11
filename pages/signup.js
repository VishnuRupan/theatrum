import Head from "next/head";
import { useState, useRef } from "react";
import { checkIfMoviesExists } from "../util/movieSearch";
import axios from "axios";
import { useSession, signIn, signOut, getSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

import { formBox, marginContainer, primeButton } from "../styles/uiComponents";
import NextHead from "../components/layout/NextHead";

const SignupPage = () => {
  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const submitHandler = async (event) => {
    setSuccess(null);
    setError(true);
    setIsLoading(true);

    event.preventDefault();

    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 406) {
        setError(
          "Invalid inputs. Password should be 8 characters long, with atleast 1 uppercase, lowercase, number, and symbol"
        );
      } else if (response.status === 422) {
        setError("User already exists");
      } else {
        setError(true);
      }
    } else {
      setError(null);
      setSuccess("You've made an account!");
      router.push(`/login`);
    }

    setIsLoading(false);
  };

  return (
    <div className="main-body center-flex">
      <NextHead title="Signup" desc="Theatrum signup page." />

      <FormContainer className="center-flex">
        <FormBox>
          <div className="form-header">
            <h1>Get Started</h1>
          </div>

          {error && (
            <div className="error-message">
              <p> {error}</p>
            </div>
          )}

          {success && (
            <div className="success-message">
              <p> {success}</p>
            </div>
          )}

          <form onSubmit={submitHandler} className="center-flex">
            <div className="input-ctn">
              <label htmlFor="name">Your Name</label>
              <input
                ref={nameInput}
                type="text"
                id="name"
                required
                placeholder="Name"
              />
            </div>

            <div className="input-ctn">
              <label htmlFor="email">Your Email</label>
              <input
                ref={emailInput}
                type="email"
                id="email"
                required
                placeholder="Email Address"
              />
            </div>

            <div className="input-ctn">
              <label htmlFor="password">Your Password</label>
              <input
                ref={passwordInput}
                type="password"
                id="password"
                required
                placeholder="Password"
              />
            </div>

            <h4>
              Have an account? <Link href="/login">Login</Link>
            </h4>

            <SubmitButton primary type="submit">
              Submit
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

const FormBox = styled(formBox)`
  .success-message {
    padding: 0rem 2rem;
    color: #00c400;
    padding-top: 1rem;
    margin-bottom: -1rem;
  }
`;

const SubmitButton = styled(primeButton)`
  margin: 1rem 0rem;
`;

export default SignupPage;
