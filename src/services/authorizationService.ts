import { type TUserSignUpCredentials, type TUserSignInCredentials, type TUserEmail, type TUserConfirmationCredentials, type TUserResetCredentials } from "@/utils/types/user.types";
import { fetchAuthSession, signUp as signUpAws, signIn as signInAws, signOut as signOutAws, deleteUser as deleteUserAws, resetPassword as resetPasswordAws, confirmResetPassword as confirmResetPasswordAws, resendSignUpCode, confirmSignUp as confirmSignUpAws, fetchUserAttributes } from "aws-amplify/auth";

export interface IAuthSession {
  token: string;
  email: string;
}

export default class AuthorizationService {
  public static async getCurrentAuthSession(): Promise<IAuthSession> {
    const tokensResponse = await fetchAuthSession();
    const userAttributesResponse = await fetchUserAttributes();

    const { tokens } = tokensResponse;
    const { email } = userAttributesResponse;

    if (!tokens?.idToken || !email) {
      throw new Error("No active sessions, please login");
    }

    const idToken = tokens.idToken.toString();

    return {
      token: idToken,
      email,
    };
  }

  public static async signUp({ email, password }: TUserSignUpCredentials) {
    await signUpAws({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
  }

  public static async signIn({ email, password }: TUserSignInCredentials): Promise<IAuthSession> {
    await signInAws({ username: email, password });

    console.log("SIGN IN COMPLETE!");

    return await this.getCurrentAuthSession();
  }

  public static async signOut() {
    await signOutAws();
  }

  public static async deleteUser() {
    await deleteUserAws();
  }

  public static async resendCode({ email }: TUserEmail) {
    await resendSignUpCode({ username: email });
  }

  public static async confirmSignUp({ email, verificationCode }: TUserConfirmationCredentials) {
    await confirmSignUpAws({
      username: email,
      confirmationCode: verificationCode,
    });
  }

  public static async resetPassword({ email }: TUserEmail) {
    await resetPasswordAws({ username: email });
  }

  public static async confirmResetPassword({ email, password, verificationCode }: TUserResetCredentials) {
    await confirmResetPasswordAws({
      username: email,
      newPassword: password,
      confirmationCode: verificationCode,
    });
  }
}
