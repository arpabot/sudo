// Code generated by sqlc-gen-ts-d1. DO NOT EDIT.
// versions:
//   sqlc v1.19.1
//   sqlc-gen-ts-d1 v0.0.0-a@254c24db5bcb2e1e16559e7f8498d7fa673ada31

export type Sudoer = {
  userId: string;
  guildId: string;
  roleId: number;
  expriesAt: number;
};

export type Role = {
  id: number;
  guildId: string;
  sudoerRoleId: string;
  rootRoleId: string;
};

