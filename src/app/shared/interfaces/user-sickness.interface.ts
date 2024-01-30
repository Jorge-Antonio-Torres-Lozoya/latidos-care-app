import { MedicationSicknessInterface } from "./medication-sickness.interface";

export interface UserSicknessInterface {
  userSicknessId: number;
  slug: string;
  createdAt: Date;
  accountId: number;
  firstName: string;
  lastName?: string;
  sicknessId: number;
  sicknessName: string;
  sicknessCreatedAt: Date;
  medicationSicknesses: MedicationSicknessInterface[];
}
