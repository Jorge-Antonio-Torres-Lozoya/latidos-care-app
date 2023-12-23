export interface UserInterface {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  dni: string;
  tutorFirstName: string;
  tutorLastName: string;
  tutorPhoneNumber: number;
  createdAt: Date;
  tokenUser: string;
  registerData: boolean;
  verificationTokenUser: string;
  isLogin: boolean;
  resetPasswordToken: string;
  verification: boolean;
  access_token:string;
}
