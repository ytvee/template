import { Context } from "../audioEditorModule";

export const controllerActions = {
  async newProject(context: Context) {
    //TODO: move to projectManager module
    await context.dispatch("reinitializeAudioEditor");
  },
};
