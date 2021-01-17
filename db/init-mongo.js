db.createUser(
  {
    user: "budget",
    pwd: "pass",
    roles: [
      {
        role: "readWrite",
        db: "multicontainer-database"
      },
      {
        role: "readWrite",
        db: "prod"
      },
      {
        role: "readWrite",
        db: "dev"
      }
    ]
  }
)