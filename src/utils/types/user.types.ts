type UserRole = string;

export type TUserEmail = {
    email: string;
};

export type TUserPassword = {
    password: string;
};

export type TUserData = TUserEmail;

export type TUserConfirmationCredentials = TUserEmail & {
    verificationCode: string;
};

export type TUserResetCredentials = TUserConfirmationCredentials &
    TUserPassword;

export type TUserSignUpCredentials = TUserData & TUserPassword;

export type TUserSignInCredentials = TUserEmail & TUserPassword;

type User = {
  id?: number;
  name?: string;
  email?: string;
  roles?: UserRole[];
  members?: User[];
  description?: string;
  links?: object[];
  gallery?: object[];
  logoURI?: string;
};

type Tokens = {
  cognitoAccessToken: string;
  cognitoIdToken: string;
  cognitoRefreshToken: string;
};

export type { User, UserRole, Tokens };
