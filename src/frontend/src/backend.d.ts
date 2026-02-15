import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface StoredImage {
    path: string;
    image: ExternalBlob;
}
export interface TimeSlotAvailability {
    slot1pm: boolean;
    slot4pm: boolean;
    slot7pm: boolean;
    slot10am: boolean;
}
export interface ServiceRate {
    pvc: bigint;
    wallMolding: bigint;
    popGypsum: bigint;
}
export type Time = bigint;
export interface ImagePaths {
    heroImage: string;
    beforeAfterGallery: Array<StoredImage>;
    serviceCard1?: StoredImage;
    serviceCard2?: StoredImage;
    serviceCard3?: StoredImage;
    serviceCard4?: StoredImage;
}
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
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
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateImagePaths(imagePathsInput: {
        heroImage: string;
        beforeAfterGallery: Array<StoredImage>;
        serviceCard1?: StoredImage;
        serviceCard2?: StoredImage;
        serviceCard3?: StoredImage;
        serviceCard4?: StoredImage;
    }): Promise<void>;
    updateServiceRates(popGypsum: bigint, pvc: bigint, wallMolding: bigint): Promise<void>;
    updateTimeSlotAvailability(slot10am: boolean, slot1pm: boolean, slot4pm: boolean, slot7pm: boolean): Promise<void>;
    uploadImage(image: ExternalBlob, path: string): Promise<StoredImage>;
}
