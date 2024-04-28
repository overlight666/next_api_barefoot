import clientPromise from '@/lib/connection';

export default async function handler(req: any, res: any) {
  if (req.method == "POST"){
    const session_id = req.body['session_id']
    const client = await clientPromise;
    const db = client.db("Users");
    try {
      const session_exist = await db.collection("Sessions");
      const query = { sessionId:  session_id };
      await session_exist.deleteOne(query);
      console.log(query)
    } catch (error) {}

    return res.json(
        {
          success: true,
          redirect: '/',
        },
        {
          status: 200,
        }
    );
  } else {
    return res.json(
        {
          success: false,
          message: 'Unknown Error'
        },
        {
          status: 500,
        }
    );
  }
}