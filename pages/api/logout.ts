import Cookies from 'cookies'

export default async function handler(req: any, res: any) {
  if (req.method == "GET"){
    const cookies = new Cookies(req, res)
    cookies.set('username')
    return res.json(
        {
          success: true,
          redirect: '/'
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