// export const fetchwithauth = (
//   url: string,
//   token: string,
//   method: string = "GET",
// ) => {
//   fetch(`http://localhost:3001/v1${url}`, {
//     method: method,
//     headers: {
//       Authorization: `Bearer ${token}`, // Add the JWT to Authorization header
//     },
//   }).then((r) => {
//     return "hello";
//   });
// };
export const fetchwithauth = () =>
  fetch(`http://localhost:3001/v1/auth/test`).then((r) => r.json());
