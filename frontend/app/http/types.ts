export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  company_id: string;
}

export interface IUserDetails {
  id: number;
  name: string;
  email: string;
  role: string;
  companyId: string;
}

export interface IAuthUser {
  details: IUserDetails;
  token: string;
}

export interface IAuthResponse {
  message: string;
  data: IAuthUser;
}

export interface ILoginData {
  email?: string;
  password?: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
}

export interface ICompaniesResponse {
  data: Company[]
}

export interface ITenderResponse {
  data: ITenderDetails & { files: {id: string, tenderId: string, url: string, name: string}[] }
}

export interface IPaginated {
  links: {
    first: string,
    last: string,
    prev?: string,
    next?: string
  }
  meta: {
    from: number,
    to: number,
    current_page: number,
    last_page: number,
    per_page: number,
    total: number,
    links: {
      url?: string,
      label: string,
      active: boolean
    }[]
  }
}

export interface ITendersResponse extends IPaginated {
  data: ITenderDetails[]
}

export interface ITenderDetails {
  id: string; // Уникальный идентификатор
  name: string;
  description: string; // Описание тендера
  start_price: number; // Начальная цена
  currentPrice: number; // Текущая цена (опционально)
  categoryId: number; // Идентификатор категории
  customerId: number; // Идентификатор заказчика
  executorId: number; // Идентификатор исполнителя (опционально)
  untilDate: string; // Дата окончания тендера
  createdAt: string; // Дата создания тендера
  updatedAt: string; // Дата обновления тендера
}

export interface CreateBidData {
  price: string;
}

export interface CreateBidResponse {
  message: string;
}



