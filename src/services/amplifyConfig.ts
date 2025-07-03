import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.VUE_APP_NEW_AUTH_USER_POOL_ID!,
      userPoolClientId: process.env.VUE_APP_NEW_AUTH_USER_CLIENT_ID!,
      signUpVerificationMethod: "code",
    },
  },
});
