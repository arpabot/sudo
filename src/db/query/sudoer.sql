-- name: GetSudoer :one
SELECT
  *
FROM
  sudoer
WHERE
  user_id = @user_id
  and guild_id = @guild_id;

-- name: GetSudoers :many
SELECT
  *
FROM
  sudoer
WHERE
  guild_id = @guild_id;

-- name: SetSudoer :exec
INSERT INTO
  sudoer (user_id, guild_id, role_id, expries_at)
VALUES
  (@user_id, @guild_id, @role_id, @expries_at);

-- name: DeleteSudoer :exec
DELETE FROM sudoer
WHERE
  user_id = @user_id
  and guild_id = @guild_id