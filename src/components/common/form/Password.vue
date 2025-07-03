<template>
    <div class="password-wrapper">
        <div :class="`input-container ${invalidClassname}`">
            <input :class="invalidClassname" :type="visibleType" :name="name" @input="handleChange" :value="query"
                :placeholder="placeholder" />
            <button type="button" v-if="toggleMask" class="toggle-visibility-button" @click.stop="toggleVisibility">
                <img :src="toggleVisibilityButtonIconSrc" alt="toggle visibility icon">
            </button>
        </div>
        <AuthErrorText v-if="invalid" :label="validationMessage" />
    </div>
</template>

<script>
import { showPasswordPath, hidePasswordPath } from "@/utils/constants/constants";
import AuthErrorText from "./AuthErrorText.vue";

const INVALID_INPUT_CLASSNAME = "invalid";

export default {
    name: "Password",
    components: { AuthErrorText },
    props: {
        name: {
            type: String,
            required: true,
        },
        onChange: {
            type: Function,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            required: true,
        },
        invalid: {
            type: Boolean,
            required: false,
        },
        validationMessage: {
            type: String,
            required: false,
        },
        toggleMask: {
            type: Boolean,
            required: false,
        },
    },
    data() {
        return {
            query: this.value,
            isVisible: false,
            showPasswordPath,
            hidePasswordPath,
        };
    },
    methods: {
        handleChange(event) {
            this.onChange(event);
            this.query = event.target.value;
        },
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        },
    },
    computed: {
        invalidClassname() {
            return !this.invalid ? "" : INVALID_INPUT_CLASSNAME;
        },
        visibleType() {
            return !this.isVisible ? "password" : "text";
        },
        toggleVisibilityButtonIconSrc() {
            return !this.isVisible ? showPasswordPath : hidePasswordPath;
        },
    },
    watch: {
        invalid: {
            handler(newInvalid) {
                console.log("INVALID CHANGE: ", newInvalid);
            },
        },
        validationMessage: {
            handler(newValidationMessage) {
                console.log("VALIDATION MESSAGE CHANGE: ", newValidationMessage);
            },
        },
    },
}
</script>

<style scoped>
.password-wrapper {
    width: 100%;
}

.password-wrapper input {
    width: 100%;
    height: auto;
    font-size: 12px;
    background-color: var(--ui-fg-light, rgba(255, 255, 255, 0.07));
    border-radius: 34px;
    padding: 10px 16px;
    border: none;
    color: white;

    transition: 200ms ease-in-out;
}

.password-wrapper .input-container {
    position: relative;
    width: 100%;
}

.password-wrapper .input-container.invalid {
    margin-bottom: 16px;
}

.password-wrapper .input-container .toggle-visibility-button {
    position: absolute;
    top: 50%;
    right: 11px;
    transform: translateY(-50%);
    padding: 0;
    background: none;
    height: auto;
    border: none;
}

.password-wrapper .input-container .toggle-visibility-button:hover {
    outline: none;
    border: none;
    transform: translateY(-50%) scale(1.3);
}

.password-wrapper .input-container .toggle-visibility-button:focus {
    outline: none;
    border: none;
    transform: scale(1.1);
    transform: translateY(-50%) scale(1.3);
}

.password-wrapper .input-container input:hover {
    background-color: var(--ui-fg-very-light, rgba(255, 255, 255, 0.14));
}

.password-wrapper .input-container input:focus {
    background-color: var(--ui-fg-very-light, rgba(255, 255, 255, 0.14));
}

.password-wrapper .input-container input.invalid {
    border: 1px solid var(--ui-alert-text, #F27B7C);
}
</style>