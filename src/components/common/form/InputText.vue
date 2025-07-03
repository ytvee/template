<template>
    <div class="input-text-wrapper">
        <div :class="`input-container ${invalidClassname}`">
            <input :class="invalidClassname" :type="type" :name="name" @input="handleChange" :value="query"
                :placeholder="placeholder" />
        </div>
        <AuthErrorText v-if="invalid" :label="validationMessage" />
    </div>
</template>

<script>
import AuthErrorText from "./AuthErrorText.vue";

const INVALID_INPUT_CLASSNAME = "invalid";

export default {
    name: "InputText",
    components: { AuthErrorText },
    props: {
        type: {
            type: String,
            required: false,
        },
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
    },
    data() {
        return {
            query: this.value,
        };
    },
    methods: {
        handleChange(event) {
            this.onChange(event);
            this.query = event.target.value;
        },
    },
    computed: {
        invalidClassname() {
            return !this.invalid ? "" : INVALID_INPUT_CLASSNAME;
        }
    }
}
</script>

<style scoped>
.input-text-wrapper {
    width: 100%;
}

.input-text-wrapper .input-container.invalid {
    margin-bottom: 16px;
}

.input-text-wrapper .input-container input {
    width: 100%;
    font-size: 12px;
    background-color: var(--ui-fg-light, rgba(255, 255, 255, 0.07));
    border-radius: 34px;
    padding: 10px 16px;
    border: none;
    color: white;

    transition: 200ms ease-in-out;
}

.input-text-wrapper .input-container input:hover {
    background-color: var(--ui-fg-very-light, rgba(255, 255, 255, 0.14));
}

.input-text-wrapper .input-container input:focus {
    background-color: var(--ui-fg-very-light, rgba(255, 255, 255, 0.14));
}

.input-text-wrapper .input-container input.invalid {
    border: 1px solid var(--ui-alert-text, #F27B7C);
}
</style>