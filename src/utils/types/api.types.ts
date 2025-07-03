//plugins load and api append to merge

import { AxiosError } from "axios";
type APIModuleIdentifier = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type APIModule = any;

type CustomErrorHandler = (error: object) => void;
type ErrorHandler = CustomErrorHandler | null | undefined;
type HandleFunction = () => void;
type Action = () => Promise<void>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionError = AxiosError | any;

export type { APIModuleIdentifier, APIModule, HandleFunction, ErrorHandler, ActionError, Action };
