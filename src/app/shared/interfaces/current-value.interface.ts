export interface CurrentValueInterface {
  currentNumber: number;
  createdAt: Date;
  userTrackingValueId: number;
  minLimit: number;
  maxLimit: number;
  currentValue: number;
  alertActivated: boolean;
  minValueAlertActivated: boolean;
  maxValueAlertActivated: boolean;
  personalizedAlertMinValue: string;
  personalizedAlertMaxValue: string;
  userTrackingValueCreatedAt: Date;
  accountId: number;
  firstName: string;
  lastName?: string;
  trackingValueId: number;
  trackingValueName: string;
  trackingValueCreatedAt: Date;
}
