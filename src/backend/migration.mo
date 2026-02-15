import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldBooking = {
    id : Text;
    fullName : Text;
    mobileNumber : Text;
    location : Text;
    propertyType : Text;
    service : Text;
    date : Text;
    timeSlot : Text;
    area : Nat;
    createdAt : Int;
    owner : ?Principal;
  };

  type OldServiceRate = {
    popGypsum : Nat;
    pvc : Nat;
    wallMolding : Nat;
  };

  type OldTimeSlotAvailability = {
    slot10am : Bool;
    slot1pm : Bool;
    slot4pm : Bool;
    slot7pm : Bool;
  };

  type OldImagePaths = {
    heroImage : Text;
    serviceCard1 : Text;
    serviceCard2 : Text;
    serviceCard3 : Text;
    serviceCard4 : Text;
    beforeAfterGallery : [Text];
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    bookings : Map.Map<Text, OldBooking>;
    serviceRates : OldServiceRate;
    timeSlotAvailability : OldTimeSlotAvailability;
    imagePaths : OldImagePaths;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextId : Nat;
  };

  type NewBooking = {
    id : Text;
    fullName : Text;
    mobileNumber : Text;
    location : Text;
    propertyType : Text;
    service : Text;
    date : Text;
    timeSlot : Text;
    area : Nat;
    createdAt : Int;
    owner : ?Principal;
  };

  type NewServiceRate = {
    popGypsum : Nat;
    pvc : Nat;
    wallMolding : Nat;
  };

  type NewTimeSlotAvailability = {
    slot10am : Bool;
    slot1pm : Bool;
    slot4pm : Bool;
    slot7pm : Bool;
  };

  type StoredImage = {
    image : Storage.ExternalBlob;
    path : Text;
  };

  type NewImagePaths = {
    heroImage : Text;
    serviceCard1 : ?StoredImage;
    serviceCard2 : ?StoredImage;
    serviceCard3 : ?StoredImage;
    serviceCard4 : ?StoredImage;
    beforeAfterGallery : [StoredImage];
  };

  type NewUserProfile = {
    name : Text;
  };

  type NewActor = {
    bookings : Map.Map<Text, NewBooking>;
    serviceRates : NewServiceRate;
    timeSlotAvailability : NewTimeSlotAvailability;
    imagePaths : NewImagePaths;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      imagePaths = {
        heroImage = old.imagePaths.heroImage;
        serviceCard1 = null;
        serviceCard2 = null;
        serviceCard3 = null;
        serviceCard4 = null;
        beforeAfterGallery = [];
      };
    };
  };
};
