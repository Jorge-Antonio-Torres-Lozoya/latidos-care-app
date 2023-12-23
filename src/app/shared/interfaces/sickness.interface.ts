import { MedicationInterface } from "./medication.interface";

export interface SicknessInterface{
    sicknessId?:number;
    sicknessName?:string;
    medications?: MedicationInterface[]
}
