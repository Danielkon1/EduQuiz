import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:5000";  // Change if needed

// Define the expected response structure
interface ApiResponse {
    status: "success" | "failure";
    message: string;
}

// Generic function to handle API requests
const handleRequest = async (url: string, data: object): Promise<ApiResponse> => {
    try {
        const response = await axios.post<ApiResponse>(`${BASE_URL}${url}`, data);
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse>;
        return axiosError.response?.data || { status: "failure", message: "Server error" };
    }
};

// Login function
export const login = (username: string, password: string): Promise<ApiResponse> => {
    return handleRequest("/login", { username, password });
};

// Signup function
export const signup = (username: string, password: string): Promise<ApiResponse> => {
    return handleRequest("/signup", { username, password });
};
