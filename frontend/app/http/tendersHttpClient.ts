import axios, {AxiosInstance, AxiosResponse, AxiosError} from "axios";
import {CompaniesResponse, LoginData, LoginResponse, RegisterData, RegisterResponse, TendersResponse} from "@/app/http/types";

interface RequestPayload {
  data?: FormData | Record<string, any>;
  params?: Record<string, any>;
}

interface ErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export default class TendersHttpClient {
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
    let response: AxiosResponse<any, any> | undefined;
    if (typeof window !== "undefined") {
      let token = window.localStorage.getItem('auth_token');
      if (token) {
        this.setToken(token);
      }
    }

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

    return response?.data;
  }

  async register(request: RegisterData | any): Promise<RegisterResponse | ErrorResponse | any> {
    console.log("request: " + JSON.stringify(request));
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    return await this.request("POST", "/register", { data });
  }

  async login(request: LoginData): Promise<LoginResponse | ErrorResponse | any> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    return await this.request("POST", "/login", { data });
  }

  async getCompanies(): Promise<CompaniesResponse | ErrorResponse | any> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    return {
      "data": [
        {
          "id": 1,
          "name": "aliquid",
          "description": "Et quos voluptas et."
        },
        {
          "id": 2,
          "name": "rerum",
          "description": "Quas officia aut ipsum ipsam sit."
        },
        {
          "id": 3,
          "name": "quia",
          "description": "Magni unde impedit ipsam in."
        },
      ]
    };

    // return await this.request("GET", "/companies");
  }

  async getAllTenders(): Promise<TendersResponse | ErrorResponse | any> {
    return await this.request("GET", "/tenders");
  }

}