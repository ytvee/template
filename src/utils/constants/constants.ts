export const logoPath: string = "/assets/navbar/logo.svg";
export const authorizationLogoPath: string = "/assets/auth/logo.svg";
export const showPasswordPath: string = "/assets/auth/showPassword.svg";
export const hidePasswordPath: string = "/assets/auth/hidePassword.svg";

export const AiChatPageIconPaths = {
  OPEN_MENU_ICON: "/assets/aichat/openMenuIcon.svg",
  PROJECT_ICON: "/assets/aichat/folder.svg",
  OPENED_PROJECT_ICON: "/assets/aichat/openedFolder.svg",
  CLOSE_ICON: "/assets/aichat/closeIcon.svg",
};

export const enum LocalStorageKeys { //TODO: should be removed. Use utils/browerStorages instead!
  USER = "user",
  TOKENS = "Tokens",
  NEW_ARTIST = "newArtist",
}

interface INavigationItemData {
  name: string;
  iconPath: string;
  route?: string;
}

export const pagesNavigationData: INavigationItemData[] = [
  {
    name: "aiChat",
    iconPath: "/assets/navbar/musicChat.svg",
    route: "AICHAT",
  },
  {
    name: "SOUND_SPLITTER",
    iconPath: "/assets/navbar/studio.svg",
    route: "SOUND_SPLITTER",
  },
];

export const ANCHORED_MENU_PLACE_SPACING_IN_PIXELS: number = 4;

export const AnchoredMenuDirections = {
  TOP: "top",
  BOTTOM: "bottom",
  RIGHT: "right",
  LEFT: "left",
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
};

interface IAnchoredMenuPosition {
  top: number;
  left: number;
}

export const calculateAnchoredMenuPosition = (direction: string, anchorElementRect: DOMRect, menuElementRect: DOMRect): IAnchoredMenuPosition => {
  const ANCHORED_MENU_PLACE_SPACING_IN_PIXELS = 4;

  const { top: anchorTop, left: anchorLeft, width: anchorWidth, height: anchorHeight } = anchorElementRect;
  const { width: menuWidth, height: menuHeight } = menuElementRect;

  switch (direction) {
    case AnchoredMenuDirections.TOP:
      return {
        top: anchorTop - menuHeight - ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft,
      };
    case AnchoredMenuDirections.BOTTOM:
      return {
        top: anchorTop + anchorHeight + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft,
      };
    case AnchoredMenuDirections.LEFT:
      return {
        top: anchorTop,
        left: anchorLeft - menuWidth - ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
      };
    case AnchoredMenuDirections.RIGHT:
      return {
        top: anchorTop,
        left: anchorLeft + anchorWidth + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
      };
    case AnchoredMenuDirections.TOP_LEFT:
      return {
        top: anchorTop - menuHeight - ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft - menuWidth - ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
      };
    case AnchoredMenuDirections.TOP_RIGHT:
      return {
        top: anchorTop - menuHeight - ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft + anchorWidth + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
      };
    case AnchoredMenuDirections.BOTTOM_LEFT:
      return {
        top: anchorTop + anchorHeight + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft - menuWidth - ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
      };
    case AnchoredMenuDirections.BOTTOM_RIGHT:
      return {
        top: anchorTop + anchorHeight + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft + anchorWidth + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
      };
    default:
      return {
        top: anchorTop + anchorHeight + ANCHORED_MENU_PLACE_SPACING_IN_PIXELS,
        left: anchorLeft,
      };
  }
};

export interface IActionData {
  label: string;
  action?: any;
  subActions?: IActionData[];
}

export const getAnchoredMenuConfigWithItemId = (defaultConfig: IActionData[], itemId: string): IActionData[] => {
  return defaultConfig.map((actionData) => {
    if (!actionData.subActions) {
      const updatedAction: any = () => {
        actionData.action(itemId);
      };

      return {
        ...actionData,
        action: updatedAction,
      };
    }

    const updatedSubActions: IActionData[] = actionData.subActions.map((subActionData) => {
      const updatedSubAction: any = () => {
        subActionData.action(itemId);
      };

      return {
        ...subActionData,
        action: updatedSubAction,
      };
    });

    return {
      ...actionData,
      subActions: updatedSubActions,
    };
  });
}

