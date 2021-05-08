import React from "react";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";

const profile = (props) => {
  console.log(props.likedMovies);
  return <div>im a profile</div>;
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

  client.close();
  ///console.log(userProfile);

  return {
    props: {
      session: session,
      likedMovies: userProfile.likedMovies,
      email: userProfile.email,
    },
  };
}

export default profile;
