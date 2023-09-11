// Code generated by sqlc-gen-ts-d1. DO NOT EDIT.
// versions:
//   sqlc v1.19.1
//   sqlc-gen-ts-d1 v0.0.0-a@254c24db5bcb2e1e16559e7f8498d7fa673ada31

import { D1Database, D1Result } from "@cloudflare/workers-types/experimental"

const allQuery = `-- name: All :many
SELECT id, guild_id, sudoer_role_id, root_role_id FROM role`;

export type AllRow = {
  id: number;
  guildId: string;
  sudoerRoleId: string;
  rootRoleId: string;
};

type RawAllRow = {
  id: number;
  guild_id: string;
  sudoer_role_id: string;
  root_role_id: string;
};

export async function all(
  d1: D1Database
): Promise<D1Result<AllRow>> {
  return await d1
    .prepare(allQuery)
    .all<RawAllRow>()
    .then((r: D1Result<RawAllRow>) => { return {
      ...r,
      results: r.results.map((raw: RawAllRow) => { return {
        id: raw.id,
        guildId: raw.guild_id,
        sudoerRoleId: raw.sudoer_role_id,
        rootRoleId: raw.root_role_id,
      }}),
    }});
}

const getRolesQuery = `-- name: GetRoles :many
SELECT
  id, guild_id, sudoer_role_id, root_role_id
FROM
  role
WHERE
  guild_id = ?1`;

export type GetRolesParams = {
  guildId: string;
};

export type GetRolesRow = {
  id: number;
  guildId: string;
  sudoerRoleId: string;
  rootRoleId: string;
};

type RawGetRolesRow = {
  id: number;
  guild_id: string;
  sudoer_role_id: string;
  root_role_id: string;
};

export async function getRoles(
  d1: D1Database,
  args: GetRolesParams
): Promise<D1Result<GetRolesRow>> {
  return await d1
    .prepare(getRolesQuery)
    .bind(args.guildId)
    .all<RawGetRolesRow>()
    .then((r: D1Result<RawGetRolesRow>) => { return {
      ...r,
      results: r.results.map((raw: RawGetRolesRow) => { return {
        id: raw.id,
        guildId: raw.guild_id,
        sudoerRoleId: raw.sudoer_role_id,
        rootRoleId: raw.root_role_id,
      }}),
    }});
}

const getRoleQuery = `-- name: GetRole :one
SELECT
  id, guild_id, sudoer_role_id, root_role_id
FROM
  role
WHERE
  guild_id = ?1
  and sudoer_role_id = ?2`;

export type GetRoleParams = {
  guildId: string;
  sudoerRoleId: string;
};

export type GetRoleRow = {
  id: number;
  guildId: string;
  sudoerRoleId: string;
  rootRoleId: string;
};

type RawGetRoleRow = {
  id: number;
  guild_id: string;
  sudoer_role_id: string;
  root_role_id: string;
};

export async function getRole(
  d1: D1Database,
  args: GetRoleParams
): Promise<GetRoleRow | null> {
  return await d1
    .prepare(getRoleQuery)
    .bind(args.guildId, args.sudoerRoleId)
    .first<RawGetRoleRow | null>()
    .then((raw: RawGetRoleRow | null) => raw ? {
      id: raw.id,
      guildId: raw.guild_id,
      sudoerRoleId: raw.sudoer_role_id,
      rootRoleId: raw.root_role_id,
    } : null);
}

const createRoleQuery = `-- name: CreateRole :exec
INSERT INTO
  role (guild_id, sudoer_role_id, root_role_id)
VALUES
  (?1, ?2, ?3)`;

export type CreateRoleParams = {
  guildId: string;
  sudoerRoleId: string;
  rootRoleId: string;
};

export async function createRole(
  d1: D1Database,
  args: CreateRoleParams
): Promise<D1Result> {
  return await d1
    .prepare(createRoleQuery)
    .bind(args.guildId, args.sudoerRoleId, args.rootRoleId)
    .run();
}

const deleteRoleQuery = `-- name: DeleteRole :exec
DELETE FROM role
WHERE
  id = ?1`;

export type DeleteRoleParams = {
  id: number;
};

export async function deleteRole(
  d1: D1Database,
  args: DeleteRoleParams
): Promise<D1Result> {
  return await d1
    .prepare(deleteRoleQuery)
    .bind(args.id)
    .run();
}

const getSudoerQuery = `-- name: GetSudoer :one
SELECT
  user_id, guild_id, role_id, expries_at
FROM
  sudoer
WHERE
  user_id = ?1
  and guild_id = ?2`;

export type GetSudoerParams = {
  userId: string;
  guildId: string;
};

export type GetSudoerRow = {
  userId: string;
  guildId: string;
  roleId: number;
  expriesAt: number;
};

type RawGetSudoerRow = {
  user_id: string;
  guild_id: string;
  role_id: number;
  expries_at: number;
};

export async function getSudoer(
  d1: D1Database,
  args: GetSudoerParams
): Promise<GetSudoerRow | null> {
  return await d1
    .prepare(getSudoerQuery)
    .bind(args.userId, args.guildId)
    .first<RawGetSudoerRow | null>()
    .then((raw: RawGetSudoerRow | null) => raw ? {
      userId: raw.user_id,
      guildId: raw.guild_id,
      roleId: raw.role_id,
      expriesAt: raw.expries_at,
    } : null);
}

const getSudoersQuery = `-- name: GetSudoers :many
SELECT
  user_id, guild_id, role_id, expries_at
FROM
  sudoer
WHERE
  guild_id = ?1`;

export type GetSudoersParams = {
  guildId: string;
};

export type GetSudoersRow = {
  userId: string;
  guildId: string;
  roleId: number;
  expriesAt: number;
};

type RawGetSudoersRow = {
  user_id: string;
  guild_id: string;
  role_id: number;
  expries_at: number;
};

export async function getSudoers(
  d1: D1Database,
  args: GetSudoersParams
): Promise<D1Result<GetSudoersRow>> {
  return await d1
    .prepare(getSudoersQuery)
    .bind(args.guildId)
    .all<RawGetSudoersRow>()
    .then((r: D1Result<RawGetSudoersRow>) => { return {
      ...r,
      results: r.results.map((raw: RawGetSudoersRow) => { return {
        userId: raw.user_id,
        guildId: raw.guild_id,
        roleId: raw.role_id,
        expriesAt: raw.expries_at,
      }}),
    }});
}

const setSudoerQuery = `-- name: SetSudoer :exec
INSERT INTO
  sudoer (user_id, guild_id, role_id, expries_at)
VALUES
  (?1, ?2, ?3, ?4)`;

export type SetSudoerParams = {
  userId: string;
  guildId: string;
  roleId: number;
  expriesAt: number;
};

export async function setSudoer(
  d1: D1Database,
  args: SetSudoerParams
): Promise<D1Result> {
  return await d1
    .prepare(setSudoerQuery)
    .bind(args.userId, args.guildId, args.roleId, args.expriesAt)
    .run();
}

const deleteSudoerQuery = `-- name: DeleteSudoer :exec
DELETE FROM sudoer
WHERE
  user_id = ?1
  and guild_id = ?2`;

export type DeleteSudoerParams = {
  userId: string;
  guildId: string;
};

export async function deleteSudoer(
  d1: D1Database,
  args: DeleteSudoerParams
): Promise<D1Result> {
  return await d1
    .prepare(deleteSudoerQuery)
    .bind(args.userId, args.guildId)
    .run();
}
