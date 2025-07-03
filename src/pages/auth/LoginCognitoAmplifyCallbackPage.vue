<template>
  <div class="login-cognito-amplify-callback-page">login-cognito-amplify-callback-page</div>
</template>

<script>
export default {
  name: "LoginCognitoAmplifyCallbackPage",
  //INFO: there is no any handler of code which Cognito send to our frontend in query parameters because Amplify library handle it with Hub and aws-amplify/auth/enable-oauth-listener
};
</script>
