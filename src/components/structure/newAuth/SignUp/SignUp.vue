<template>
    <div class="sign-up">
        <div class="authorization-panel-wrapper">
            <AuthorizationPanel :authorizationForm="currentForm" :title="currentTitle"
                :description="currentDescription" />
        </div>
        <div class="actions">
            <InlineAction :onClick="setSignInForm" description="Already have an account?" label="Log in" />
        </div>
    </div>
</template>

<script>
import SignUpForm from './SignUpForm.vue';
import AuthorizationPanel from '../AuthorizationPanel.vue';
import VerificationCodeForm from './VerificationCodeForm.vue';
import InlineAction from '@/components/common/action/InlineAction.vue';
import { markRaw } from 'vue';

export default {
    name: "SignUp",
    components: { AuthorizationPanel, InlineAction },
    data() {
        return {
            isCodeWaiting: false,
            SignUpForm,
            VerificationCodeForm,
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
        currentTitle() {
            return !this.isCodeWaiting ? "Create account" : "Check your inbox";
        },
        currentDescription() {
            return !this.isCodeWaiting
                ? ""
                : `To sign in, enter the code we emailed to m***@s***. It may take
                a minute to arrive.`
        },
        currentForm() {
            return !this.isCodeWaiting ? markRaw(SignUpForm) : markRaw(VerificationCodeForm);
        }
    },
    beforeUnmount() {
        this.$eventBus.off("set-is-code-waiting", this.setIsCodeWaiting);
    }
}
</script>

<style scoped>
.sign-up .authorization-panel-wrapper {
    margin-bottom: 16px;
}

.sign-up .actions {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>