export interface IImage {
  uuid: string;
  description: string;
  type: 'png' | 'jpeg';
  size: number;
  url: string;
}

export interface IResponse {
  ok: boolean;
  data?: any;
  code?: number;
  message?: string;
}
