import { connectToDatabase } from "../../../util/db";
import { getSession } from "next-auth/client";
import { isMovieAlreadyInList } from "../../../util/movieSearch";

async function handler(req, res) {
  const session = await getSession({ req });

  const email = req.body.email;
  const imdb = req.body.imdbID;

  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    if (!userProfile) {
      res.status(404).json({ message: "no user" });
      return;
    }

    if (req.method === "PATCH") {
      console.log(imdb);

      if (
        (await isMovieAlreadyInList(userProfile, imdb)) ||
        userProfile.likedMovies.length >= 5
      ) {
        res.status(422).json({
          message: `Not valid.`,
        });
        client.close();
        return;
      }

      userProfile.likedMovies.push({ imdbID: imdb });
      const updatedUserProfileAdd = await db.updateOne(
        {
          _id: userProfile._id,
        },
        { $set: { likedMovies: userProfile.likedMovies } }
      );

      client.close();
      res.status(201).json(userProfile.likedMovies);
      return;
    }

    /// delete in list
    if (req.method === "DELETE") {
      console.log(imdb);

      if (!(await isMovieAlreadyInList(userProfile, imdb))) {
        res
          .status(422)
          .json({ message: `This movie has not been favourited.` });
        client.close();
        return;
      }

      const removedLikedList = userProfile.likedMovies.filter(
        (movie) => movie.imdbID != imdb
      );

      const updatedUserProfileDelete = await db.updateOne(
        {
          _id: userProfile._id,
        },
        { $set: { likedMovies: removedLikedList } }
      );

      client.close();
      res.status(201).json(removedLikedList);
      return;
    }

    client.close();
    res.status(201).json({ message: "Liked movies have been updated." });
  } else {
    // Not Signed in

    res.status(401).json({ message: "Unauthorized Access. Please Login." });
  }
}

export default handler;
