import { RoleAccountInterface } from "./role-account.interface";

export interface RoleInterface {
  roleId: number;
  roleName: string;
  description: string;
  createdAt: Date;
  rolesAccount: RoleAccountInterface[];
}
