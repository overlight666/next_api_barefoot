
import { getImages, getLocation } from '@/components/mongoose';
import clientPromise from '@/lib/connection';
const {MyImage, EventLocation} = require('@/models/models');
export default async function handler(req: any, res: any) {
    if (req.method == "GET") {
        const client = await clientPromise;
        const db = client.db("Events");
        const events = await db.collection("Profiles").find({});
        const results = await events.toArray();
        let data: any;
        if (results.length > 0) {
          const myPromise = new Promise(async (resolve, reject) => {
      
            await results.forEach(async (result: any, i: any) => {
              const img = await getImages({event_id: result._id})
              const loc = await getLocation({event_id: result._id})
              resolve({...result, location: loc.location, images: img})
            });
          });
            data = await myPromise

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