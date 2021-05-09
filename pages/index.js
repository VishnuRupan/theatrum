import Head from "next/head";
import { useState, useRef } from "react";
import { checkIfMoviesExists } from "../util/movieSearch";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/client";

export default function Home(props) {
  const [title, setTitle] = useState("");

  const [session, loading] = useSession();

  return (
    <div>
      <h1 className="h1-head">Search for movies </h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button>Search</button>

      {session && <h1> Hello {session.user.name} </h1>}
    </div>
  );
}
