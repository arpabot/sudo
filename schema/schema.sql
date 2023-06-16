CREATE TABLE
    IF NOT EXISTS sudoing (
        user_id TEXT PRIMARY KEY,
        guild_id TEXT,
        role_id TEXT,
        created_at INTEGER
    );

CREATE TABLE
    IF NOT EXISTS roles (
        guild_id TEXT PRIMARY KEY,
        sudoer TEXT,
        role_id TEXT
    );
