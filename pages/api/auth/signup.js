import { hashPassword } from "../../../util/auth";
import { connectToDatabase } from "../../../util/db";

import { isValidInput, sanitizeFields } from "../../../util/inputFields";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      //get data from body
      const data = req.body;
      const { name, email, password } = data;

      //check if body data is valid
      if (isValidInput(name, email, password)) {
        res.status(422).json({ message: "Invalid input" });

        return;
      }

      //sanitize everything
      const {
        sanitizedName,
        sanitizedEmail,
        sanitizedPassword,
      } = sanitizeFields(name, email, password);

      //connect to database
      const client = await connectToDatabase();
      const db = client.db().collection("users");

      //hash password
      const hashedPassword = await hashPassword(sanitizedPassword);

      // check for existing user
      const existingUser = await db.findOne({ email: sanitizedEmail });

      if (existingUser) {
        res.status(422).json({ message: "User exists" });
        client.close();
        return;
      }

      // create user model
      const UserModel = {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        likedMovies: [{ imdbID: "" }],
      };

      try {
        const result = await db.insertOne(UserModel);
      } catch (error) {
        throw error;
      }

      res.status(201).json({ message: "Created user" });
      client.close();

      //finish
    } catch (error) {
     
      res.status(500);
      client.close();
    }
  }
}

export default handler;
