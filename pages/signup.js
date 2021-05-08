import Head from "next/head";
import { useState, useRef } from "react";
import { checkIfMoviesExists } from "../util/movieSearch";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/client";

import React from "react";

const SignupPage = () => {
  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("WE IN THIS");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("SOMETHING WENT WRONG");
    }
  };

  return (
    <div>
      <h1>signup</h1>

      <form onSubmit={submitHandler}>
        <label htmlFor="name">name</label>
        <input ref={nameInput} type="text" id="name" required />

        <label htmlFor="email">Your Email</label>
        <input ref={emailInput} type="email" id="email" required />

        <label htmlFor="password">Your Password</label>
        <input ref={passwordInput} type="password" id="password" required />

        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default SignupPage;
