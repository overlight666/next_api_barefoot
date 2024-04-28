import Cookies from "cookies";
import clientPromise from "@/lib/connection";
const { createHash } = require("node:crypto");
import { NextResponse } from "next/server";

export default async function handler(req: any, res: any) {
  if (req.method == "POST") {
    try {
        const username = req.body["username"];
        const password = req.body["password"];
        const passwordagain = req.body["passwordagain"];
        if (password != passwordagain) {
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
        const users = await db
          .collection("Profiles")
          .find({ Username: username })
          .toArray();
        if (users.length > 0) {
        //   res.redirect("/signup?msg=A user already has this username");
            return res.json(
            {
              message: "User already exist",
              success: false,
            },
            {
              status: 422,
            }
          );
        }
        const password_hash = createHash("sha256").update(password).digest("hex");
        const currentDate = new Date().toUTCString();
        const bodyObject = {
          Username: username,
          Password: password_hash,
          Created: currentDate,
        };
        await db.collection("Profiles").insertOne(bodyObject);
        const cookies = new Cookies(req, res);
        cookies.set("username", username);
        // res.redirect("/")
        return res.json(
          {
            message: "User created successfully",
            success: true,
            bodyObject,
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
