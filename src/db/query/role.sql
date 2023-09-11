-- name: All :many
SELECT * FROM role;

-- name: GetRoles :many
SELECT
  *
FROM
  role
WHERE
  guild_id = @guild_id;

-- name: GetRole :one
SELECT
  *
FROM
  role
WHERE
  guild_id = @guild_id
  and sudoer_role_id = @sudoer_role_id;

-- name: CreateRole :exec
INSERT INTO
  role (guild_id, sudoer_role_id, root_role_id)
VALUES
  (@guild_id, @sudoer_role_id, @root_role_id);

-- name: DeleteRole :exec
DELETE FROM role
WHERE
  id = @id;