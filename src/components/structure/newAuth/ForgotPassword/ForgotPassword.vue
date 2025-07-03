<template>
    <div class="forgot-password">
        <AuthorizationPanel :authorizationForm="currentForm" title="Reset password" :changeAuthType="setSignInForm"
            changeAuthLabel="Back to sign in" />
    </div>
</template>

<script>
import NewPasswordForm from './NewPasswordForm.vue';
import ResetPasswordForm from './ResetPasswordForm.vue';
import AuthorizationPanel from '../AuthorizationPanel.vue';
import { markRaw } from 'vue';

export default {
    name: "ForgotPassword",
    components: { AuthorizationPanel },
    data() {
        return {
            isCodeWaiting: false,
            ResetPasswordForm,
            NewPasswordForm,
        }
    },
    methods: {
        setIsCodeWaiting() {
            this.isCodeWaiting = true;
        },
        setSignInForm() {
            this.$eventBus.emit("set-sign-in-form");
        },
    },
    mounted() {
        this.$eventBus.on("set-is-code-waiting", this.setIsCodeWaiting);
    },
    computed: {
        currentForm() {
            return !this.isCodeWaiting ? markRaw(ResetPasswordForm) : markRaw(NewPasswordForm);
        }
    },
    beforeUnmount() {
        this.$eventBus.off("set-is-code-waiting", this.setIsCodeWaiting);
    }
}
</script>

<style></style>