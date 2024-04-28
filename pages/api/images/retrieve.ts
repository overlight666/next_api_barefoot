const Image = require("../../../models/image");
export default async function handler(req: any, res: any) {
    if (req.method == "POST"){
        const id = req.body.id;
        Image.findById(id)
            .then((image: { type: any; data: any; }) => {
            res.setHeader("Content-Type", image.type);
            res.send(image.data);
            })
            .catch((error: any) => {
            console.error(error);
            res.status(500).send("Error retrieving image");
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