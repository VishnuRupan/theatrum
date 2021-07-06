import { connectToDatabase } from "../../util/db";
import { getSession } from "next-auth/client";

async function handler(req, res) {
  console.log("backend");

  const session = await getSession({ req });

  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    if (!userProfile) {
      res.status(404).json({ message: "no user found" });
      return;
    }

    if (req.method === "PATCH") {
      const friendProfile = await db.findOne({ email: req.body.friendEmail });

      const similarMoviesArray = [];

      for (let i = 0; i < userProfile.likedMovies.length; i++) {
        friendProfile.likedMovies.forEach((movie) => {
          if (movie.imdbID === userProfile.likedMovies[i].imdbID) {
            similarMoviesArray.push(movie);
          }
        });
      }

      client.close();
      res.status(201).json(similarMoviesArray);
      return;
    }

    client.close();
    res.status(201).json({ message: "Checked for similar movies" });
  } else {
    // Not Signed in
    res.status(401).json({ message: "Unauthorized Access. Please Login." });
  }
}

export default handler;
