import { uri } from "@/lib/constant";
const {EventLocation} = require('../../models/models');
const mgs = require("mongoose");
mgs.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Locations',
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

  export default function saveEventLocation (params: any) {
    let flag = false;
    const myEvent = { type: 'Point', coordinates: [params.latitude, params.longitude] };
    EventLocation.create({ eventId: params.eventId, name: params.name, location: myEvent }).then(() => {
        flag = true
    }).catch(() => {
        flag = false
    })
    return flag
  }