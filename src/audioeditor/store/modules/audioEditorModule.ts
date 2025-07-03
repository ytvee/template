import _ from "lodash";

import trackEditorSubModule, { TrackEditorState } from "./submodules/trackEditor";
import { ActionContext } from "vuex";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { State } from "@/store/store";
import aiChatModule, { IAiChatModule } from "./submodules/aiChat";
import { controllerActions } from "./audioeditor/controller";
import projectManagerSubModule, { ProjectManagerState } from "./submodules/projectManager";
// import midiEditorSubModule from "./submodules/midiEditorSubModule";

//eslint-disable-next-line
interface AudioEditorStateOwn {
  isInitialized: boolean;
}
export interface AudioEditorState extends AudioEditorStateOwn {
  trackEditor: TrackEditorState;
  projectManager: ProjectManagerState;
  aiChat: IAiChatModule;
  loadedFromBackendProjects: any;
}

export type Context = ActionContext<AudioEditorState, State>;
export type AnyContext = ActionContext<any, State>;

const initialSoundSplitterSubModules = {
  // midiEditor: midiEditorSubModule, //TODO:
  trackEditor: trackEditorSubModule,
  projectManager: projectManagerSubModule,
  aiChat: aiChatModule,
};

function getInitialState(): AudioEditorStateOwn {
  return { isInitialized: false };
}

const audioEditorModule = {
  namespaced: true as boolean,
  modules: _.cloneDeep(initialSoundSplitterSubModules),
  state: () => getInitialState() as AudioEditorState,
  getters: {},
  mutations: {
    setIsInitialized(state: AudioEditorState, isInitialized: boolean) {
      state.isInitialized = isInitialized;
    },
    resetState(state: AudioEditorState) {
      Object.assign(state, getInitialState());
    },
  },
  actions: {
    ...controllerActions,
    async initializeAudioEditor(context: Context) {
      const audioEditor = await AudioEditor.createInstance();
      await context.dispatch("trackEditor/initializeTrackEditor");
      context.commit("setIsInitialized", true);
    },
    resetVisualModel(context: Context) {
      context.dispatch("trackEditor/resetModule");
    },
    async reinitializeAudioEditor(context: Context) {
      context.commit("setIsInitialized", false);
      AudioEditor.destroyInstance();
      context.dispatch("resetVisualModel");
      await context.dispatch("initializeAudioEditor");
      // await context.dispatch("projectManager/setLoadProjectStatus", "LOADED");
    },
    //TODO: destroy() with unsubsribe all
  },
};
export default audioEditorModule;
