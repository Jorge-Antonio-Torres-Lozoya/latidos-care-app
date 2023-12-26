export interface UserInterface {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dni: string;
  tutorFirstName: string;
  tutorLastName: string;
  tutorPhoneNumber: string;
  createdAt: Date;
  tokenUser: string;
  registerData: boolean;
  verificationTokenUser: string;
  isLogin: boolean;
  resetPasswordToken: string;
  verification: boolean;
  access_token:string;
}
