import Cookies from "cookies";
import clientPromise from "@/lib/connection";
const { createHash } = require("node:crypto");
import { NextResponse } from "next/server";
import bulkUpload from "@/pages/components/bulkUpload";

export default async function handler(req: any, res: any) {
  if (req.method == "POST") {
    try {
        const event_name = req.body["event_name"];
        const event_type = req.body["event_type"];
        const date_start = req.body["date_start"];
        const date_end = req.body["date_end"];
        const time_start = req.body["time_start"];
        const time_end = req.body["time_end"];
        const user_id = req.body["user_id"];
        const images = req.body["images"];
      
        if (event_name === '') {
            return res.json(
            {
              message: "Event name is required!",
              success: false,
            },
            {
              status: 422,
            }
          );
        }
        if (event_type === '') {
            //   res.redirect("/signup?msg=The two passwords don't match");
                return res.json(
                {
                  message: "Event type is required!",
                  success: false,
                },
                {
                  status: 422,
                }
              );
        }
        if (event_date === '') {
            //   res.redirect("/signup?msg=The two passwords don't match");
                return res.json(
                {
                  message: "Event date is required!",
                  success: false,
                },
                {
                  status: 422,
                }
              );
        }

        const client = await clientPromise;
        const db = client.db("Events");
    
        const currentDate = new Date().toUTCString();
        const bodyObject: any = {
          date_start: date_start,
          date_end: date_end,
          time_start: time_start,
          time_end: time_end,
          event_name: event_name,
          event_type: event_type,
          user_id: user_id,
          created_at: currentDate,
        };
        await db.collection("Profiles").insertOne(bodyObject);
        const response = bulkUpload({id: bodyObject._id, images: images})
            if(response) {
                return res.json(
                    {
                      message: "User created successfully",
                      success: true,
                    },
                    {
                      status: 200,
                    }
                );
            } else {
                return res.json(
                    {
                      message: "User created successfully",
                      success: true,
                      imageFail: true
                    },
                    {
                      status: 200,
                    }
                  );
            }
       
    } catch (error: any) {
        return res.json({error: error.message}, {status: 500})
    }
   
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
