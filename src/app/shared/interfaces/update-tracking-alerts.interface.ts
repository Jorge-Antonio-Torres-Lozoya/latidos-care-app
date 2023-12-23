export interface UpdateTrackingAlertsInterface {
  userId?: number;
  alertActivated?: boolean;
  minValueAlertActivated?: boolean;
  maxValueAlertActivated?: boolean;
  personalizedAlertMinValue?: string;
  personalizedAlertMaxValue?: string;
}
