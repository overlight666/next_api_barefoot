import Cookies from 'cookies'
import clientPromise from '@/lib/connection';
const {createHash} = require('node:crypto');

export default async function handler(req: any, res: any) {
  if (req.method == "POST"){
    const mobile_number = req.body['mobile_number']
    const guess = req.body['password']
    const client = await clientPromise;
    const db = client.db("Users");
    const users = await db.collection("Profiles").find({"mobile_number": mobile_number}).toArray();
    if (users.length === 0){
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
    if (guess_hash === user.password){
        // const cookies = new Cookies(req, res)
        // cookies.set('username', username)
        try {
          const session_exist = await db.collection("Sessions");
          const query = { userId:  user._id };
          await session_exist.deleteOne(query);
        } catch (error) {}

        const sessionId = createHash("sha256").update(`${user.mobile_number}${new Date()}`).digest("hex");

        try {
         
          await db.collection("Sessions").insertOne({
            sessionId,
            userId: user._id,
            createdAt: new Date(),
          })
        } catch (error) {}
       

        return res.json(
            {
              success: true,
              user: {
                sessionId, ...user,
              }
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