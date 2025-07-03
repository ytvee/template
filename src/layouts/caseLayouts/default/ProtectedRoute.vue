<template></template>

<script>
import storeModules from "@/data/store/storeModules.json";
import routerPaths from "@/data/router/path/routerPaths.json";
import AuthorizationService from "@/services/authorizationService";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
    name: "ProtectedRoute",
    methods: {
        ...mapMutations(storeModules.USER, ["updateUserSession", "resetSession"]),
        ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),
        async getSession() {
            if (this.isLoggedIn) {
                this.$router.push({ path: routerPaths.AICHAT });

                return;
            }

            try {
                await this.setIsLoading(true);

                const authSession =
                    await AuthorizationService.getCurrentAuthSession();

                this.updateUserSession(authSession);
            } catch (error) {
                console.error(error.message);

                this.resetSession();

                this.$router.push({ path: routerPaths.NEW_AUTHORIZATION });
            } finally {
                await this.setIsLoading(false);
            }
        },
    },
    created() {
        if (!this.isLoggedIn) {
            this.getSession();
        };
    },
    computed: {
        ...mapState(storeModules.USER, {
            isLoggedIn: (state) => state.isLoggedIn,
        }),
    },
}
</script>

<style></style>