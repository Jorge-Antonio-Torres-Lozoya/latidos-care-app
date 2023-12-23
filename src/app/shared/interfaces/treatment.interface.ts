import { MedicationInterface } from "./medication.interface";

export interface Treatment {
  treatmentId: number;
  taken: boolean;
  createdAt: Date;
  medication: MedicationInterface
}
