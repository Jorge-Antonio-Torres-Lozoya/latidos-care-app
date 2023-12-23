
import { TrackingValueInterface } from "./tracking-value.interface";
import { UserInterface } from "./user.interface";

export interface CurrentValueInterface {
    currentValueId?: number;
    currentNumber?: number;
    createdAt?: Date;
    user?: UserInterface;
    trackingValue?: TrackingValueInterface;
}
