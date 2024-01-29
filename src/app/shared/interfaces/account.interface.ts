import { MedicationSicknessInterface } from "./medication-sickness.interface";
import { RoleAccountInterface } from "./role-account.interface";
import { UserAllergyInterface } from "./user-allergy.interface";
import { UserSicknessInterface } from "./user-sickness.interface";
import { UserTrackingValueInterface } from "./user-tracking-value.interface";

export interface AccountInterface {
  accountId: number;
  slug: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  verificationTokenExpiration?: Date;
  activeRole: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  dni?: string;
  tutorFirstName?: string;
  tutorLastName?: string;
  tutorPhoneNumber?: string;
  createdAt: Date;
  verificationCode?: number;
  registerData: boolean;
  verificationTokenUser?: string;
  isLogin: boolean;
  active: boolean;
  verification?: boolean;
  access_token?: string;
  medicationSicknesses?: MedicationSicknessInterface[];
  userAllergies?: UserAllergyInterface[];
  userTrackingValues?: UserTrackingValueInterface[];
  userSicknesses?: UserSicknessInterface[];
  roles: RoleAccountInterface[];
}
