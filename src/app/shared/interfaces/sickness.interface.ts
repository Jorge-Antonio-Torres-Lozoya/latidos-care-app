import { UserSicknessInterface } from "./user-sickness.interface";

export interface SicknessInterface{
  sicknessId: number;
  sicknessName: string;
  createdAt: Date;
  userSicknesses?: UserSicknessInterface[];
}
