import { UserSicknessInterface } from "./user-sickness.interface";

export interface SicknessInterface{
  sicknessId: number;
  sicknessName: string;
  slug: string;
  createdAt: Date;
  userSicknesses?: UserSicknessInterface[];
}
