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
          imageData.map(async (ig: any) => {
            const decoded: any = JSON.parse(Base64.atob(ig));
            const imageBuffer = Buffer.from(decoded.base64, "base64");
            const m = new MyImage({
              name: decoded.fileName,
              type: decoded.type,
              data: imageBuffer,
              event_id: params.event_id
            });
           await m.save().then(() => {
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
    const myEvent = { type: 'Point', coordinates: [params.longitude, params.latitude], index: '2dsphere' };
    return EventLocation.create({ event_id: params.event_id, name: params.name, location: myEvent }).then(() => {
        EventLocation.createIndex( { "location" : "2dsphere" } )
        return true
    }).catch((e: any) => {
        console.log(e)
        return false
    })
}

export const deleteEventLocation = (params: any) => {
  return EventLocation.deleteMany({event_id: params.event_id}).then(() => {
      return true
  }).catch((e: any) => {
      console.log(e)
      return false
  })
}

export const deleteManyImages = (params: any) => {
  return MyImage.deleteMany({event_id: params.event_id}).then(() => {
      return true
  }).catch((e: any) => {
      console.log(e)
      return false
  })
}

export const getImages = async (params: any) => {
 const img = await MyImage.find({event_id: params.event_id}).then((obj: any) => {
  return obj.map((o: any) => o.data.toString('base64')) 
 })
 return img
}

export const getLocation = async (params: any) => {
  const loc = await EventLocation.findOne({event_id: params.event_id})
  return loc
 }

 export const nearEvents = async (params: any) => {
  const events =  await EventLocation.find({
    location: {
      $geoWithin: { $centerSphere: [[params.lng, params.lat], 100000] }
    }
  })
  return events
 }