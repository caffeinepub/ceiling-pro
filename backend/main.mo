import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Booking = {
    id : Text;
    fullName : Text;
    mobileNumber : Text;
    location : Text;
    propertyType : Text;
    service : Text;
    date : Text;
    timeSlot : Text;
    area : ?Nat;
    createdAt : Time.Time;
    owner : ?Principal;
  };

  type ServiceRate = {
    popGypsum : Nat;
    pvc : Nat;
    wallMolding : Nat;
  };

  type TimeSlotAvailability = {
    slot10am : Bool;
    slot1pm : Bool;
    slot4pm : Bool;
    slot7pm : Bool;
  };

  public type StoredImage = {
    image : Storage.ExternalBlob;
    path : Text;
  };

  type ImagePaths = {
    heroImage : Text;
    serviceCard1 : ?StoredImage;
    serviceCard2 : ?StoredImage;
    serviceCard3 : ?StoredImage;
    serviceCard4 : ?StoredImage;
    beforeAfterGallery : [StoredImage];
  };

  public type UserProfile = {
    name : Text;
  };

  let bookings = Map.empty<Text, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  var serviceRates : ServiceRate = {
    popGypsum = 65;
    pvc = 110;
    wallMolding = 100;
  };

  var timeSlotAvailability : TimeSlotAvailability = {
    slot10am = true;
    slot1pm = true;
    slot4pm = true;
    slot7pm = true;
  };

  var imagePaths : ImagePaths = {
    heroImage = "/images/hero.jpg";
    serviceCard1 = null;
    serviceCard2 = null;
    serviceCard3 = null;
    serviceCard4 = null;
    beforeAfterGallery = [];
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Guest and admin only: list all bookings
  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  // Any caller (including guests) can create a booking
  public shared ({ caller }) func createBooking(
    fullName : Text,
    mobileNumber : Text,
    location : Text,
    propertyType : Text,
    service : Text,
    date : Text,
    timeSlot : Text,
    area : ?Nat,
  ) : async Booking {
    let id = nextId.toText();
    nextId += 1;

    let ownerPrincipal : ?Principal = if (caller.isAnonymous()) { null } else { ?caller };

    let booking : Booking = {
      id;
      fullName;
      mobileNumber;
      location;
      propertyType;
      service;
      date;
      timeSlot;
      area;
      createdAt = Time.now();
      owner = ownerPrincipal;
    };

    bookings.add(id, booking);
    booking;
  };

  // Guest and admin only: update service rates
  public shared ({ caller }) func updateServiceRates(
    popGypsum : Nat,
    pvc : Nat,
    wallMolding : Nat,
  ) : async () {
    serviceRates := {
      popGypsum;
      pvc;
      wallMolding;
    };
  };

  // Public: get service rates
  public query func getServiceRates() : async ServiceRate {
    serviceRates;
  };

  // Guest and admin only: update time slot availability
  public shared ({ caller }) func updateTimeSlotAvailability(
    slot10am : Bool,
    slot1pm : Bool,
    slot4pm : Bool,
    slot7pm : Bool,
  ) : async () {
    timeSlotAvailability := {
      slot10am;
      slot1pm;
      slot4pm;
      slot7pm;
    };
  };

  // Public: get time slot availability
  public query func getTimeSlotAvailability() : async TimeSlotAvailability {
    timeSlotAvailability;
  };

  // Public: calculate estimate
  public query func calculateEstimate(service : Text, area : Nat) : async ?Nat {
    switch (service) {
      case ("POP & Gypsum") { ?(area * serviceRates.popGypsum) };
      case ("PVC") { ?(area * serviceRates.pvc) };
      case ("Wall Molding") { ?(area * serviceRates.wallMolding) };
      case ("Gypsum Repair") { null };
      case (_) { null };
    };
  };

  // Guest and admin only: update image paths
  public shared ({ caller }) func updateImagePaths(
    imagePathsInput : {
      heroImage : Text;
      serviceCard1 : ?StoredImage;
      serviceCard2 : ?StoredImage;
      serviceCard3 : ?StoredImage;
      serviceCard4 : ?StoredImage;
      beforeAfterGallery : [StoredImage];
    }
  ) : async () {
    imagePaths := {
      heroImage = imagePathsInput.heroImage;
      serviceCard1 = imagePathsInput.serviceCard1;
      serviceCard2 = imagePathsInput.serviceCard2;
      serviceCard3 = imagePathsInput.serviceCard3;
      serviceCard4 = imagePathsInput.serviceCard4;
      beforeAfterGallery = imagePathsInput.beforeAfterGallery;
    };
  };

  // Public: get image paths
  public query func getImagePaths() : async ImagePaths {
    imagePaths;
  };

  // User only : get own bookings
  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (caller.isAnonymous()) {
      return [];
    };
    bookings.values().toArray()
      |> _.filter(func(b : Booking) : Bool {
        switch (b.owner) {
          case (?owner) { owner == caller };
          case null { false };
        };
      });
  };

  // Guest and admin only: upload image
  public shared ({ caller }) func uploadImage(image : Storage.ExternalBlob, path : Text) : async StoredImage {
    { image; path };
  };
};
