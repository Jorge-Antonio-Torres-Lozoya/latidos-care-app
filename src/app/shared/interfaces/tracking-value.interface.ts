import { UserTrackingValueInterface } from "./user-tracking-value.interface";

export interface TrackingValueInterface {
  trackingValueId: number;
  trackingValueName: string;
  createdAt: Date;
  userTrackingValues?: UserTrackingValueInterface[];
}
