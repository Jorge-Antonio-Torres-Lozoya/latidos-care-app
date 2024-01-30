export interface UpdateUserTrackingValueInterface {
  alertActivated?: boolean;
  minValueAlertActivated?: boolean;
  maxValueAlertActivated?: boolean;
  personalizedAlertMinValue?: string;
  personalizedAlertMaxValue?: string;
  minLimit?: number;
  maxLimit?: number;
  currentValue?: number;
}
