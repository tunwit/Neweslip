interface FetchProps<TBody = any> {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: TBody;
}
export const fetchwithauth = async ({ endpoint, method, body }: FetchProps) => {
  const isFormData = body instanceof FormData;

  const options: RequestInit = {
    method,
    credentials: "include",
    headers: isFormData
      ? undefined
      : {
          "Content-Type": "application/json",
        },
    body:
      body && method !== "GET"
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
    options,
  );

  if (!res.ok) {
    const msg = await res.text();
    const error = new Error(msg || "Request failed");
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

export const fetchNoAuth = async ({ endpoint, method, body }: FetchProps) => {
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
