import { TrackingValueInterface } from "./tracking-value.interface";

export interface CurrentValues {
  currentNumber: number;
  createdAt: Date;
  trackingValue: TrackingValueInterface;
}