export const enum FormValidationsFieldsIds {
    EMAIL = "email",
    PASSWORD = "password",
    USERNAME = "username",
    CONFIRM_PASSWORD = "confirmPassword",
    VERIFICATION_CODE = "verificationCode",
}

export interface IValidationValues {
    [key: string]: string;
}

export interface IValidationErrors {
    [key: string]: boolean;
}

export interface IValidationConfig {
    idList: FormValidationsFieldsIds[];
    isConfirmPassword: boolean;
}

export const signInValidationConfig: IValidationConfig = {
    idList: [FormValidationsFieldsIds.EMAIL, FormValidationsFieldsIds.PASSWORD],
    isConfirmPassword: false,
};

export const signUpValidationConfig: IValidationConfig = {
    idList: [
        FormValidationsFieldsIds.EMAIL,
        FormValidationsFieldsIds.PASSWORD,
        FormValidationsFieldsIds.CONFIRM_PASSWORD,
    ],
    isConfirmPassword: true,
};

export const verificationCodeValidationConfig: IValidationConfig = {
    idList: [FormValidationsFieldsIds.VERIFICATION_CODE],
    isConfirmPassword: false,
};

export const resetPasswordValidationConfig: IValidationConfig = {
    idList: [FormValidationsFieldsIds.EMAIL],
    isConfirmPassword: false,
};

export const newPasswordValidationConfig: IValidationConfig = {
    idList: [
        FormValidationsFieldsIds.VERIFICATION_CODE,
        FormValidationsFieldsIds.PASSWORD,
        FormValidationsFieldsIds.CONFIRM_PASSWORD,
    ],
    isConfirmPassword: true,
};

export const ValidationErrors = {
    [FormValidationsFieldsIds.VERIFICATION_CODE]: "Verification code must be 6 digits long and contain only numbers.",
    [FormValidationsFieldsIds.EMAIL]: "Enter a valid email address. It must contain only allowed characters and include an '@' and domain.",
    [FormValidationsFieldsIds.PASSWORD] : "Password must be at least 8 characters long and include one uppercase letter, one number, and one special character.",
    [FormValidationsFieldsIds.CONFIRM_PASSWORD]: "Confirmation password must match the password and follow the same rules.",
    [FormValidationsFieldsIds.USERNAME]: "Username must be 3–20 characters long and contain only letters, numbers, underscores, or periods.",
}

const PASSWORD_REGEX: RegExp =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:',.<>/?`~"\\]).{8,}$/;
const EMAIL_REGEX: RegExp =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const VERIFICATION_CODE_REGEX: RegExp = /^[0-9]{6}$/;
const USERNAME_REGEX: RegExp = /^[a-zA-Z0-9_.]{3,20}$/;

const isValidVerificationCode = (verificationCode: string): boolean => {
    return VERIFICATION_CODE_REGEX.test(verificationCode);
};

const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
};

const isValidPassword = (password: string): boolean => {
    return PASSWORD_REGEX.test(password);
};

const isValidUsername = (username: string): boolean => {
    return USERNAME_REGEX.test(username);
};

export const validationActionsConfig: Record<
    FormValidationsFieldsIds,
    (query: string) => boolean
> = {
    [FormValidationsFieldsIds.VERIFICATION_CODE]: isValidVerificationCode,
    [FormValidationsFieldsIds.EMAIL]: isValidEmail,
    [FormValidationsFieldsIds.PASSWORD]: isValidPassword,
    [FormValidationsFieldsIds.CONFIRM_PASSWORD]: isValidPassword,
    [FormValidationsFieldsIds.USERNAME]: isValidUsername,
};

export const DEFAULT_FADE_DURATION: number = 400;

export const checkFormValidity = (
    formValues: IValidationValues,
    errors: IValidationErrors
): boolean => {
    return !Object.entries(formValues).some((formValue) => {
        const [key, value] = formValue;

        return errors[key] || !value;
    });
};

export const getInitialValidationValuesByConfig = (
    idList: FormValidationsFieldsIds[]
): IValidationValues => {
    const validationValues: IValidationValues = {};

    idList.forEach((id) => {
        validationValues[id] = "";
    });

    return validationValues;
};
