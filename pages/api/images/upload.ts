const mgs = require("mongoose");
const {MyImage} = require("../../../models/models");
import { uri } from "@/lib/constant";
import Base64 from "@/lib/base64";
mgs.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Uploads',
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));
  export default async function handler(req: any, res: any) {
    if (req.method == "POST"){
        const imageData = req.body.image;
        if (imageData.length > 0) {
          imageData.map((ig: any) => {
            const decoded: any = JSON.parse(Base64.atob(ig));
            const imageBuffer = Buffer.from(decoded.base64, "base64");
            const m = new MyImage({
              name: decoded.fileName,
              type: decoded.type,
              data: imageBuffer,
            });
            m.save().then(() => {
              })
              .catch((error: any) => {
                console.error(error);
                res.status(500).json({
                  success: false,
                  message: "Unable to upload image",
                });
              });
          })
          res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Unknown error",
          });
        }
       
    } else {
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