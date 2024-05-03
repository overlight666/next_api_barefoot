const mgs = require("mongoose");
const MyImage = require('../../models/image');
import { uri } from "@/lib/constant";
import Base64 from "@/lib/base64";
mgs.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Uploads',
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));
  export default function bulkUpload (params: any) {
        const imageData: any = params.images;
        if (imageData && imageData.length > 0) {
          imageData.map((ig: any) => {
            const decoded: any = JSON.parse(Base64.atob(ig));
            const imageBuffer = Buffer.from(decoded.base64, "base64");
            const m = new MyImage({
              name: decoded.fileName,
              type: decoded.type,
              data: imageBuffer,
              event_id: params.id
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
