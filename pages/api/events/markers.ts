import { getImages, getLocation, nearEvents } from '@/components/mongoose';
import clientPromise from '@/lib/connection';
const {MyImage, EventLocation} = require('@/models/models');
export default async function handler(req: any, res: any) {
    if (req.method == "GET") {
        const client = await clientPromise;
        const db = client.db("EventData");
        const lat = req.query["lat"];
        const lng = req.query["lng"];
        const events = await nearEvents({lng,lat});
         res.json(
            {
              data: events,
              success: true,
            },
            {
              status: 200,
            }
          );
    }else {
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