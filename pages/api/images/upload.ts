const mgs = require("mongoose");
const MyImage = require("../../../models/image");
import { uri } from "@/lib/constant";
mgs.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

  export default async function handler(req: any, res: any) {
    if (req.method == "POST"){
        const imageData = req.body.image;
        const imageBuffer = Buffer.from(imageData.base64, "base64");
        const m = new MyImage({
          name: imageData.fileName,
          type: imageData.type,
          data: imageBuffer,
        });
        m
        .save().then(() => {
            res.status(201).json({
              success: true,
              message: "Image uploaded successfully",
            });
          })
          .catch((error: any) => {
            console.error(error);
            res.status(500).json({
              success: false,
              message: "Unable to upload image",
            });
          });
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