import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
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
    area : Nat;
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

  type ImagePaths = {
    heroImage : Text;
    serviceCard1 : Text;
    serviceCard2 : Text;
    serviceCard3 : Text;
    serviceCard4 : Text;
    beforeAfterGallery : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  type AdminCredentials = {
    username : Text;
    password : Text; // In production, this would be a hashed password.
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
    serviceCard1 = "/images/service1.jpg";
    serviceCard2 = "/images/service2.jpg";
    serviceCard3 = "/images/service3.jpg";
    serviceCard4 = "/images/service4.jpg";
    beforeAfterGallery = [];
  };

  var adminCredentials : AdminCredentials = {
    username = "Sirajahmad";
    password = "S1i2r3";
  };

  // Admin authentication endpoint - validates credentials and assigns admin role
  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Bool {
    if (username == adminCredentials.username and password == adminCredentials.password) {
      // Assign admin role to the caller
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      true;
    } else {
      false;
    };
  };

  // Check if caller has admin privileges
  public query ({ caller }) func isAdminUser() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Booking management - Admin only
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public shared ({ caller }) func createBooking(
    fullName : Text,
    mobileNumber : Text,
    location : Text,
    propertyType : Text,
    service : Text,
    date : Text,
    timeSlot : Text,
    area : Nat,
  ) : async Booking {
    let id = nextId.toText();
    nextId += 1;

    let ownerPrincipal = if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      ?caller;
    } else {
      null;
    };

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

  // Service rate management - Admin only
  public shared ({ caller }) func updateServiceRates(
    popGypsum : Nat,
    pvc : Nat,
    wallMolding : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update service rates");
    };
    serviceRates := {
      popGypsum;
      pvc;
      wallMolding;
    };
  };

  public query ({ caller }) func getServiceRates() : async ServiceRate {
    serviceRates;
  };

  // Time slot management - Admin only
  public shared ({ caller }) func updateTimeSlotAvailability(
    slot10am : Bool,
    slot1pm : Bool,
    slot4pm : Bool,
    slot7pm : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update time slot availability");
    };
    timeSlotAvailability := {
      slot10am;
      slot1pm;
      slot4pm;
      slot7pm;
    };
  };

  public query ({ caller }) func getTimeSlotAvailability() : async TimeSlotAvailability {
    timeSlotAvailability;
  };

  // Estimate calculation - Public
  public query ({ caller }) func calculateEstimate(service : Text, area : Nat) : async ?Nat {
    switch (service) {
      case ("POP & Gypsum") { ?(area * serviceRates.popGypsum) };
      case ("PVC") { ?(area * serviceRates.pvc) };
      case ("Wall Molding") { ?(area * serviceRates.wallMolding) };
      case ("Gypsum Repair") { null };
      case (_) { Runtime.trap("Invalid service selected") };
    };
  };

  // Image path management - Admin only
  public shared ({ caller }) func updateImagePaths(
    heroImage : Text,
    serviceCard1 : Text,
    serviceCard2 : Text,
    serviceCard3 : Text,
    serviceCard4 : Text,
    beforeAfterGallery : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update image paths");
    };
    imagePaths := {
      heroImage;
      serviceCard1;
      serviceCard2;
      serviceCard3;
      serviceCard4;
      beforeAfterGallery;
    };
  };

  public query ({ caller }) func getImagePaths() : async ImagePaths {
    imagePaths;
  };

  // Customer account area - User only
  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their bookings");
    };
    let myBookings = bookings.values().toArray().filter(
      func(b) {
        switch (b.owner) {
          case (?owner) { owner == caller };
          case (null) { false };
        };
      }
    );
    myBookings;
  };
};
