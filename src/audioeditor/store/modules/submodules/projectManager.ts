import { State } from "@/store/store";
import { ActionContext } from "vuex";
// import { controllerActions } from "./projectManager/controller";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";


export type SaveStatus = "SAVED" | "UNSAVED" | "SAVING" | "ERROR";
export type LoadStatus = "UNLOAD" | "LOADING" | "LOADED";
export type DownloadProjectsStatus = "UNLOAD" | "LOADING" | "LOADED";
export interface ISavedNameHistory {
  name: string;
  savedNameId: number;
};
export interface IProject { uuid: string, name: string };
export interface IProjectData {
  savedNamesHistory: Array<ISavedNameHistory>,
  lastSavedNameId: number,
}
export interface ProjectManagerState {
  loadStatus: LoadStatus;
  saveStatus: SaveStatus;
  savingProgress: string; //Some verbose information useful to the user
  lastSaveTime: Date | null;
  projectData: IProjectData,
  currentProjectUuid: string,
  allSavedProjects: Array<IProject>; // all user's saved projects in backend
  downloadProjectsStatus: DownloadProjectsStatus;
}

export type Context = ActionContext<ProjectManagerState, State>;

function getInitialState(): ProjectManagerState {
  return {
    loadStatus: "UNLOAD",
    downloadProjectsStatus: "UNLOAD",
    saveStatus: "UNSAVED",
    savingProgress: "",
    lastSaveTime: null,
    projectData: {
      savedNamesHistory: [{
        name: "Project name template",
        savedNameId: 0,
      },],
      lastSavedNameId: 0,
    },
    currentProjectUuid: "",
    allSavedProjects: [],
  }
}

function subscribeToProjectManagerEvents(context: Context) {
  AudioEditor.getInstance().projectManager.eventEmitter.on("progress-updated", (progress) => {
    context.dispatch("updateProgress", progress);
  });
}
const projectManagerSubModule = {
  namespaced: true as boolean,
  state: (): ProjectManagerState => getInitialState(),
  mutations: {
    /* initialization */

    resetState(state: ProjectManagerState): void {
      Object.assign(state, getInitialState());
    },
    /* /initialization */

    setProgress(state: ProjectManagerState, progress: Partial<{
      saveStatus: SaveStatus;
      savingProgress: string;
      lastSaveTime: Date | null
    }>): void {
      if (progress.saveStatus !== undefined) {
        state.saveStatus = progress.saveStatus;
      }
      if (progress.savingProgress !== undefined) {
        state.savingProgress = progress.savingProgress;
      }
      if (progress.lastSaveTime !== undefined) {
        state.lastSaveTime = progress.lastSaveTime;
      }
    },
    addNameToHistory(state: ProjectManagerState, projectName: string): void {
      if (state.projectData.savedNamesHistory[0].name === "Project name template") {
        state.projectData.savedNamesHistory = [];
      }
      const existingName = state.projectData.savedNamesHistory.filter((savedName) => savedName.name === projectName);
      if (existingName.length > 0) {
        const existingNameId = state.projectData.savedNamesHistory.findIndex((savedName) => savedName.name === existingName[0].name);
        existingNameId !== -1 && state.projectData.savedNamesHistory.splice(existingNameId, 1);
      }

      state.projectData.lastSavedNameId += 1;
      state.projectData.savedNamesHistory.unshift({
        name: projectName,
        savedNameId: state.projectData.lastSavedNameId,
      });
    },
    resetProjectData(state: ProjectManagerState) {
      state.projectData = {
        savedNamesHistory: [{
          name: "Project name template",
          savedNameId: 0,
        },],
        lastSavedNameId: 0,
      };
    },
    setLoadProjectStatus(state: ProjectManagerState, status: LoadStatus): void {
      state.loadStatus = status;
    },
    setProjectUuid(state: ProjectManagerState, uuid: string): void {
      state.currentProjectUuid = uuid;
    },
    setAllSavedProjects(state: ProjectManagerState, projects: Array<IProject>): void {
      state.allSavedProjects = projects;
    },
    setDownloadProjectsStatus(state: ProjectManagerState, status: DownloadProjectsStatus): void {
      state.downloadProjectsStatus = status;
    },
  },
  actions: {
    // ...controllerActions,
    initialize(context: Context) { //TODO: initialize somewhere
      subscribeToProjectManagerEvents(context);
    },
    addNameToHistory(context: Context, projectName: string) {
      context.commit("addNameToHistory", projectName);
    },
    resetProjectData(context: Context) {
      context.commit("resetProjectData");
    },

  },
}

export default projectManagerSubModule;