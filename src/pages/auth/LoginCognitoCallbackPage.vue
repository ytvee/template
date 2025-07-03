<template>
  <div class="cognito-callback-page"></div>
</template>

<script>
import { mapActions } from "vuex";
import { getCognitoTokensFromCode } from "@/utils/cognito/cognitoUtils";
import router from "@/router";

export default {
  name: "CognitoCallbackPage",
  async created() {
    await this.$load(async () => {
      await this.handleCognitoCallback();
    });
  },
  methods: {
    ...mapActions(["afterAuthentication"]),
    async handleCognitoCallback() {
      const { accessToken, refreshToken, idToken } = await getCognitoTokensFromCode(this.$route.query.code, this.$route.query.state);
      await this.afterAuthentication({ idToken });
      console.log("redirecting...");
      router.push("/artists");
    },
  },
};
</script>
