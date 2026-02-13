export const BASE_URL = "https://pokeapi.co/api/v2/";

export const endpoint_url = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`;
};

export async function client<T>(url: string): Promise<T> {
  try {
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call for |${url}| failed:`, error);
    throw error;
  }
}
