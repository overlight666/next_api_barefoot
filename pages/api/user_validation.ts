import Cookies from 'cookies'
import clientPromise from '@/lib/connection';
const {createHash} = require('node:crypto');

export default async function handler(req: any, res: any) {
  if (req.method == "POST"){
    const session_token = req.body['session_token']
    const client = await clientPromise;
    const db = client.db("Users");
    const users = await db.collection("Sessions").find({"sessionId": session_token}).toArray();
    if (users.length == 0){
        // res.redirect("/login?msg=Incorrect username or password");
        // return;
        return res.json(
            {
              message: "User not exist",
              success: false,
            },
            {
              status: 401,
            }
        );
    }
    const possible_user = users[0]
    const userData = await db.collection("Profiles").find({"_id": possible_user.userId}).toArray();

    if (userData.length == 0){
        return res.json(
            {
              message: "User not existing",
              success: false,
            },
            {
              status: 401,
            }
        );
    } else {
        return res.json(
            {
              user: userData[0],
              success: true,
            },
            {
              status: 200,
            }
        );
    }
  } else {
    return res.json(
        {
          message: "Internal server error",
          success: false,
        },
        {
          status: 500,
        }
    );
    // res.redirect("/")
  }
}