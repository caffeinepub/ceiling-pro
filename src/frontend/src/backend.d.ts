import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRate {
    pvc: bigint;
    wallMolding: bigint;
    popGypsum: bigint;
}
export interface TimeSlotAvailability {
    slot1pm: boolean;
    slot4pm: boolean;
    slot7pm: boolean;
    slot10am: boolean;
}
export type Time = bigint;
export interface Booking {
    id: string;
    service: string;
    propertyType: string;
    owner?: Principal;
    area: bigint;
    date: string;
    createdAt: Time;
    fullName: string;
    mobileNumber: string;
    location: string;
    timeSlot: string;
}
export interface UserProfile {
    name: string;
}
export interface ImagePaths {
    heroImage: string;
    beforeAfterGallery: Array<string>;
    serviceCard1: string;
    serviceCard2: string;
    serviceCard3: string;
    serviceCard4: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminLogin(username: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateEstimate(service: string, area: bigint): Promise<bigint | null>;
    createBooking(fullName: string, mobileNumber: string, location: string, propertyType: string, service: string, date: string, timeSlot: string, area: bigint): Promise<Booking>;
    getAllBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getImagePaths(): Promise<ImagePaths>;
    getMyBookings(): Promise<Array<Booking>>;
    getServiceRates(): Promise<ServiceRate>;
    getTimeSlotAvailability(): Promise<TimeSlotAvailability>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminUser(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateImagePaths(heroImage: string, serviceCard1: string, serviceCard2: string, serviceCard3: string, serviceCard4: string, beforeAfterGallery: Array<string>): Promise<void>;
    updateServiceRates(popGypsum: bigint, pvc: bigint, wallMolding: bigint): Promise<void>;
    updateTimeSlotAvailability(slot10am: boolean, slot1pm: boolean, slot4pm: boolean, slot7pm: boolean): Promise<void>;
}
