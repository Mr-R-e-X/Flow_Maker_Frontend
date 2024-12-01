/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;
}
export interface ApiError {
  statusCode: number;
  data: any;
  success: boolean;
  errors: Array<any>;
  message: string;
}
