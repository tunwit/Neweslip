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

interface fetchProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, any>;
}

export const fetchwithauth = async ({ endpoint, method, body }: fetchProps) => {
  const options: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // authorization: `bearer ${token}`,
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`http://localhost:3001/v1${endpoint}`, options);
  const data = await res.json();
  return data;
};

export const fetchNoAuth = async ({ endpoint, method, body }: fetchProps) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`http://localhost:3001/v1${endpoint}`, options);

  return res.json();
};
