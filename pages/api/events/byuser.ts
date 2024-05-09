
import clientPromise from '@/lib/connection';
export default async function handler(req: any, res: any) {
    if (req.method == "GET") {
        const user_id = req.query["id"];
        const client = await clientPromise;
        const db = client.db("Events");
        const events = await db.collection("Profiles").find({"user_id": user_id}).toArray();
        res.json(
            {
              data: "Internal Server Error",
              success: true,
            },
            {
              status: 200,
            }
          );
    } else {
        // res.redirect("/");
        res.json(
            {
              message: "Internal Server Error",
              success: false,
            },
            {
              status: 500,
            }
          );
      }
}