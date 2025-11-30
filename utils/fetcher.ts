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
  
  const res = await fetch(`${window.origin}/api${endpoint}`, options);
  if (!res.ok) {
    const msg = await res.text();
    const error = new Error(msg || "Request failed");
    (error as any).status = res.status;
    throw error;
  }

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
  const res = await fetch(`/api${endpoint}`, options);

  return res.json();
};
