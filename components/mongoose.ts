/* eslint-disable import/no-anonymous-default-export */
const mgs = require("mongoose");
const {MyImage, EventLocation} = require('@/models/models');
import { uri } from "@/lib/constant";
import Base64 from "@/lib/base64";
mgs.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'EventData',
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));
export const bulkUpload = (params: any) => {
        const imageData: any = params.images;
        if (imageData && imageData.length > 0) {
          imageData.map((ig: any) => {
            const decoded: any = JSON.parse(Base64.atob(ig));
            const imageBuffer = Buffer.from(decoded.base64, "base64");
            const m = new MyImage({
              name: decoded.fileName,
              type: decoded.type,
              data: imageBuffer,
              event_id: params.event_id
            });
            m.save().then(() => {
            })
              .catch((error: any) => {
                console.log(error)
                return false
              });
          })
         return true
        } else {
          return false
        }
  }


export const saveEventLocation = (params: any) => {
    const myEvent = { type: 'Point', coordinates: [params.latitude, params.longitude] };
    return EventLocation.create({ event_id: params.event_id, name: params.name, location: myEvent }).then(() => {
        return true
    }).catch((e: any) => {
        console.log(e)
        return false
    })
  }
