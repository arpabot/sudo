interface Env {
  publicKey: string;
  token: string;
  clientId: string;
  secret: string;
  DB: D1Database;
}

var singleton: {
  roles: {
    [guild_id: string]: {
      role_id: string,
      sudoer: string
    }
  }
}