module {
  // Only need to update the adminCredentials.
  type AdminCredentials = {
    username : Text;
    password : Text;
  };

  type OldActor = {
    adminCredentials : AdminCredentials;
  };

  type NewActor = {
    adminCredentials : AdminCredentials;
  };

  public func run(old : OldActor) : NewActor {
    let newCredentials : AdminCredentials = {
      username = "Sirajahmad";
      password = "S1i2r3";
    };
    { old with adminCredentials = newCredentials };
  };
};
