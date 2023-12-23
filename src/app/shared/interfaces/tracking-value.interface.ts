import { CurrentValueInterface } from "./current-value.interface";
import { UserInterface } from "./user.interface";

export interface TrackingValueInterface {
trackingValueId: number;
trackingValueName: string;
minLimit: number;
maxLimit: number;
currentValue: number;
alertActivated: boolean;
minValueAlertActivated: boolean;
maxValueAlertActivated: boolean;
personalizedAlertMinValue: string;
personalizedAlertMaxValue: string;
createdAt: Date;
user: UserInterface
currentValues?: CurrentValueInterface[];
}
