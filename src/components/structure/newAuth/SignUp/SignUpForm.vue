<template>
    <div class="sign-up-form-wrapper">
        <form class="sign-up-form" @submit="handleSubmit">
            <div class="inputs-container">
                <InputText :name="FormValidationsFieldsIds.EMAIL" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.EMAIL]" placeholder="Email"
                    :invalid="errors[FormValidationsFieldsIds.EMAIL]"
                    :validationMessage="ValidationErrors[FormValidationsFieldsIds.EMAIL]" />
                <Password :name="FormValidationsFieldsIds.PASSWORD" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.PASSWORD]" placeholder="Password" toggleMask
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
            <button class="submit-button" type="submit" :disabled="!isValid">{{ `Sign up` }}</button>
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
import { FormValidationsFieldsIds, ValidationErrors, signUpValidationConfig } from '@/utils/constants/constants';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: "SignUpForm",
    components: { InputText, Password, AuthErrorText },
    mixins: [FormValidationMixin],
    data: {
        validationConfig: signUpValidationConfig,
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

                await AuthorizationService.signUp(
                    {
                        email: this.values[FormValidationsFieldsIds.EMAIL],
                        password: this.values[FormValidationsFieldsIds.PASSWORD],
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
.sign-up-form-wrapper .sign-up-form {
    width: 100%;
}

.sign-up-form-wrapper .sign-up-form .inputs-container {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sign-up-form-wrapper .sign-up-form .error-container {
    margin-bottom: 16px;
}

.sign-up-form-wrapper .sign-up-form .submit-button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 13px;
    background: none;
    border-radius: 34px;
    background-color: var(--ui-accent-bg, #36ABBB);
    color: white;
}

.sign-up-form-wrapper .sign-up-form .submit-button:hover {
    color: white;
    -webkit-text-fill-color: white;
    filter: brightness(1);
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}

.sign-up-form-wrapper .sign-up-form .submit-button:focus {
    color: white;
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}
</style>