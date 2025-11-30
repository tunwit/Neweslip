"use server"
export async function getShortLink(origin:string) {
  try {
   const res = await fetch("https://littleshort.vercel.app/api/link",{
    method:"POST",
    body:JSON.stringify({
        origin: origin
    })
   })
   const payload = await res.json()
   return {
    ...payload,
    url : `https://littleshort.vercel.app/${payload.data.uniqueID}`
   }
  } catch (err) {
    throw err;
  }
}
