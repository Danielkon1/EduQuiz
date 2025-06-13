import { encryptData, decryptData, SERVER_URL } from "./config";


export enum ResponseType {
  JSON = "json",
  TEXT = "text",
}

export const getRequest = async (endpoint: string, params: string): Promise<any> => {
  try {
    const encryptedParams = await encryptData(Object(params));

    const queryString = new URLSearchParams({
      iv: JSON.stringify(encryptedParams.iv),
      encrypted: JSON.stringify(encryptedParams.encrypted),
    }).toString();

    const response = await fetch(`${SERVER_URL}${endpoint}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("Content-Type");

    const encrypted = await response.json();
    const decrypted = await decryptData(encrypted);
    let returnText = ""
    if (contentType?.includes("application/json")) {
      returnText = JSON.parse(decrypted)
    } else if (contentType?.includes("text/plain")) {
      returnText = decrypted;
    } else {
      throw new Error(`Unsupported Content-Type: ${contentType}`);
    }

    if (!response.ok) {
      throw new Error(`${returnText}`);
    }
    
    return returnText
  } catch (error) {
    console.error(`Error during get request to ${endpoint}:`, error);
    throw error;
  }
};


export const postRequest = async (endpoint: string, data: object): Promise<any> => {
  try {
    const encryptedData = await encryptData(data);
  
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedData),
    });

    const contentType = response.headers.get("Content-Type");

    const encrypted = await response.json();
    const decrypted = await decryptData(encrypted);
    let returnText = ""
    if (contentType?.includes("application/json")) {
      returnText = JSON.parse(decrypted)
    } else if (contentType?.includes("text/plain")) {
      returnText = decrypted;
    } else {
      throw new Error(`Unsupported Content-Type: ${contentType}`);
    }

    if (!response.ok) {
      throw new Error(`${returnText}`);
    }
    
    return returnText

  } catch (error) {
    console.error(`Error during post request to ${endpoint}:`, error);
    throw error;
  }
};
