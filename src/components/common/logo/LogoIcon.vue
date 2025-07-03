<template>
    <div class="logo-icon">
        <img :src="authorizationLogoPath" alt="Deep Noise" class="logo-image" :width="width">
    </div>
</template>

<script>
import { authorizationLogoPath } from '@/utils/constants/constants';

const DEFAULT_LOGO_ICON_WIDTH = "94px";

export default {
    name: "LogoIcon",
    props: {
        width: {
            type: String,
            required: false,
            default: DEFAULT_LOGO_ICON_WIDTH,
        },
    },
    data() {
        return {
            authorizationLogoPath
        }
    }
}
</script>

<style></style>