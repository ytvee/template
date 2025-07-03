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

        <div
          class="field-with-validation"
          :class="{ errored: password.isAccessed && !password.value }"
        >
          <label for="new-password"> New password </label>
          <input
            id="new-password"
            v-model="password.value"
            type="password"
            placeholder="Enter new password"
            @blur="password.isAccessed = true"
            @input="password.isAccessed = true"
          />
          <div v-show="password.isAccessed" class="input-errors-holder">
            <span v-if="!password.value" class="error-message"
              >Please enter your password</span
            >
          </div>
        </div>
        <div
          class="field-with-validation"
          :class="{ errored: rePassword.isAccessed && password.value !== rePassword.value }"
        >
          <label for="re-password"> Confirm password </label>
          <input
            id="re-password"
            v-model="rePassword.value"
            type="password"
            placeholder="Confirm password"
            @blur="rePassword.isAccessed = true"
            @input="rePassword.isAccessed = true"
          />
          <div v-show="rePassword.isAccessed" class="input-errors-holder">
            <span v-if="password.value !== rePassword.value" class="error-message"
              >Passwords do not match</span
            >
          </div>
        </div>
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
import { DialogTemplateNames } from "@/data/modal/constants";
import { cognitoMessages } from "@/data/cognito/constants";

const errorMessages = {
  EMPTY_CONFRIMATION_CODE: "Please enter the code from email",
};
export default {
  name: "FillUserNameModal",
  components: {
    CloseModalButton,
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
        value: "",
        isAccessed: false,
      },
      rePassword: {
        value: "",
        isAccessed: false,
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
      return (
        this.resetPasswordConfirmationCode.value &&
        this.password.value &&
        this.password.value === this.rePassword.value
      );
    },
  },
  methods: {
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
