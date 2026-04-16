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
    let errorBody: any;

    try {
      errorBody = await res.json();
    } catch {
      errorBody = { message: await res.text() };
    }

    throw {
      status: res.status,
      code: errorBody.code ?? "UNKNOWN_ERROR",
      message: errorBody.message ?? "Request failed",
    };
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
