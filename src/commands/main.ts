import {
  APIApplicationCommandInteractionDataBooleanOption,
  APIApplicationCommandInteractionDataRoleOption,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandGuildInteraction,
} from "discord-api-types/v10";
import { Client, reply } from "../../cloudcord";
import config, { raw } from "../config";
import { APIMessageApplicationCommandGuildInteraction } from "discord-api-types/v10";
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  setSudoer,
} from "../lib/db/querier";

export default function (client: Client<Env, typeof raw>, env: Env) {
  class Main {
    @client.command(config.sudo)
    async sudo(interaction: APIChatInputApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const roles = await getRoles(env.DB, { guildId: interaction.guild_id });
      const forever = interaction.data
        .options?.[0] as APIApplicationCommandInteractionDataBooleanOption;

      if (!roles || !roles.results.length)
        return reply({ content: conf._.sudoersNotFound });

      const role = roles.results.find((x) =>
        interaction.member.roles.some((y) => x.sudoerRoleId === y)
      );


      if (!role) return reply({ content: conf._.fuck });

      await setSudoer(env.DB, {
        expriesAt: forever?.value ? 0 : Date.now() + 15 * 60 * 1000,
        guildId: interaction.guild_id,
        userId: interaction.member.user.id,
        roleId: role.id,
      }).catch(e => {
        console.log(e);
        console.log(e.message);
        console.log(e.cause);
      });

      await fetch(
        "https://discord.com/api/v9/guilds/" +
          interaction.guild_id +
          "/members/" +
          interaction.member.user.id +
          "/roles/" +
          role.rootRoleId,
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

      if ((BigInt(interaction.member.permissions) & 8n) !== 8n)
        return reply({ content: conf._.badPermission, ephemeral: true });

      const subcommand = interaction.data
        .options![0] as APIApplicationCommandInteractionDataSubcommandOption;

      switch (subcommand.name) {
        case "list": {
          const roles = await getRoles(env.DB, {
            guildId: interaction.guild_id,
          });

          return reply({
            content: roles.results
              .map(
                (x) => `${x.id}:\n  <@&${x.sudoerRoleId}>: <@&${x.rootRoleId}>`
              )
              .join("\n"),
          });
        }

        case "add": {
          const sudoerRole =
            subcommand.options![0] as APIApplicationCommandInteractionDataRoleOption;
          const rootRole =
            subcommand.options![1] as APIApplicationCommandInteractionDataRoleOption;

          await createRole(env.DB, {
            guildId: interaction.guild_id,
            rootRoleId: rootRole.value,
            sudoerRoleId: sudoerRole.value,
          });

          return reply({ content: ":white_check_mark:", ephemeral: true });
        }

        case "delete": {
          const id =
            subcommand.options![0] as APIApplicationCommandInteractionDataStringOption;

          await deleteRole(env.DB, {
            id: parseInt(id.value),
            guildId: interaction.guild_id
          });

          return reply({ content: ":white_check_mark:", ephemeral: true });
        }

        default: {
          return reply({ content: "fuck", ephemeral: true });
        }
      }
    }

    @client.command(config.exit)
    async exit(interaction: APIMessageApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const roles = await getRoles(env.DB, {
        guildId: interaction.guild_id,
      });

      if (!roles.results.length)
        return reply({ content: conf._.sudoersNotFound });

      const role = roles.results.find((x) =>
        interaction.member.roles.some((y) => x.sudoerRoleId === y)
      );

      if (!role)
        return reply({ content: conf._.badPermission, ephemeral: true });

      await fetch(
        "https://discord.com/api/v9/guilds/" +
          interaction.guild_id +
          "/members/" +
          interaction.member.user.id +
          "/roles/" +
          role.rootRoleId,
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
