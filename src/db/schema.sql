CREATE TABLE IF NOT EXISTS
  sudoer (
    user_id TEXT PRIMARY KEY,
    guild_id TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    expries_at INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role (id)
  );

CREATE TABLE IF NOT EXISTS
  role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    sudoer_role_id TEXT NOT NULL,
    root_role_id TEXT NOT NULL
  );