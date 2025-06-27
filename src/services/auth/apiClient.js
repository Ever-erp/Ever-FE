import { reissueToken } from "./authService";

export const fetchWithAuth = async (url, options, navigate) => {
  const token = localStorage.getItem("accessToken");

  const authOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await fetch(url, authOptions);

  if (response.status === 401) {
    const newToken = await reissueToken(navigate);

    const retryOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    };

    response = await fetch(url, retryOptions);
  }

  return response;
};
