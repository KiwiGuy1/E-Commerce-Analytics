import axios from "axios";
import type {
  AnalyticsData,
  CreateSaleInput,
  Sale,
  User,
} from "@/types/analytics";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export const apiClient = {
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await api.get<AnalyticsData>("/analytics");
    return response.data;
  },
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  },
  async createSale(payload: CreateSaleInput): Promise<Sale> {
    const response = await api.post<Sale>("/sales", payload);
    return response.data;
  },
};
