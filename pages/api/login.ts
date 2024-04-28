import Cookies from 'cookies'
import clientPromise from '@/lib/connection';
const {createHash} = require('node:crypto');

export default async function handler(req: any, res: any) {
  if (req.method == "POST"){
    const username = req.body['username']
    const guess = req.body['password']
    const client = await clientPromise;
    const db = client.db("Users");
    const users = await db.collection("Profiles").find({"Username": username}).toArray();
    if (users.length == 0){
        // res.redirect("/login?msg=Incorrect username or password");
        // return;
        return res.json(
            {
              message: "Incorrect username or password",
              success: false,
            },
            {
              status: 401,
            }
        );
    }
    const user = users[0]
    const guess_hash = createHash('sha256').update(guess).digest('hex');
    if (guess_hash == user.Password){
        const cookies = new Cookies(req, res)
        cookies.set('username', username)
        return res.json(
            {
              message: "User not exist",
              success: true,
              user: user
            },
            {
              status: 200,
            }
        );
    } else {
        return res.json(
            {
              message: "Incorrect username or password",
              success: false,
            },
            {
              status: 401,
            }
        );
        // res.redirect("/login?msg=Incorrect username or password")
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