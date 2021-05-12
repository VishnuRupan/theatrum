import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../util/auth";
import { connectToDatabase } from "../../../util/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const db = client.db().collection("users");

        const user = await db.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error("no user found");
        }

     

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("wrong password");
        }

        client.close();

        return { email: user.email, name: user.name, image: user._id };
      },
    }),
  ],
});
