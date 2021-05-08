import { connectToDatabase } from "../../../util/db";
import { getSession } from "next-auth/client";

async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "PUT") {
      console.log("bruv wagwan");
    }
    // Signed in
    console.log("Theres a session");
  } else {
    // Not Signed in

    console.log("you goofed trying to access this");
    res.status(401);
  }
}

export default handler;
