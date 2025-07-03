<template>
  <div class="fill-user-name-modal modal-dialog">
    <div class="modal-dialog-title">
      <div class="input-holder">
        <h3>Enter your name</h3>
      </div>
    </div>
    <div class="modal-dialog-content">
      <div class="input-holder" :class="{ error: !isInputValid }">
        <input v-model="userName" type="text" placeholder="Enter your name" />
      </div>
      <div class="error-list-holder">
        <div v-for="(error, index) in displaingErrorList" :key="index">{{ error.message }}</div>
      </div>
    </div>
    <div class="buttons-holder">
      <button :disabled="!isFormContentValid" class="large" @click="saveNameHandler">Save changes</button>
    </div>
  </div>
</template>

<script>
import storeModules from "@/data/store/storeModules.json";
import { mapActions } from "vuex";

const INPUT_ERRORS = {
  EMPTY_NAME: {
    name: "EMPTY_NAME",
    message: "Name cannot be empty!",
  },
};
export default {
  name: "FillUserNameModal",
  data() {
    return {
      userName: "",
      errorList: [],
      displaingErrorList: [],
      isFirstCheck: true,
    };
  },
  watch: {
    userName: {
      handler(newUserName) {
        this.errorList = [];
        this.displaingErrorList = [];
        if (!newUserName) {
          this.errorList.push(INPUT_ERRORS.EMPTY_NAME);
        }
        if (!this.isFirstCheck) {
          this.displaingErrorList = [...this.errorList];
        }
        this.isFirstCheck = false;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(storeModules.USER, ["editUser"]),
    async saveNameHandler() {
      await this.$load(async () => {
        const payload = {
          user: {
            name: this.userName,
          },
        };
        try {
          await this.editUser(payload);
          this.$modal.close();
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    },
  },
  computed: {
    isInputValid() {
      return !this.displaingErrorList.length;
    },
    isFormContentValid() {
      return !this.errorList.length;
    },
  },
};
</script>

<style scoped>
.modal-dialog {
  width: 1000px;
  max-width: 70vw;
  border-radius: var(--medium-border-radius);
  background: var(--color-dark);
  padding: 50px;
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
.error-list-holder {
  min-height: 20px;
  display: flex;
  gap: var(--regular-block-gap);
  color: var(--color-error);
}

.buttons-holder {
  display: flex;
  justify-content: flex-end;
}

.buttons-holder > button.large {
  width: unset;
}
</style>
