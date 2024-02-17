import { AccountInterface } from "./account.interface";

export interface DataAccessConsentInterface {
  consentId: number;
  consent: boolean;
  createdAt: Date;
  account: AccountInterface;
}
