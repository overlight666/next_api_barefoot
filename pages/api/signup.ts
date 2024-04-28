import Cookies from "cookies";
import clientPromise from "@/lib/connection";
const { createHash } = require("node:crypto");
import { NextResponse } from "next/server";

export default async function handler(req: any, res: any) {
  if (req.method == "POST") {
    try {
        const first_name = req.body["first_name"];
        const last_name = req.body["last_name"];
        const gender = req.body["gender"];
        const mobile_number = req.body["mobile_number"];
        const email = req.body["email"];
        const password = req.body["password"];
        const confirm_password = req.body["confirm_password"];

        if (password !== confirm_password) {
        //   res.redirect("/signup?msg=The two passwords don't match");
            return res.json(
            {
              message: "Passwords don't Match",
              success: false,
            },
            {
              status: 422,
            }
          );
        }
        const client = await clientPromise;
        const db = client.db("Users");
        const email_exist = await db
          .collection("Profiles")
          .find({ email: email })
          .toArray();

        if (email_exist.length > 0) {
        //   res.redirect("/signup?msg=A user already has this username");
            return res.json(
            {
              message: "Email already exist",
              success: false,
            },
            {
              status: 422,
            }
          );
        }
        const mobile_exist = await db
        .collection("Profiles")
        .find({ mobile_number: mobile_number })
        .toArray();

        if (mobile_exist.length > 0) {
          //   res.redirect("/signup?msg=A user already has this username");
              return res.json(
              {
                message: "Mobile number already used",
                success: false,
              },
              {
                status: 422,
              }
            );
          }

        const password_hash = createHash("sha256").update(password).digest("hex");
        const currentDate = new Date().toUTCString();
        const bodyObject: any = {
          first_name: first_name,
          last_name: last_name,
          mobile_number: mobile_number,
          email: email,
          gender: gender,
          password: password_hash,
          created_at: currentDate,
        };
        await db.collection("Profiles").insertOne(bodyObject);
        // const cookies = new Cookies(req, res);
        // cookies.set("email", email);
        const sessionId = createHash("sha256").update(`${mobile_number}${new Date()}`).digest("hex")
        await db.collection("Sessions").insertOne({
          sessionId,
          userId: bodyObject._id,
          createdAt: new Date(),
        })
        // res.redirect("/")
        return res.json(
          {
            message: "User created successfully",
            success: true,
            user: {
              sessionId, ...bodyObject,
            }
          },
          {
            status: 200,
          }
        );
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
