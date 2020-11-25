db.createUser(
  {
    user: "rowlf",
    pwd: "pass",
    roles: [
      {
        role: "readWrite",
        db: "multicontainer-database"
      },
      {
        role: "readWrite",
        db: "test"
      }
    ]
  }
)