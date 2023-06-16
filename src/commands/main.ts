import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandInteractionDataRoleOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandGuildInteraction,
} from "discord-api-types/v10";
import { Client, reply } from "../../cloudcord";
import config, { raw } from "../config";
import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { APIContextMenuGuildInteraction } from "discord-api-types/v10";
import { APIMessageApplicationCommandGuildInteraction } from "discord-api-types/v10";
import { get, set } from "../singleton";

export default function (client: Client<Env, typeof raw>, env: Env) {
  class Main {
    @client.command(config.sudo)
    async sudo(interaction: APIMessageApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const role = await get(interaction.guild_id, env);
      if (!role || !role.role_id)
        return reply({ content: conf._.sudoersNotFound });

      if (interaction.member.roles.indexOf(role.role_id) !== -1)
        return reply({
          content: ":white_check_mark:",
          ephemeral: true,
        });

      await env.DB.prepare(
        "INSERT INTO sudoing (user_id, guild_id, role_id, created_at) VALUES (?, ?, ?, ?)"
      )
        .bind(
          interaction.member.user.id,
          interaction.guild_id,
          role?.role_id,
          Date.now()
        )
        .run()
        .catch(console.error);

      if (interaction.member.roles.indexOf(role.sudoer) === -1)
        return reply({ content: conf._.fuck });
      await fetch(
        "https://discord.com/api/v9/guilds/" +
          interaction.guild_id +
          "/members/" +
          interaction.member.user.id +
          "/roles/" +
          role.role_id,
        {
          headers: {
            Authorization: "Bot " + env.token,
          },
          method: "PUT",
        }
      ).catch(console.error);

      return reply({ content: conf._.lecture, ephemeral: true });
    }

    @client.command(config.visudo)
    async visudo(interaction: APIChatInputApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const role = await get(interaction.guild_id, env);

      if (
        (BigInt(interaction.member.permissions) & 8n) !== 8n &&
        interaction.member.roles.indexOf(role?.role_id) === -1
      )
        return reply({ content: conf._.badPermission, ephemeral: true });

      await set(
        interaction.guild_id,
        (
          interaction.data
            .options![1] as APIApplicationCommandInteractionDataRoleOption
        ).value,
        (
          interaction.data
            .options![0] as APIApplicationCommandInteractionDataRoleOption
        ).value,
        env
      );
      return reply({ content: ":white_check_mark:", ephemeral: true });
    }

    @client.command(config.exit)
    async exit(interaction: APIMessageApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const role = await get(interaction.guild_id, env);
      if (!role || !role.role_id)
        return reply({ content: conf._.sudoersNotFound });
      if (interaction.member.roles.indexOf(role.role_id) === -1)
        return reply({ content: conf._.badPermission, ephemeral: true });

      await fetch(
        "https://discord.com/api/v9/guilds/" +
          interaction.guild_id +
          "/members/" +
          interaction.member.user.id +
          "/roles/" +
          role.role_id,
        {
          headers: {
            Authorization: "Bot " + env.token,
          },
          method: "DELETE",
        }
      ).catch(console.error);

      return reply({ content: ":white_check_mark:", ephemeral: true });
    }
  }
  return Main;
}
