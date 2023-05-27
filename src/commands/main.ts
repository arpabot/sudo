import { APIApplicationCommandAttachmentOption } from "discord-api-types/v10";
import { Client, reply } from "../../cloudcord";
import config, { raw } from "../config";
import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { APIContextMenuGuildInteraction } from "discord-api-types/v10";
import { APIMessageApplicationCommandGuildInteraction } from "discord-api-types/v10";

export default function (client: Client<Env, typeof raw>, env: Env) {
  class Main {
    @client.command(config.ping)
    async ping(interaction: APIMessageApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      return reply({ content: conf._.hello, ephemeral: true });
    }
  }
  return Main;
}
