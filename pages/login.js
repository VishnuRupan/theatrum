import Head from "next/head";
import { useState, useRef } from "react";
import { checkIfMoviesExists } from "../util/movieSearch";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/client";

const UserLogin = (props) => {
  const loginEmail = useRef();
  const loginPassword = useRef();

  const loginHandler = async (e) => {
    e.preventDefault();

    const email = loginEmail.current.value;
    const password = loginPassword.current.value;

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    console.log("This is result", result);
  };

  return (
    <div>
      <h2>login page</h2>
      <form onSubmit={loginHandler}>
        <label htmlFor="loginemail">Your Email</label>
        <input ref={loginEmail} type="email" id="loginemail" required />

        <label htmlFor="loginpassword">Your Password</label>
        <input
          ref={loginPassword}
          type="password"
          id="loginpassword"
          required
        />

        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default UserLogin;
