import { CurrentValueInterface } from "./current-value.interface";

export interface UserTrackingValueInterface {
  userTrackingValueId: number;
  minLimit: number;
  maxLimit: number;
  currentValue: number;
  alertActivated: boolean;
  minValueAlertActivated: boolean;
  maxValueAlertActivated: boolean;
  personalizedAlertMinValue: string;
  personalizedAlertMaxValue: string;
  createdAt: Date;
  accountId: number;
  firstName: string;
  lastName?: string;
  trackingValueId: number;
  trackingValueName: string;
  trackingValueCreatedAt: Date;
  currentValues: CurrentValueInterface[];
}
