<template>
    <div class="auth-error-text">{{label}}</div>
</template>

<script>

export default {
    name: "InputText",
    props: {
        label: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
.auth-error-text {
    width: 100%;

    font-size: 11px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0em;
    overflow-wrap: break-word;
    color: var(--ui-alert-text, #F27B7C);
    text-align: left;
}
</style>