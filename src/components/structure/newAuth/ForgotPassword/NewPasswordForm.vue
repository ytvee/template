<template>
    <div class="new-password-form-wrapper">
        <form class="new-password-form" @submit="handleSubmit">
            <div class="inputs-container">
                <InputText :name="FormValidationsFieldsIds.VERIFICATION_CODE" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.VERIFICATION_CODE]" placeholder="Enter your code"
                    :invalid="errors[FormValidationsFieldsIds.VERIFICATION_CODE]"
                    :validationMessage="ValidationErrors[FormValidationsFieldsIds.VERIFICATION_CODE]" />
                <Password :name="FormValidationsFieldsIds.PASSWORD" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.PASSWORD]" placeholder="New password" toggleMask
                    :invalid="errors[FormValidationsFieldsIds.PASSWORD]"
                    :validationMessage="ValidationErrors[FormValidationsFieldsIds.PASSWORD]" />
                <Password :name="FormValidationsFieldsIds.CONFIRM_PASSWORD" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.CONFIRM_PASSWORD]" placeholder="Confirm password" toggleMask
                    :invalid="errors[FormValidationsFieldsIds.CONFIRM_PASSWORD]"
                    :validationMessage="ValidationErrors[FormValidationsFieldsIds.CONFIRM_PASSWORD]" />
            </div>
            <div v-if="error" class="error-container">
                <AuthErrorText :label="error" />
            </div>
            <button class="submit-button" type="submit" :disabled="!isValid">{{ `Reset password` }}</button>
        </form>
        <TimerButton label="Resend code" :onClick="resendCode" />
    </div>
</template>

<script>
import storeModules from "@/data/store/storeModules.json";
import Password from "@/components/common/form/Password.vue";
import FormValidationMixin from "@/mixins/FormValidationMixin";
import InputText from "@/components/common/form/InputText.vue";
import AuthorizationService from "@/services/authorizationService";
import TimerButton from "@/components/common/timer/TimerButton.vue";
import AuthErrorText from "@/components/common/form/AuthErrorText.vue";
import { FormValidationsFieldsIds, ValidationErrors, newPasswordValidationConfig } from '@/utils/constants/constants';
import { mapActions, mapState } from 'vuex';

export default {
    name: "NewPasswordForm",
    components: { InputText, Password, AuthErrorText, TimerButton },
    mixins: [FormValidationMixin],
    data: {
        validationConfig: newPasswordValidationConfig,
        error: "",
        FormValidationsFieldsIds,
        ValidationErrors,
    },
    methods: {
        ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),
        handleFormChange(event) {
            this.error = "";
            this.handleChange(event);
        },
        async resendCode() {
            if (!this.currentUser.email) {
                console.error("You cannot resend code without email!");
                
                return;
            };

            console.log(this.currentUser.email);

            try {
                await this.setIsLoading(true);

                await AuthorizationService.resetPassword({ email: this.currentUser.email });
            } catch (error) {
                this.error = error.message;
            } finally {
                await this.setIsLoading(false);
            }
        },
        async handleSubmit(event) {
            event.preventDefault();

            if (!this.currentUser.email) {
                console.error("You cannot create new password without email!");

                return;
            };

            try {
                await this.setIsLoading(true);

                await AuthorizationService.confirmResetPassword(
                    {
                        email: this.currentUser.email,
                        verificationCode: this.values[FormValidationsFieldsIds.VERIFICATION_CODE],
                        password: this.values[FormValidationsFieldsIds.PASSWORD],
                    }
                );

                this.$eventBus.emit("set-sign-in-form");
            } catch (error) {
                this.error = error.message;
            } finally {
                await this.setIsLoading(false);
            }
        },
    },
    computed: {
        ...mapState(storeModules.USER, {
            currentUser: (state) => state.currentUser,
        }),
    },
}
</script>

<style scoped>
.new-password-form-wrapper .new-password-form {
    width: 100%;
}

.new-password-form-wrapper .new-password-form .inputs-container {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.new-password-form-wrapper .new-password-form .error-container {
    margin-bottom: 16px;
}

.new-password-form-wrapper .new-password-form .submit-button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 13px;
    background: none;
    border-radius: 34px;
    background-color: var(--ui-accent-bg, #36ABBB);
    color: white;
}

.new-password-form-wrapper .new-password-form .submit-button:hover {
    color: white;
    -webkit-text-fill-color: white;
    filter: brightness(1);
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}

.new-password-form-wrapper .new-password-form .submit-button:focus {
    color: white;
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}
</style>