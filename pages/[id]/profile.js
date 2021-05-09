import React, { useState } from "react";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";
import { addMovieToList, removeMovieInList } from "../../util/movieSearch";

const profile = (props) => {

  const [session, loading] = useSession();
  const [movieList, setMovieList] = useState(props.likedMovies);

  const addMovieToListHandler = async (imdbId) => {
    if (session) {
      const { response, data } = await addMovieToList(
        imdbId,
        session.user.email
      );

      setMovieList(data);
    }
  };

  const removeMovieInListHandler = async (imdbId) => {
    if (session) {
      const { response, data } = await removeMovieInList(
        imdbId,
        session.user.email
      );

      setMovieList(data);
    }
  };
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      {movieList.length === 5 && <h1> YOUVE REACHCHED THE LIMIT SON</h1>}
      {movieList.map((e) => (
        <div key={e.imdbID}>
          <p>
            {e.Title} - {e.imdbID}
          </p>

          <button onClick={() => addMovieToListHandler(e.imdbID)}>Add</button>
          <button onClick={() => removeMovieInListHandler(e.imdbID)}>
            Remove
          </button>

          <br />
          <hr />
        </div>
      ))}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  ///console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const db = client.db().collection("users");

  const userProfile = await db.findOne({ email: session.user.email });

  const nominationLimit = userProfile.likedMovies.length === 5 ? true : false;
  client.close();
  ///console.log(userProfile);

  return {
    props: {
      session: session,
      likedMovies: userProfile.likedMovies,
      email: userProfile.email,
      limit: nominationLimit,
    },
  };
}

export default profile;
