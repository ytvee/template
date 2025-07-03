import routerPaths from "@/data/router/path/routerPaths.json";

export const COGNITO_CONFIG = {
  clientId: process.env.VUE_APP_COGNITO_CLIENT_ID as string,
  domain: process.env.VUE_APP_COGNITO_DOMAIN,
  redirectSignIn: `${window.location.origin}${routerPaths.LOGIN_COGNITO_CALLBACK}`,

  callbackLogoutUrl: `${window.location.origin}${routerPaths.LOGIN}`,

  //INFO: Cognito unchangeable redirect urls:
  //https://jam-galaxy.auth.us-east-1.amazoncognito.com/oauth2/authorize/
  //https://jam-galaxy.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
};

export const TWITTER_CONFIG = {
  clientId: "Y1RLS2dwTUhsUkVheDZqTVdDOGQ6MTpjaQ",
  clientSecret: "RQXVwV1bn4Z--HeMe68NaYhcec8LEixlkdD8QRfVYUgMOJScYN",
  twitterAuthorizationUrl: "https://twitter.com/i/oauth2/authorize",
  scopeFieldsToRemoveFromCognitoScope: ["openid"],

  JGTwitterOIDCCallback: `${window.location.origin}${routerPaths.JG_TWITTER_OIDC_CALLBACK}`,
};

/* Amplify config */
// export const aws_config = {
//   Auth: {
//     identityPoolId: process.env.VUE_APP_AWS_IDENTITY_POOL_ID as string,
//     region: process.env.VUE_APP_AWS_REGION as string,
//     Cognito: {
//       userPoolId: process.env.VUE_APP_AWS_USER_POOL_ID as string,
//       userPoolClientId: process.env.VUE_APP_AWS_USER_POOL_WEB_CLIENT_ID as string,

//       loginWith: {
//         oauth: {
//           domain: COGNITO_CONFIG.domain as string,
//           scopes: ["email", "openid", "profile"],
//           redirectSignIn: [`${window.location.origin}${routerPaths.LOGIN_COGNITO_CALLBACK}`],
//           redirectSignOut: [`${window.location.origin}${routerPaths.LOGIN}`],
//           responseType: "code",
//         },
//       },
//     },
//   },
  // API: { //TODO: maybe not required by aws
  //   REST: {
  //     ...endpoints,
  //   },
  // },
// };
/* /Amplify config */

export const cognitoMessages = {
  ERRORS: {},
  INFO: {
    CONFIRM_YOUR_ACCOUNT_USING_THE_LINK: "Confirm your account using the link you received by email and log in again",
    SIGN_UP_CONFIRMATION_LINK_WAS_SENT_TO_EMAIL: "An email with a link to confirm your account has been sent to your email. Please confirm your account before logging in.",
    RESEND_SIGN_UP_CODE_EMAIL_EMPTY: "Please input your email in email field and click resend link button again",
    RESEND_SIGN_UP_CODE_SUCCESS: "New confirmation link was sent to your email",
    RESET_PASSWORD_EMAIL_EMPTY: "Please input your email in email field and click reset password again",
    RESET_PASSWORD_CODE_SEND_SUCCESS: (deliveryMedium: string) => `Confirmation code was sent to ${deliveryMedium}`,
    RESET_PASSWORD_PASSWORD_RESET_SUCCESS: "You have successfully reset your password",
  },
};
