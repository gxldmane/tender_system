import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

import {
  ICompaniesResponse,
  CreateBidData,
  CreateBidResponse,
  IAuthResponse,
  ILoginData,
  IRegisterData,
  ITendersResponse, ITenderResponse
} from "@/app/http/types";

interface RequestPayload {
  data?: FormData | Record<string, any>;
  params?: Record<string, any>;
}

export interface IErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export default class HttpClient {
  private client: AxiosInstance;
  private token?: string | null;

  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:8080/api",
    });
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async request(
    method: string,
    path: string,
    payload?: RequestPayload
  ): Promise<AxiosResponse<any, any> | undefined> {
    console.log(`[HTTP] ${method} ${path} ${JSON.stringify(payload)}`);

    if (!this.token) {
      this.setToken(Cookies.get("auth_token"));
      console.log(`[HTTP] Set token from cookies ${this.token}`)
    }

    let response: AxiosResponse<any, any> | undefined;
    try {
      response = await this.client.request({
        method: method,
        url: path,
        data: payload?.data,
        params: payload?.params,
        headers: {
          Authorization: this.token && `Bearer ${this.token}`,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        response = error.response;
      } else {
        throw error;
      }
    }

    console.log(
      `[HTTP] Received a response with status code: ${response?.status}`
    );

    return response;
  }

  private saveTokenData(response: AxiosResponse<any, any>) {
    if (!response?.data?.data?.token) return;
    Cookies.set("auth_token", response?.data?.data?.token, {
      sameSite: "strict"
    });
    Cookies.set("user_data", JSON.stringify(response?.data?.data?.user), {
      sameSite: "strict"
    });
  }

  async register(request: IRegisterData | any): Promise<AxiosResponse<IAuthResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    const response = await this.request("POST", "/register", { data });
    this.saveTokenData(response);
    return response;
  }

  async login(request: ILoginData): Promise<AxiosResponse<IAuthResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    const response = await this.request("POST", "/login", { data });
    this.saveTokenData(response);
    return response;
  }

  async createBid(tenderId: string, request: CreateBidData | any): Promise<AxiosResponse<CreateBidResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    return await this.request("POST", `/tenders/${tenderId}/bids`, { data });
  }

  async getCompanies(): Promise<AxiosResponse<ICompaniesResponse | IErrorResponse | any>> {
    return await this.request("GET", "/companies");
  }

  async getAllTenders(page: number = 1): Promise<AxiosResponse<ITendersResponse | IErrorResponse | any>> {
    return await this.request("GET", "/tenders", {
      params: {
        page: page,
      }
    });
  }

  // async getCategoryById(categoryId: number): Promise<AxiosResponse<ICompaniesResponse | IErrorResponse | any>> {
  //   return await this.request("GET", `/categories/${categoryId}`);
  // }

  async getTenderInfo(tenderId: string): Promise<AxiosResponse<ITenderResponse | IErrorResponse | any>> {
    return await this.request("GET", `/tenders/${tenderId}`);
  }

}