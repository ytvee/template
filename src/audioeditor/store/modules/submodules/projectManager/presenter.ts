import { Context, SaveStatus } from "../projectManager";

export const presenterActions = {
  updateProgress(context: Context, progress: Partial<{saveStatus: SaveStatus; savingProgress: string; lastSaveTime: Date | null}>) {
    context.commit("setProgress", progress);
  }
}