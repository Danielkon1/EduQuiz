import { encryptData, decryptData, SERVER_URL } from "./config";

// Sends a GET request with encrypted query parameters
export const getRequest = async (endpoint: string, params: string): Promise<any> => {
  try {
    // Encrypt the parameters
    const encryptedParams = await encryptData(Object(params));

    // Construct the query string using IV and encrypted data
    const queryString = new URLSearchParams({
      iv: JSON.stringify(encryptedParams.iv),
      encrypted: JSON.stringify(encryptedParams.encrypted),
    }).toString();

    // Send the request
    const response = await fetch(`${SERVER_URL}${endpoint}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("Content-Type");

    // Decrypt the server's response
    const encrypted = await response.json();
    const decrypted = await decryptData(encrypted);

    // Parse response based on content type
    let returnText = "";
    if (contentType?.includes("application/json")) {
      returnText = JSON.parse(decrypted);
    } else if (contentType?.includes("text/plain")) {
      returnText = decrypted;
    } else {
      throw new Error(`Unsupported Content-Type: ${contentType}`);
    }

    // Throw if server responded with an error status
    if (!response.ok) {
      throw new Error(`${returnText}`);
    }

    return returnText;
  } catch (error) {
    console.error(`Error during get request to ${endpoint}:`, error);
    throw error;
  }
};

// Sends a POST request with encrypted body data
export const postRequest = async (endpoint: string, data: object): Promise<any> => {
  try {
    // Encrypt the body data
    const encryptedData = await encryptData(data);

    // Send the request
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedData),
    });

    const contentType = response.headers.get("Content-Type");

    // Decrypt the server's response
    const encrypted = await response.json();
    const decrypted = await decryptData(encrypted);

    // Parse response based on content type
    let returnText = "";
    if (contentType?.includes("application/json")) {
      returnText = JSON.parse(decrypted);
    } else if (contentType?.includes("text/plain")) {
      returnText = decrypted;
    } else {
      throw new Error(`Unsupported Content-Type: ${contentType}`);
    }

    // Throw if server responded with an error status
    if (!response.ok) {
      throw new Error(`${returnText}`);
    }

    return returnText;
  } catch (error) {
    console.error(`Error during post request to ${endpoint}:`, error);
    throw error;
  }
};
