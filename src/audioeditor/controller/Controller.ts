import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Context as TrackEditorContext } from "../store/modules/submodules/trackEditor";
import { Context as TrackEditorNavigationContext } from "../store/modules/submodules/trackeditor/navigation";
import { Context as EditingToolsContext } from "../store/modules/submodules/trackeditor/editingTools";
import { CommandClasses, CommandFactory, CommandNames } from "@/audioeditor/controller/commandhistory/commands/CommandFactory";
import { AbstractCommand } from "@/audioeditor/controller/commandhistory/commands/AbstractCommand";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { globals } from "@/main";
import { AnyContext } from "../store/modules/audioEditorModule";

export type HandleCommandResult = {
  command: AbstractCommand;
  data: any;
};
export type ControllerOptions = {
  isOnChange?: boolean;
  isCalledByCommand?: boolean;
};
export class Controller {
  private static isCommandExecuting = false;
  private static createCommand<CommandName extends CommandNames>(context: AnyContext, { commandName, unCompletedCommandArgs, controllerOptions }: { commandName: CommandName; unCompletedCommandArgs: Array<any>; controllerOptions?: ControllerOptions }): AbstractCommand {
    const audioEditor = AudioEditor.getInstance();
    const completedCommandArgs: ConstructorParameters<CommandClasses[CommandName]> = [audioEditor, context, ...unCompletedCommandArgs] as ConstructorParameters<CommandClasses[CommandName]>;
    const command = CommandFactory.createCommand(commandName, ...completedCommandArgs);
    return command;
  }
  private static addCommandToHistoryIfNecessary(context: AnyContext, command: AbstractCommand, controllerOptions?: ControllerOptions) {
    if (controllerOptions && (!controllerOptions.isOnChange || controllerOptions.isCalledByCommand)) {
      return;
    }
    context.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "addCommandToCommandHistory", command, { root: true });
  }
  /**
   * use for special cases. In common cases use await handleCommand() instead
   */
  public static syncHandleCommand<CommandName extends CommandNames>(context: AnyContext, { commandName, unCompletedCommandArgs, controllerOptions }: { commandName: CommandName; unCompletedCommandArgs: Array<any>; controllerOptions?: ControllerOptions }) {
    const command = this.createCommand(context, { commandName, unCompletedCommandArgs, controllerOptions });
    const executionResult = command.redo();
    if (!(executionResult && !(executionResult instanceof Promise) && executionResult.shouldBeIncludedToHistory === false)) {
      //INFO: shouldBeIncludedToHistory may be also undefined
      this.addCommandToHistoryIfNecessary(context, command, controllerOptions);
    }
  }
  public static async handleCommand<CommandName extends CommandNames>(context: AnyContext | null, { commandName, unCompletedCommandArgs, controllerOptions }: { commandName: CommandName; unCompletedCommandArgs: Array<any>; controllerOptions?: ControllerOptions }) {
    try {
      this.isCommandExecuting = true;
      if (!context) {
        context = {} as AnyContext;
      }
      const command = this.createCommand(context, { commandName, unCompletedCommandArgs, controllerOptions });
      const executionResult = await command.redo();
      if (!(executionResult && executionResult.shouldBeIncludedToHistory === false)) {
        //INFO: shouldBeIncludedToHistory may be also undefined
        this.addCommandToHistoryIfNecessary(context, command, controllerOptions);
      }
      return { command, executionResult };
    } catch (error) {
      globals.$loggerNotifications.log("error", "Controller: handleCommand", error);
    }
  }
  /**
   * Some command in fact are composite. so it makes sense to store the commands that make up a compound command inside the compound command. Instead of copying the code of these commands into the compound command.
   * This method does not add the command to the command history. Instead, it returns a command that the composite command must store within itself.
   * @param context
   * @param param1
   * @returns
   */
  public static async handleCommandByCommand<CommandName extends CommandNames>(context: AnyContext, { commandName, unCompletedCommandArgs, controllerOptions }: { commandName: CommandName; unCompletedCommandArgs: any; controllerOptions?: ControllerOptions }): Promise<HandleCommandResult> {
    const command = this.createCommand(context, { commandName, unCompletedCommandArgs, controllerOptions });
    const executionResult = await command.redo();
    return { command, data: executionResult?.data };
  }
}
