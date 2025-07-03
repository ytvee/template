/**
 * no changes - after execution it was found that the execution of the command did not lead to any changes
 * called by command - This command was called while another command was running and should not be included in the history. A similar option is passed when running the command. In the future, you need to remove one of these options and leave the other one
 * concrete command configuration - Some concrete commands should be executed but should not be written to history. The corresponding flag should be set in the corresponding command
 */
type ShouldNotBeIncludedToHistoryReasons =
  | "no_changes"
  // "called_by_command" |
  | "concrete_command_configuration";

/**
 * no_data_found - The state can change not only due to user actions. Because of this, some data may become inaccessible to the user
 */
type UnsuccessfulCompletionReasons = "no_data_found";

type AbstractCommandExecutionResultOptions = {
  data: any;
  shouldBeIncludedToHistory: boolean;
  shouldNotBeIncludedToHistoryReason: ShouldNotBeIncludedToHistoryReasons;
  isCompletedSuccessfuly: boolean;
  UnsuccessfulCompletionReason: UnsuccessfulCompletionReasons;
  isFirstRedo: boolean;
  isFirstUndo: boolean;
};
export type AbstractCommandExecutionResult = Partial<AbstractCommandExecutionResultOptions> | undefined;

export abstract class AbstractCommand {
  public readonly name: string;

  protected _verboseDescription: string;
  public get verboseDescription(): string {
    return this._verboseDescription;
  }
  constructor(name: string) {
    this.name = name;
    this._verboseDescription = "";
  }

  public abstract undo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult>;
  public abstract redo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult>;
}
