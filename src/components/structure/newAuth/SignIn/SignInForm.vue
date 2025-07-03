<template>
    <div class="sign-in-form-wrapper">
        <form class="sign-in-form" @submit="handleSubmit">
            <div class="inputs-container">
                <InputText :name="FormValidationsFieldsIds.EMAIL" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.EMAIL]" placeholder="Email"/>
                <Password :name="FormValidationsFieldsIds.PASSWORD" :onChange="handleFormChange"
                    :value="values[FormValidationsFieldsIds.PASSWORD]" placeholder="Password" toggleMask />
            </div>
            <div v-if="error" class="error-container">
                <AuthErrorText :label="error" />
            </div>
            <button class="submit-button" type="submit" :disabled="isEmptyField">{{ `Sign in` }}</button>
        </form>
    </div>
</template>

<script>
import storeModules from "@/data/store/storeModules.json";
import Password from "@/components/common/form/Password.vue";
import routerPaths from "@/data/router/path/routerPaths.json";
import FormValidationMixin from "@/mixins/FormValidationMixin";
import InputText from "@/components/common/form/InputText.vue";
import AuthorizationService from "@/services/authorizationService";
import AuthErrorText from "@/components/common/form/AuthErrorText.vue";
import { signInValidationConfig, FormValidationsFieldsIds } from '@/utils/constants/constants';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: "SignInForm",
    components: { InputText, Password, AuthErrorText },
    mixins: [FormValidationMixin],
    data: {
        validationConfig: signInValidationConfig,
        error: "",
        FormValidationsFieldsIds,
    },
    methods: {
        ...mapMutations(storeModules.USER, ["updateUserSession"]),
        ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),
        handleFormChange(event) {
            this.error = "";
            this.handleChange(event);
        },
        async handleSubmit(event) {
            event.preventDefault();

            try {
                await this.setIsLoading(true);

                const authSession = await AuthorizationService.signIn(
                    {
                        email: this.values[FormValidationsFieldsIds.EMAIL],
                        password: this.values[FormValidationsFieldsIds.PASSWORD],
                    }
                );

                this.updateUserSession(authSession);

                this.$router.push({ path: routerPaths.AICHAT });
            } catch (error) {
                this.error = error.message;
            } finally {
                await this.setIsLoading(false);
            }
        },
    },
    computed: {
        isEmptyField() {
            return !this.values[FormValidationsFieldsIds.EMAIL] ||
                !this.values[FormValidationsFieldsIds.PASSWORD];
        }
    }
}
</script>

<style scoped>
.sign-in-form-wrapper .sign-in-form {
    width: 100%;
}

.sign-in-form-wrapper .sign-in-form .inputs-container {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sign-in-form-wrapper .sign-in-form .error-container {
    margin-bottom: 16px;
}

.sign-in-form-wrapper .sign-in-form .submit-button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 13px;
    background: none;
    border-radius: 34px;
    background-color: var(--ui-accent-bg, #36ABBB);
    color: white;
}

.sign-in-form-wrapper .sign-in-form .submit-button:hover {
    color: white;
    -webkit-text-fill-color: white;
    filter: brightness(1);
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}

.sign-in-form-wrapper .sign-in-form .submit-button:focus {
    color: white;
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}
</style>