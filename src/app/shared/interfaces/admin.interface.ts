export interface AdminInterface {
  adminId: number;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  tokenUser: string;
  isLogin?: boolean;
  resetPasswordToken?: string;
  verification?: boolean;
  access_token: string;
}
