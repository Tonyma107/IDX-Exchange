function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      if (errorBody.error) {
        message = errorBody.error;
      }
    } catch {
      // If response is not JSON, keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function fetchProperties(params = {}) {
  const queryString = buildQueryString(params);
  const response = await fetch(`/api/properties${queryString}`);
  return handleResponse(response);
}

export async function fetchPropertyDetail(id) {
  const response = await fetch(`/api/properties/${id}`);
  return handleResponse(response);
}
