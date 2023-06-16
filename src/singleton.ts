export async function get(guild_id: string, env: Env) {
  return (
    singleton.roles[guild_id] ||
    (await env.DB.prepare("SELECT * FROM roles WHERE guild_id = ?")
      .bind(guild_id)
      .first()
      .catch(console.error))
  );
}

export async function set(guild_id: string, role_id: string, sudoer: string, env: Env) {
  const isExists = await env.DB.prepare(
    "SELECT * FROM roles WHERE guild_id = ?"
  )
    .bind(guild_id)
    .first<{ role_id: string }>();
  singleton.roles[guild_id] = { role_id, sudoer };
  if (isExists) {
    await env.DB.prepare("UPDATE roles SET role_id = ?, sudoer = ? WHERE guild_id = ?")
      .bind(role_id, sudoer, guild_id)
      .run();
  } else {
    await env.DB.prepare("INSERT INTO roles (guild_id, role_id, sudoer) VALUES (?, ?, ?)")
      .bind(guild_id, role_id, sudoer)
      .run();
  }
}
