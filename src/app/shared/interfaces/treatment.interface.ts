export interface TreatmentInterface {
  taken: boolean;
  createdAt: Date;
  medicationSicknessId: number;
  medicationSicknessCreatedAt: Date;
  timeConsumption: number;
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
}
