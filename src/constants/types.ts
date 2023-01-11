export interface IRequestMeta {
  error: boolean;
  message: string;
  status: number;
}

export enum ResponseCodes {
  OK_RESPONSE = 200,
  BAD_REQUEST = 400,
  CONFLICT_REQUEST = 409,
  UNPROCESSIBLE_ENTITY = 422,
}
