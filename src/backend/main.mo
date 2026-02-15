import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
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

  let bookings = Map.empty<Text, Booking>();
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
    };

    bookings.add(id, booking);
    booking;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

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

  public query ({ caller }) func getServiceRates() : async ServiceRate {
    serviceRates;
  };

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

  public query ({ caller }) func getTimeSlotAvailability() : async TimeSlotAvailability {
    timeSlotAvailability;
  };

  public query ({ caller }) func calculateEstimate(service : Text, area : Nat) : async ?Nat {
    switch (service) {
      case ("POP & Gypsum") { ?(area * serviceRates.popGypsum) };
      case ("PVC") { ?(area * serviceRates.pvc) };
      case ("Wall Molding") { ?(area * serviceRates.wallMolding) };
      case ("Gypsum Repair") { null };
      case (_) { Runtime.trap("Invalid service selected") };
    };
  };
};
