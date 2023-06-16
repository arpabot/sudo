import { Client } from "../cloudcord";
import main from "./commands/main";
import { raw } from "./config";

globalThis.singleton = {
  roles: {}
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
    const sudoing = await env.DB.prepare("SELECT * FROM sudoing").all<{
      guild_id: string;
      user_id: string;
      role_id: string;
      created_at: number;
    }>();

    for (const row of sudoing.results as unknown as {
      guild_id: string;
      user_id: string;
      role_id: string;
      created_at: number;
    }[] || []) {
      const diff = Date.now() - row.created_at;
      if (diff > 1000 * 60 * 15) {
        await fetch(
          "https://discord.com/api/v9/guilds/" +
            row.guild_id +
            "/members/" +
            row.user_id +
            "/roles/" +
            row.role_id,
          {
            headers: {
              Authorization: "Bot " + env.token,
            },
            method: "DELETE",
          }
        ).catch(console.error);
        await env.DB.prepare("DELETE FROM sudoing WHERE user_id = ?").bind(row.user_id).run().catch(console.error);
      }
    }
  },
};

export default handlers;
