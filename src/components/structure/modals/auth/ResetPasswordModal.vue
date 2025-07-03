<template>
  <div class="fill-user-name-modal modal-dialog">
    <form>
      <div class="modal-dialog-title">
        <div class="input-holder">
          <h3>Password reset</h3>
        </div>
        <CloseModalButton />
      </div>
      <div class="modal-dialog-content">
        <div class="field-with-validation" :class="{ errored: resetPasswordConfirmationCode.isAccessed && !resetPasswordConfirmationCode.value }">
          <label
            >Code from <span class="text-gradient-accent">{{ modalProps.email }}</span> Email</label
          >
          <input v-model="resetPasswordConfirmationCode.value" type="text" placeholder="Enter reset password confirmation code from email" @blur="resetPasswordConfirmationCode.isAccessed = true" @input="resetPasswordConfirmationCode.isAccessed = true" />
          <div v-show="resetPasswordConfirmationCode.isAccessed" class="input-errors-holder">
            <span v-for="(error, index) in resetPasswordConfirmationCodeErrors" :key="index" class="error-message">{{ error }}</span>
          </div>
        </div>

        <PasswordWithRePassword :email-value="modalProps.email" @password-validated="passwordValidatedHandler" />
      </div>
      <div class="buttons-holder">
        <button :disabled="!isFormContentValid" class="large" @click.prevent="confirmNewPassword">Confirm new password</button>
      </div>
    </form>
  </div>
</template>

<script>
import { confirmResetPassword } from "aws-amplify/auth";
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import PasswordWithRePassword from "../../auth/signupwithpasswordform/PasswordWithRePassword.vue";
import { DialogTemplateNames } from "@/data/modal/constants";
import { cognitoMessages } from "@/data/cognito/constants";

const errorMessages = {
  EMPTY_CONFRIMATION_CODE: "Please enter the code from email",
};
export default {
  name: "FillUserNameModal",
  components: {
    CloseModalButton,
    PasswordWithRePassword,
  },
  props: {
    modalProps: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      resetPasswordConfirmationCode: {
        value: "",
        isAccessed: false,
      },
      password: {
        isValid: false,
        value: "",
      },
    };
  },
  computed: {
    resetPasswordConfirmationCodeErrors() {
      let resetPasswordConfirmationCodeErrorsArray = [];
      if (this.resetPasswordConfirmationCode.value === "") {
        resetPasswordConfirmationCodeErrorsArray.push(errorMessages.EMPTY_CONFRIMATION_CODE);
      }
      return resetPasswordConfirmationCodeErrorsArray;
    },
    isFormContentValid() {
      return this.resetPasswordConfirmationCode.value && this.password.isValid;
    },
  },
  methods: {
    passwordValidatedHandler({ isPasswordValid, password }) {
      this.password.isValid = isPasswordValid;
      this.password.value = password;
    },
    async confirmNewPassword() {
      await this.$load(async () => {
        await confirmResetPassword({
          username: this.modalProps.email,
          newPassword: this.password.value,
          confirmationCode: this.resetPasswordConfirmationCode.value,
        });
        this.$modal.openModalWithName(DialogTemplateNames.INFORMATION_MESSAGE, { message: cognitoMessages.INFO.RESET_PASSWORD_PASSWORD_RESET_SUCCESS });
      });
    },
  },
};
</script>

<style scoped>
.modal-dialog {
  --modal-dialog-padding: 50px;
  width: 1000px;
  max-width: 70vw;
  border-radius: var(--medium-border-radius);
  background: var(--color-dark);
  padding: var(--modal-dialog-padding);
  color: var(--color-gray);
}

.modal-dialog-title {
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--medium-block-gap);
}

.modal-dialog-content {
}

.fill-user-name-modal {
  width: calc(var(--modal-dialog-padding) * 2 + var(--width-auth-form));
}

.field-with-validation {
  position: relative;
  margin-bottom: 18px;
}
.field-with-validation.errored input[type="text"],
.field-with-validation.errored input[type="password"],
.field-with-validation.errored input[type="email"] {
  border: 2px solid var(--color-error);
  color: var(--color-error);
}
.field-with-validation label {
  display: block;
  margin-bottom: 5px;
}

.input-holder {
  margin-bottom: 0.5rem;
}

.input-holder > input {
  font-size: var(--medium-font-size-2);
  font-weight: var(--medium-font-weight);
}
.input-holder > input::placeholder {
  color: var(--color-gray-medium);
}
.input-holder.error > input {
  border-color: var(--color-error);
}
.input-errors-holder {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  color: var(--color-error);
  font-size: var(--regular-font-size);
  font-weight: var(--medium-font-weight);
}
.error-message {
  position: absolute;
  display: block;
}

.buttons-holder {
  display: flex;
  justify-content: flex-end;
}
.buttons-holder > button.large {
  width: unset;
}
</style>
