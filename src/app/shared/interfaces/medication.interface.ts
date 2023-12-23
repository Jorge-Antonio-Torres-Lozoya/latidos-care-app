import { SicknessInterface } from "./sickness.interface";
import { UserInterface } from "./user.interface";

export interface MedicationInterface {
    medicationId?: number;
    medicationName?: string;
    timeConsumption?: number;
    createdAt?: Date;
    user?: UserInterface;
    sickness?: SicknessInterface;
    treatments?: any[];
}
