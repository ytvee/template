<template>
  <div class="signup-page">
    <h2 class="signup-title">Sign Up</h2>
    <SignInWithCognito />
    <h3 class="signup-divider">or</h3>
    <SignUpWithPasswordForm />
  </div>
</template>

<script>
import SignUpWithPasswordForm from "@/components/structure/auth/SignUpWithPasswordForm.vue";
import SignInWithCognito from "@/components/structure/cognito/SignInWithCognito.vue";
export default {
  name: "SignupPage",
  components: {
    SignInWithCognito,
    SignUpWithPasswordForm,
  },
};
</script>

<style scoped>
.signup-page {
  margin: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* align-items: auto; */
  /* justify-content: s; */
  justify-content: center;

  width: var(--width-auth-form);
}
.signup-page > h2,
.signup-page > h3 {
  text-align: center;
}
.signup-title {
  margin-bottom: 10px;
}
.signup-divider {
  margin: 10px 0;
}
</style>
