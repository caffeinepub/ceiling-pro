import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let caffeineAdminToken = "caffeine";

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

  func isAnonymousPrincipal(caller : Principal) : Bool {
    caller.toText() == "2vxsx-fae";
  };

  func isAuthorizedAdmin(caller : Principal, tokenOpt : ?Text) : Bool {
    switch (tokenOpt) {
      case (?token) {
        token == caffeineAdminToken;
      };
      case (null) {
        let callerIsAnonymous = isAnonymousPrincipal(caller);
        AccessControl.hasPermission(accessControlState, caller, #admin) or callerIsAnonymous;
      };
    };
  };

  public query ({ caller }) func getAllBookings(tokenOpt : ?Text) : async [Booking] {
    if (not isAuthorizedAdmin(caller, tokenOpt)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  // Public booking creation - anyone can book
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
    tokenOpt : ?Text,
  ) : async () {
    if (not isAuthorizedAdmin(caller, tokenOpt)) {
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
    tokenOpt : ?Text,
  ) : async () {
    if (not isAuthorizedAdmin(caller, tokenOpt)) {
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
    imagePathsInput : {
      heroImage : Text;
      serviceCard1 : ?StoredImage;
      serviceCard2 : ?StoredImage;
      serviceCard3 : ?StoredImage;
      serviceCard4 : ?StoredImage;
      beforeAfterGallery : [StoredImage];
    },
    tokenOpt : ?Text,
  ) : async () {
    if (not isAuthorizedAdmin(caller, tokenOpt)) {
      Runtime.trap("Unauthorized: Only admins can update image paths");
    };

    imagePaths := {
      heroImage = imagePathsInput.heroImage;
      serviceCard1 = imagePathsInput.serviceCard1;
      serviceCard2 = imagePathsInput.serviceCard2;
      serviceCard3 = imagePathsInput.serviceCard3;
      serviceCard4 = imagePathsInput.serviceCard4;
      beforeAfterGallery = imagePathsInput.beforeAfterGallery;
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

  // Store an image file and return its reference and path
  public shared ({ caller }) func uploadImage(image : Storage.ExternalBlob, path : Text, tokenOpt : ?Text) : async StoredImage {
    if (not isAuthorizedAdmin(caller, tokenOpt)) {
      Runtime.trap("Unauthorized: Only admins can upload images");
    };
    { image; path };
  };
};
