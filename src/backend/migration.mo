module {
  // Explicit migration to drop removed adminCredentials field.
  type OldAdminCredentials = {
    username : Text;
    password : Text;
  };

  type OldActor = {
    adminCredentials : OldAdminCredentials;
  };

  // Remove adminCredentials field.
  type NewActor = {};

  public func run(old : OldActor) : NewActor {
    {};
  };
};
