import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { AbstractCommand } from "./commands/AbstractCommand";

export class CommandHistory {
  private _historyLength: number;
  private isSomeCommandRunning: boolean;
  public get historyLength() {
    return this._historyLength;
  }
  public set historyLength(historyLength: number) {
    this._historyLength = historyLength;
    this.removeExtraBottomElements();
  }

  public history: Array<AbstractCommand> = [];
  public lastExecutedCommandIndex = -1;

  constructor() {
    this._historyLength = AUDIO_EDITOR_CONFIGURATION.commandHistory.historyLength;
    this.isSomeCommandRunning = false;
  }

  private removeExtraBottomElements() {
    //TODO: may be implement data structure like stack for this
    const extraElements = this.history.length - this.historyLength;
    if (extraElements > 0) {
      this.history.splice(0, extraElements);
      this.lastExecutedCommandIndex -= extraElements;
    }
  }

  public async undo(steps?: number) {
    if (this.isSomeCommandRunning) {
      return;
    }
    this.isSomeCommandRunning = true;
    steps = steps ?? 1;
    const earliestCommandToUndoIndex = Math.max(this.lastExecutedCommandIndex - (steps - 1), 0);

    for (let i = this.lastExecutedCommandIndex; i >= earliestCommandToUndoIndex; i--) {
      await this.history[i].undo();
      this.lastExecutedCommandIndex--;
    }
    this.isSomeCommandRunning = false;
  }
  public async redo(steps?: number) {
    if (this.isSomeCommandRunning) {
      return;
    }
    this.isSomeCommandRunning = true;
    steps = steps ?? 1;
    const latestCommandToRedoIndex = Math.min(this.lastExecutedCommandIndex + steps, this.history.length - 1);

    for (let i = this.lastExecutedCommandIndex + 1; i <= latestCommandToRedoIndex; i++) {
      await this.history[i].redo();
      this.lastExecutedCommandIndex++;
    }
    this.isSomeCommandRunning = false;
  }
  public async undoAll() {
    await this.undo(this.lastExecutedCommandIndex + 1);
  }
  public async redoAll() {
    await this.redo(this.history.length - 1 - this.lastExecutedCommandIndex);
  }
  public addCommand(command: AbstractCommand) {
    this.history.splice(this.lastExecutedCommandIndex + 1);
    this.history.push(command);
    this.lastExecutedCommandIndex++;
    this.removeExtraBottomElements();
  }
  public clear() {
    this.history = [];
    this.lastExecutedCommandIndex = -1;
  }
}
