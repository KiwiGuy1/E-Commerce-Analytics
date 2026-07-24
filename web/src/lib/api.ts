import axios from "axios";
import type {
  AnalyticsData,
  CreateSaleInput,
  Sale,
  User,
} from "@/types/analytics";

const api = axios.create({
  // Keep browser requests same-origin. Next route handlers forward them to the
  // API using API_URL, which also works when the API is on another host.
  baseURL: "/api",
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
