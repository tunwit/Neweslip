export const isAuthorize = async (email: string) => {
  const verify = await fetch(`${process.env.BACKEND_URL}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // important to indicate JSON format
    },
    body: JSON.stringify({
      email: email,
    }),
  }).then((res) => res.json());

  return verify.verify;
};
