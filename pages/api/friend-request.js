import { connectToDatabase } from "../../util/db";
import { getSession } from "next-auth/client";

async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    const client = await connectToDatabase();
    const db = client.db().collection("users");

    const userProfile = await db.findOne({ email: session.user.email });

    if (!userProfile) {
      res.status(404).json({ message: "no user" });
      return;
    }

    // send request to friend to add
    // this will add a field or update it, with a new user object to request friendship
    if (req.method === "POST") {
      const friendEmail = req.body.friendEmail;
      const friendProfile = await db.findOne({ email: friendEmail });

      // to make sure there are no duplicates
      const findIdenticalEmail = await db.findOne({
        _id: friendProfile._id,
        "friendsList.email": userProfile.email,
      });

      if (findIdenticalEmail === null) {
        // adding friend request array
        const updatedUserProfileAdd = await db.updateOne(
          {
            _id: friendProfile._id,
          },
          {
            $push: {
              friendsList: {
                status: null,
                email: userProfile.email,
                name: userProfile.name,
              },
            },
          }
        );
      }

      //client.close();
      res.status(201).json({ message: "Friend request sents" });
      return;
    }

    if (req.method === "PATCH") {
      // accept a friend
      const friendToBeAccepted = req.body.friendToBeAccepted;
      const friendProfile = await db.findOne({ email: friendToBeAccepted });

      const updateRequestStatus = await db.updateOne(
        {
          _id: userProfile._id,
          "friendsList.email": friendToBeAccepted,
        },
        {
          $set: {
            "friendsList.$.status": "accepted",
          },
        }
      );

      // make sure there are no duplicates
      const findIdenticalEmail2 = await db.findOne({
        _id: friendProfile._id,
        "friendsList.email": userProfile.email,
      });

      if (findIdenticalEmail2 === null) {
        const addFriendToRequester = await db.updateOne(
          {
            _id: friendProfile._id,
          },
          {
            $push: {
              friendsList: {
                status: "accepted",
                email: userProfile.email,
                name: userProfile.name,
              },
            },
          }
        );
      }

      //client.close();
      res.status(201).json({ message: "Friends list updated" });
      return;
    }

    //client.close();
    res.status(201).json({ message: "Friends list updated" });
  } else {
    // Not Signed in
    res.status(401).json({ message: "Unauthorized Access. Please Login." });
  }
}

export default handler;
