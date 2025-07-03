import EventEmitter from "wavesurfer.js/dist/event-emitter";
import { SaveStatus } from "../store/modules/submodules/projectManager";


export type ProjectManagerEvents = {
  "progress-updated": [{progress: Partial<{saveStatus: SaveStatus; savingProgress: string; lastSaveTime: Date | null}>}];
};

const SAVE_TIME_INTERVAL = 120; //seconds. Time between saves

export class ProjectManager {
  public eventEmitter: EventEmitter<ProjectManagerEvents>;
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  //TODO: Save the project once in a while. After saving the project, send a "progress-updated" event.
  //use Controller and CommandHistory classes to detect project changes
  
}