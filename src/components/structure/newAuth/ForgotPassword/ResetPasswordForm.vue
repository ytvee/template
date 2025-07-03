<template>
    <div class="reset-password-form-wrapper">
        <form class="reset-password-form" @submit="handleSubmit">
            <div class="inputs-container">
                <InputText :name="FormValidationsFieldsIds.EMAIL" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.EMAIL]" placeholder="Email"
                    :invalid="errors[FormValidationsFieldsIds.EMAIL]"
                    :validationMessage="ValidationErrors[FormValidationsFieldsIds.EMAIL]" />
            </div>
            <div v-if="error" class="error-container">
                <AuthErrorText :label="error" />
            </div>
            <button class="submit-button" type="submit" :disabled="!isValid">{{ `Send code` }}</button>
        </form>
    </div>
</template>

<script>
import storeModules from "@/data/store/storeModules.json";
import Password from "@/components/common/form/Password.vue";
import FormValidationMixin from "@/mixins/FormValidationMixin";
import InputText from "@/components/common/form/InputText.vue";
import AuthorizationService from "@/services/authorizationService";
import AuthErrorText from "@/components/common/form/AuthErrorText.vue";
import { FormValidationsFieldsIds, ValidationErrors, resetPasswordValidationConfig } from '@/utils/constants/constants';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: "ResetPasswordForm",
    components: { InputText, Password, AuthErrorText },
    mixins: [FormValidationMixin],
    data: {
        validationConfig: resetPasswordValidationConfig,
        error: "",
        FormValidationsFieldsIds,
        ValidationErrors,
    },
    methods: {
        ...mapMutations(storeModules.USER, ["setEmail"]),
        ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),
        handleFormChange(event) {
            this.error = "";
            this.handleChange(event);
        },
        async handleSubmit(event) {
            event.preventDefault();

            try {
                await this.setIsLoading(true);

                await AuthorizationService.resetPassword(
                    {
                        email: this.values[FormValidationsFieldsIds.EMAIL],
                    }
                );

                this.setEmail(this.values[FormValidationsFieldsIds.EMAIL]);
                this.$eventBus.emit("set-is-code-waiting");
            } catch (error) {
                this.error = error.message;
            } finally {
                await this.setIsLoading(false);
            }
        },
    },
}
</script>

<style scoped>
.reset-password-form-wrapper .reset-password-form {
    width: 100%;
}

.reset-password-form-wrapper .reset-password-form .inputs-container {
    margin-bottom: 16px;
}

.reset-password-form-wrapper .reset-password-form .error-container {
    margin-bottom: 16px;
}

.reset-password-form-wrapper .reset-password-form .submit-button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 13px;
    background: none;
    border-radius: 34px;
    background-color: var(--ui-accent-bg, #36ABBB);
    color: white;
}

.reset-password-form-wrapper .reset-password-form .submit-button:hover {
    color: white;
    -webkit-text-fill-color: white;
    filter: brightness(1);
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}

.reset-password-form-wrapper .reset-password-form .submit-button:focus {
    color: white;
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}
</style>