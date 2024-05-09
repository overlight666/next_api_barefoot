
import clientPromise from '@/lib/connection';
const {MyImage, EventLocation} = require('@/models/models');
export default async function handler(req: any, res: any) {
    if (req.method == "GET") {
        const client = await clientPromise;
        const db = client.db("Events");
        const events = await db.collection("Profiles").find({});
        const results = await events.toArray();
        const data = [];
        if (results.length > 0) {
          results.forEach((result: any, i: any) => {
              const images = MyImage.find({});
              
          });
      } else {
          console.log(`No customers found`);
      }
        res.json(
            {
              data: results,
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