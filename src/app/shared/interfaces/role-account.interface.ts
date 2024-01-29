import { AccountInterface } from "./account.interface";
import { RoleInterface } from "./role.interface";

export interface RoleAccountInterface {
  roleAccountId: number;
  createdAt: Date;
  account: AccountInterface;
  role: RoleInterface;
}
