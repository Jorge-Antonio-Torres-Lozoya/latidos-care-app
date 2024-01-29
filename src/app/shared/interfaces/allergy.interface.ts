import { UserAllergyInterface } from "./user-allergy.interface";

export interface AllergyInterface {
  allergyId: number;
  allergyName: string;
  createdAt: Date;
  userAllergies?: UserAllergyInterface[];
}
