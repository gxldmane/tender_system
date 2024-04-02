export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  company_id: string;
}

export interface CreatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number;
  updated_at: string;
  created_at: string;
}

export interface RegisterResponse {
  message: string;
  data: CreatedUser;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
}

export interface CompaniesResponse {
  data: Company[]
}

export interface TendersResponse {
  data: any
  links: any
  meta: any
}

export interface TenderInfoResponse {
  id: string;
  name: string;
  description: string;
  start_price: number;
  categoryId: number;
  createdAt: string;
  untilDate: string;
}

export interface CreateBidData {
  price: string;
}

export interface CreateBidResponse {
  message: string;
}



