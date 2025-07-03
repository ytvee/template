<template>
  <div class="cognito-test">
    <SignInWithCognito />
    <button @click="getTestIdTokenFromLambda">get test id_token from lambda</button>
    TODO: sign out from JG with Cognito
  </div>
</template>

<script>
import axios from "axios";
import SignInWithCognito from "./SignInWithCognito.vue";
export default {
  name: "CognitoTest",
  components: {
    SignInWithCognito,
  },
  methods: {
    async getTestIdTokenFromLambda() {
      const request = {
        url: "https://fzcz8zglk8.execute-api.us-east-1.amazonaws.com/development/v1/id_token",
        data: "grant_type=authorization_code&client_id=test&redirect_uri=https%3A%2F%2Fjam-galaxy.auth.us-east-1.amazoncognito.com%2Foauth2%2Fidpresponse&client_secret=test&code=PHj1s2wrl9bvAQ6WvwqzUtNP5AczlDEuy-aGZqkzEDgS0uy8EFfgCfvjdSkRHmGRbxKckKcHSUtHLzlYBFHSyA",
      };
      const result = await axios.post(request.url, request.data);
    },
  },
};
</script>

<style scoped>
.cognito-test {
}
</style>
