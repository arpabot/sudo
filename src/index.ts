import { Client } from "../cloudcord";
import main from "./commands/main";
import { raw } from "./config";
import { all, deleteSudoer, getRoles, getSudoers } from "./lib/db/querier";

globalThis.singleton = {
  roles: {},
};

const handlers: ExportedHandler<Env> = {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const client = new Client<Env, typeof raw>(env, raw);
    main(client, env);

    if (url.pathname === "/register") {
      return new Response(JSON.stringify(await client.commands.register()), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return client.handleRequest(request);
    }
  },

  async scheduled(controller: ScheduledController, env: Env) {
    const guilds = await all(env.DB);

    for (const guild of guilds.results) {
      const sudoers = await getSudoers(env.DB, { guildId: guild.guildId });

      for (const sudoer of sudoers.results) {
        if (sudoer.expriesAt === 0) continue;

        const diff = Date.now() - sudoer.expriesAt;

        if (diff > 0) {
          await fetch(
            "https://discord.com/api/v9/guilds/" +
              sudoer.guildId +
              "/members/" +
              sudoer.userId +
              "/roles/" +
              guild.rootRoleId,
            {
              headers: {
                Authorization: "Bot " + env.token,
              },
              method: "DELETE",
            }
          ).catch(console.error);

          await deleteSudoer(env.DB, {
            guildId: guild.guildId,
            userId: sudoer.userId,
          });
        }
      }
    }
  },
};

export default handlers;
