module {
  type OldActor = {
    caffeineAdminToken : Text; // authentication data that needs to be deleted
  };

  type NewActor = {};

  public func run(old : OldActor) : NewActor {
    {};
  };
};
