import { MedicationSicknessInterface } from "./medication-sickness.interface";

export interface MedicationInterface {
  medicationId: number;
  medicationName: string;
  slug: string;
  createdAt: Date;
  medicationSicknesses?: MedicationSicknessInterface[];
}
