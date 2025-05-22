import { encryptData, SERVER_URL } from "./config";


export enum ResponseType {
  JSON = "json",
  TEXT = "text",
}


export const postRequest = async (endpoint: string, data: object, responseType: ResponseType = ResponseType.TEXT): Promise<any> => {
  try {
    const encryptedData = await encryptData(data);

    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (responseType === ResponseType.JSON) {
        return await response.json();
    }
    else if (responseType === ResponseType.TEXT) {
        return await response.text();
    }
    else {
        throw new Error(`Unsupported response type: ${responseType}`);
    }
  } catch (error) {
    console.error(`Error during post request to ${endpoint}:`, error);
    throw error;
  }
};
