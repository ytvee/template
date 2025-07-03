import type { App } from "vue";
import modules from "@/data/injectableModules/modules.json";
import roundNumber from "./modules/RoundNumber";
import roundDate from "./modules/RoundDate";

export default {
  install: (app: App) => {
    app.provide(modules.ROUND_NUMBER, roundNumber);
    app.provide(modules.ROUND_DATE, roundDate);
  },
};
