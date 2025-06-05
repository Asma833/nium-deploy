import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipEncryption?: boolean;
  }
}
