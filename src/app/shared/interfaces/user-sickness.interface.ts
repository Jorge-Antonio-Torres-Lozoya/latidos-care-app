export interface UserSicknessInterface {
  userSicknessId: number;
  createdAt: Date;
  accountId: number;
  firstName: string;
  lastName?: string;
  sicknessId: number;
  sicknessName: string;
  sicknessCreatedAt: Date;
}
