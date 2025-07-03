import type { App } from "vue";
import { APIInstance } from "./instance/instance";
import studioModule from "./modules/studio/studioModule";
import type { APIModule, APIModuleIdentifier } from "@/utils/types/api.types";
import { AxiosRequestConfig } from "axios";

const instanceConfiguration: AxiosRequestConfig = {
  baseURL: process.env.VUE_APP_BASE_URL as string,
  withCredentials: false as boolean,
  headers: {
    accept: "application/json",
  },
};

const apiModules: Record<APIModuleIdentifier, APIModule> = {
  studio: { studio: studioModule },
};

export class ApiPlugin extends APIInstance {
  private static _pluginInstance: ApiPlugin = new ApiPlugin(instanceConfiguration);
  [module: APIModuleIdentifier]: APIModule;

  constructor(instanceConfiguration: AxiosRequestConfig) {
    if (ApiPlugin._pluginInstance) {
      throw new Error("Error: Instantiation failed: Use ApiPlugin.getInstance() instead of new.");
    }
    super(instanceConfiguration);
    this.registerModules(apiModules);
  }

  private registerModules(modulesRecord: Record<APIModuleIdentifier, APIModule>): void {
    for (const moduleId in modulesRecord) {
      this.registerModule(moduleId, modulesRecord[moduleId]);
    }
  }

  private registerModule(moduleId: APIModuleIdentifier, module: APIModule) {
    this[moduleId] = module[moduleId](this.instance);
  }

  public static getInstance(): ApiPlugin {
    return ApiPlugin._pluginInstance;
  }
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$api = ApiPlugin.getInstance();
  },
};
