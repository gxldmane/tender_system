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

export interface Region {
  id: number;
  name: string;
}


export interface Category {
  id: number;
  name: string;
}

export interface ICompaniesResponse {
  data: Company[]
}

export interface IRegionsResponse {
  data: Region[]
}

export interface ICategoriesResponse {
  data: Category[]
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

export interface ISendedBidsResponse extends IPaginated {
  data: ISendedBid[]
}

export interface ISendedBid {
  id: number;
  tenderId: number;
  companyId: number;
  userId: number;
  price: number;
  status: string;
  createdAt: string;
}

export interface ITenderDetails {
  id: string; // Уникальный идентификатор
  name: string;
  description: string; // Описание тендера
  start_price: number;
  status: string; // Начальная цена
  currentPrice: number; // Текущая цена (опционально)
  categoryId: number;
  regionId: number; // Идентификатор категории
  customerId: number; // Идентификатор заказчика
  executorId: number; // Идентификатор исполнителя (опционально)
  untilDate: string; // Дата окончания тендера
  createdAt: string; // Дата создания тендера
  updatedAt: string; // Дата обновления тендера
}

export interface ICategoryResponse {
  data: {
    id: number;
    name: string;
  }
}

export interface CreateBidData {
  price: string;
}

export interface CreateBidResponse {
  message: string;
}

export interface ICreateTenderRequest {
  name: string;
  description: string;
  start_price: string;
  category_id: string;
  region_id: string;
  until_date: string;
  files: File[];
}

export interface ICreatedTenderDetails {
  id: string; // Уникальный идентификатор
  name: string;
  description: string; // Описание тендера
  start_price: string; // Начальная цена
  status: 'pending' | 'active' | 'closed';
  files: {
    id: number,
    tenderId: number,
    userId: number,
    url: string
  }[];
  categoryId: string; // Идентификатор категории
  customerId: string; // Идентификатор заказчика
  executorId?: number; // Идентификатор исполнителя (опционально)
  untilDate: string; // Дата окончания тендера
  createdAt: string; // Дата создания тендера
  updatedAt: string; // Дата обновления тендера
}

export interface ICreateTenderResponse {
  data: ICreatedTenderDetails
}
