<template>
    <div class="sign-in">
        <div class="authorization-panel-wrapper">
            <AuthorizationPanel :authorizationForm="SignInForm" :changeAuthType="setForgotPasswordForm"
                changeAuthLabel="Forgot your password?" />
        </div>
        <div class="actions">
            <InlineAction :onClick="setSignUpForm" description="No account" label="Create one" />
        </div>
    </div>
</template>

<script>
import SignInForm from './SignInForm.vue';
import AuthorizationPanel from '../AuthorizationPanel.vue';
import InlineAction from '@/components/common/action/InlineAction.vue';
import { markRaw } from 'vue';
// import AuthorizationService from '@/services/authorizationService';

export default {
    name: "SignIn",
    components: { AuthorizationPanel, InlineAction },
    data() {
        return {
            SignInForm: markRaw(SignInForm),
        }
    },
    methods: {
        setForgotPasswordForm() {
            this.$eventBus.emit("set-forgot-password-form");
        },
        setSignUpForm() {
            this.$eventBus.emit("set-sign-up-form");
        },
        // async confirmSignUp() {
        //     await AuthorizationService.confirmSignUp({
        //         email: "ribinivan100@mail.ru",
        //         verificationCode: "984936",
        //     });
        // }
        // async deleteUser() {
        //     await AuthorizationService.deleteUser();
        // },
    },
    // created() {
    //     this.deleteUser();
    // },
}
</script>

<style scoped>
.sign-in .authorization-panel-wrapper {
    margin-bottom: 16px;
}

.sign-in .actions {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>