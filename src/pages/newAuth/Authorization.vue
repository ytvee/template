<template>
    <div class="authorization">
        <component :is="authFormByType[authFromType]"></component>
    </div>
</template>

<script>
import SignIn from '@/components/structure/newAuth/SignIn/SignIn.vue';
import SignUp from '@/components/structure/newAuth/SignUp/SignUp.vue';
import ForgotPassword from '@/components/structure/newAuth/ForgotPassword/ForgotPassword.vue';
import { markRaw } from 'vue';

const authTypes = {
    SIGN_IN: "singIn",
    SIGN_UP: "signUp",
    FORGOT_PASSWORD: "forgotPassword",
};

const authFormByType = {
    [authTypes.SIGN_IN]: markRaw(SignIn),
    [authTypes.SIGN_UP]: markRaw(SignUp),
    [authTypes.FORGOT_PASSWORD]: markRaw(ForgotPassword),
}

export default {
    name: "Authorization",
    data() {
        return {
            authFromType: authTypes.SIGN_IN,
            authFormByType,
        };
    },
    methods: {
        setSignUpForm() {
            this.authFromType = authTypes.SIGN_UP;
        },
        setSignInForm() {
            this.authFromType = authTypes.SIGN_IN;
        },
        setForgotPasswordForm() {
            this.authFromType = authTypes.FORGOT_PASSWORD;
        },
    },
    mounted() {
        this.$eventBus.on("set-sign-up-form", this.setSignUpForm);
        this.$eventBus.on("set-sign-in-form", this.setSignInForm);
        this.$eventBus.on("set-forgot-password-form", this.setForgotPasswordForm);
    },
    beforeUnmount() {
        this.$eventBus.off("set-sign-up-form", this.setSignUpForm);
        this.$eventBus.off("set-sign-in-form", this.setSignInForm);
        this.$eventBus.off("set-forgot-password-form", this.setForgotPasswordForm);
    }
}
</script>

<style scoped>
.authorization {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom right, #1C1C1C, #2D2D2D);
}
</style>