import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

import {
  ICompaniesResponse,
  CreateBidData,
  CreateBidResponse,
  IAuthResponse,
  ILoginData,
  ITendersResponse,
  ITenderResponse,
  IUserDetails,
  ICreateTenderRequest,
  ICreateTenderResponse,
  IRegionsResponse,
  ICategoriesResponse,
  Category,
  ICategoryResponse, ISendedBidsResponse,
  Company,
  ISendedBid,
  IGetNotificationsResponse,
  IGetNotificationResponse
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
      baseURL: "http://176.109.105.26/api",
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
    if (!this.token) {
      this.setToken(Cookies.get("auth_token"));
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

    return response;
  }

  private saveTokenData(response: AxiosResponse<any, any>, saveUserData: (userDetails: IUserDetails) => void, saveAuthToken: (authToken: string) => void) {
    let authToken = response?.data?.data?.token;
    if (!authToken) return;
    saveAuthToken(authToken);
    this.setToken(authToken);
    saveUserData(response?.data?.data?.user)
  }

  private saveNotificationsData(response: AxiosResponse<any, any>, saveNotifications: (notifications: IGetNotificationsResponse) => void) {
    saveNotifications(response?.data.data)
  }

  async register(request: any, saveUserData: (userDetails: IUserDetails) => void, saveAuthToken: (authToken: string) => void): Promise<AxiosResponse<any>> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    const response = await this.request("POST", "/register", { data });
    this.saveTokenData(response, saveUserData, saveAuthToken);
    return response;
  }

  async login(request: ILoginData, saveUserData: (userDetails: IUserDetails) => void, saveAuthToken: (authToken: string) => void): Promise<AxiosResponse<IAuthResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    const response = await this.request("POST", "/login", { data });
    this.saveTokenData(response, saveUserData, saveAuthToken);
    return response;
  }

  async createBid(tenderId: string, request: CreateBidData | any): Promise<AxiosResponse<CreateBidResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      data.append(key, request[key]);
    }
    return await this.request("POST", `/tenders/${tenderId}/bids`, { data });
  }

  async deleteBid(tenderId: string): Promise<AxiosResponse<CreateBidResponse | IErrorResponse | any>> {
    return await this.request("DELETE", `/tenders/${tenderId}/bids`);
  }

  async deleteTender(tenderId: string): Promise<AxiosResponse<CreateBidResponse | IErrorResponse | any>> {
    return await this.request("DELETE", `/tenders/${tenderId}`);
  }

  async createTender(request: ICreateTenderRequest | any): Promise<AxiosResponse<ICreateTenderResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      if (key === "files" && request.files != null) {
        for (let i = 0; i < request.files.length; i++) {
          data.append("files[]", request.files[i], request.files[i].name);
        }
        continue;
      }
      data.append(key, request[key]);
    }

    return await this.request("POST", `/tenders`, { data });
  }

  async updateTender(request: ICreateTenderRequest | any, tenderId: string): Promise<AxiosResponse<ICreateTenderResponse | IErrorResponse | any>> {
    const data = new FormData();
    for (const key in request) {
      if (key === "files" && request.files != null) {
        for (let i = 0; i < request.files.length; i++) {
          data.append("files[]", request.files[i], request.files[i].name);
        }
        continue;
      }
      data.append(key, request[key]);
    }

    return await this.request("POST", `/tenders/${tenderId}?_method=PATCH`, {data});
}


  async getCompanies(): Promise<AxiosResponse<ICompaniesResponse | IErrorResponse | any>> {
    return await this.request("GET", "/companies");
  }

  async getRegions(): Promise<AxiosResponse<IRegionsResponse | IErrorResponse | any>> {
    return await this.request("GET", "/regions");
  }

  async getCategories(): Promise<AxiosResponse<ICategoriesResponse | IErrorResponse | any>> {
    return await this.request("GET", "/categories");
  }

  async getAllTenders(page: number = 1, filters: Record<string, any> = {}): Promise<AxiosResponse<ITendersResponse | IErrorResponse | any>> {
    return await this.request("GET", "/tenders", {
      params: {
        page: page,
        ...filters,
      }
    });
  }
  

  async getMyTenders(page: number = 1): Promise<AxiosResponse<ITendersResponse | IErrorResponse | any>> {
    return await this.request("GET", "/tenders/my", {
      params: {
        page: page,
      }
    });
  }

  async getMyBids(page: number = 1): Promise<AxiosResponse<ISendedBidsResponse | IErrorResponse | any>> {
    return await this.request("GET", "/bids", {
      params: {
        page: page,
      }
    });
  }

  async getCategoryById(categoryId: number): Promise<AxiosResponse<ICategoryResponse | IErrorResponse | any>> {
    return await this.request("GET", `/categories/${categoryId}`);
  }

  async getRegionById(regionId: number): Promise<AxiosResponse<ICategoryResponse | IErrorResponse | any>> {
    return await this.request("GET", `/regions/${regionId}`);
  }

  async getTenderInfo(tenderId: string): Promise<AxiosResponse<ITenderResponse | IErrorResponse | any>> {
    return await this.request("GET", `/tenders/${tenderId}`);
  }

  async getHasBid(tenderId: string): Promise<AxiosResponse<boolean | IErrorResponse | any>> {
    return await this.request("GET", `/have-bid/${tenderId}`);
  }

  async downloadFile(url: string): Promise<AxiosResponse<Blob | IErrorResponse | any>> {
    return this.request("GET", `/download?file=${url}`);
  }

  async getTenderBids(tenderId: string, page: number = 1): Promise<AxiosResponse<ISendedBidsResponse | IErrorResponse | any>> {
    return await this.request("GET", `/bids/${tenderId}`, {
      params: {
        page: page,
      }
    });
  }

  async getCompanyById(companyId: number): Promise<AxiosResponse<Company | IErrorResponse | any>> {
    return await this.request("GET", `/companies/${companyId}`);
  }

  async acceptBid(tenderId: number, bidId: number): Promise<AxiosResponse<ISendedBid | IErrorResponse | any>> {
    return await this.request("GET", `bids/${tenderId}/${bidId}`);
  }

  async getUnreadNotifications(saveNotificationsData: (notificationDetails: IGetNotificationsResponse) => void) : Promise<AxiosResponse<any>> { 
    const response = await this.request("GET", `/profile/unread`);
    this.saveNotificationsData(response, saveNotificationsData);
    return response;
  }

  async getUnreadNotificationsForPage(): Promise<AxiosResponse<IGetNotificationsResponse | IErrorResponse | any>> {
    return await this.request("GET", `/profile/unread`);
    
  }

  async getAllNotifications() : Promise<AxiosResponse<IGetNotificationsResponse | IErrorResponse | any>> {
    return await this.request("GET", `/profile/notifications`);
  }

  async getNotification(notificationId: string) : Promise<AxiosResponse<IGetNotificationResponse | IErrorResponse | any>> {
    return await this.request("GET", `/profile/notifications/${notificationId}`);
  }

}