import alchemy from "alchemy";
import { Nextjs } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("convoexpo-and-nextjs-web-bun-better-auth");

export const web = await Nextjs("web", {
  cwd: "../../apps/web",
  bindings: {
    NEXT_PUBLIC_CONVEX_URL: alchemy.env.NEXT_PUBLIC_CONVEX_URL!,
    NEXT_PUBLIC_CONVEX_SITE_URL: alchemy.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
