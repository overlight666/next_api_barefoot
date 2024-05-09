
import clientPromise from '@/lib/connection';
const {MyImage, EventLocation} = require('@/models/models');
export default async function handler(req: any, res: any) {
    if (req.method == "GET") {
        const client = await clientPromise;
        const db = client.db("Events");
        const events = await db.collection("Profiles").find({});
        const results = await events.toArray();
        let data = [];
        if (results.length > 0) {
          data = await results.forEach(async (result: any, i: any) => {
              const images = await MyImage.find({event_id: result.event_id});
              console.log(images)
              return {...result, images: images}
              
          });
      } else {
          console.log(`No customers found`);
      }
        res.json(
            {
              data: data,
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