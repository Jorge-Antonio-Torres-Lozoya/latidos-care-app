import { MedicationInterface } from "./medication.interface";

export interface MedicationSicknessInterface {
  medicationSicknessId: number;
  createdAt: Date;
  timeConsumption: number;
  slug: string;
  accountId: number;
  firstName: string;
  lastName?: string;
  userSicknessId: number;
  userSicknessCreatedAtId: number;
  sicknessId: number;
  sicknessName: string;
  sicknessCreatedAt: Date;
  medicationId: number;
  medicationName: string;
  medicationCreatedAt: Date;
  medication:MedicationInterface;
}
