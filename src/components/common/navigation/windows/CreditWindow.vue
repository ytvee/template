<template>
    <div class="credit-window" @click.stop>
        <div class="credit-data">
            <div class="header">
                <span class="secondary-half-text">CREDITS</span>
                <div class="additional-info">
                    <img src="/assets/navbar/additionalInfo.svg" alt="additional info icon">
                    <span class="primary-small-text">1 prompt = 1 credit</span>
                </div>
            </div>
            <span :class="`balance primary-big-text ${balanceColorClassname}`">
                {{ balance }}
            </span>
            <div class="premium-section-header">
                <span class="secondary-half-text">MEMBERSHIP</span>
                <span class="primary-text">Free</span>
            </div>
            <button autofocus class="get-premium-button" @click.stop="handleGetPremium">Get Premium</button>
        </div>
        <hr class="section-separator" />
        <div class="account-data">
            <div class="header">
                <span class="secondary-half-text">ACCOUNT</span>
                <span class="email primary-text">{{ email }}</span>
            </div>
            <InlineAction class="primary-text" :onClick="handleLogout" label="Logout"
                fontColor="rgba(255,255,255,0.6)" />
        </div>
    </div>
</template>

<script>
import InlineAction from '../../action/InlineAction.vue';
import storeModules from "@/data/store/storeModules.json";
import routerPaths from "@/data/router/path/routerPaths.json";
import AuthorizationService from '@/services/authorizationService';
import { mapState, mapMutations, mapActions } from 'vuex';

const NOT_LOADED_BALANCE_COLOR_CLASSNAME = "not-loaded";

export default {
    name: "CreditWindow",
    components: { InlineAction },
    props: {
        onClose: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            balance: 0,
            balanceColorClassname: NOT_LOADED_BALANCE_COLOR_CLASSNAME,
        };
    },
    methods: {
        ...mapMutations(storeModules.USER, ["resetSession"]),
        ...mapActions(storeModules.APPLICATION, ["setIsLoading"]),
        handleBuy() {
            console.log("YOU BOUGHT!");
        },
        handleGetPremium() {
            console.log("YOU GET PREMIUM!");
        },
        async handleLogout() {
            try {
                await this.setIsLoading(true);

                await AuthorizationService.signOut();

                this.resetSession();
                this.$router.push({ path: routerPaths.NEW_AUTHORIZATION });
            } catch (error) {
                console.error("SignOut error: ", error.message);
            } finally {
                await this.setIsLoading(false);
            }
        },
    },
    created() {
        document.addEventListener("click", this.onClose);
    },
    computed: {
        ...mapState(storeModules.USER, {
            email: (state) => state.currentUser.email,
        }),
    },
    watch: {
        balance: {
            handler(newBalance) {
                this.balanceColorClassname = !newBalance ? NOT_LOADED_BALANCE_COLOR_CLASSNAME : "";
            },
        },
    },
    beforeUnmount() {
        document.removeEventListener("click", this.onClose);
    },
}
</script>

<style scoped>
.credit-window {
    background: var(--credit-window-gradient, linear-gradient(to bottom right, rgb(62, 62, 62), rgb(99, 95, 95)));
    z-index: 50;
    position: absolute;
    left: 70px;
    width: 220px;
    bottom: 0;
    border-radius: 18px;
    padding: 16px 20px;
    box-shadow: var(--modal-shadow, 0px 2px 2px rgba(0, 0, 0, 0.10), 0px 4px 4px rgba(0, 0, 0, 0.11), 0px 10px 19px rgba(0, 0, 0, 0.20));
}

.credit-window .credit-data {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;
    margin-bottom: 16px;
}

.credit-window .credit-data .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    gap: 14px;
}

.credit-window .credit-data .header .additional-info {
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
}

.credit-window .credit-data .balance {
    color: var(--color-light, #ffffff);
    margin-bottom: 8px;
}

.credit-window .credit-data .balance.not-loaded {
    color: var(--ui-alert-text, #F27B7C);
}

.credit-window .credit-data .premium-section-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
}

.credit-window .credit-data .get-premium-button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 13px;
    background: none;
    border-radius: 34px;
    background-color: var(--ui-accent-bg, #36ABBB);
    color: var(--color-light, #ffffff);
}

.credit-window .credit-data .get-premium-button:hover {
    color: var(--color-light, #ffffff);
    -webkit-text-fill-color: var(--color-light, #ffffff);
    filter: brightness(1);
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}

.credit-window .credit-data .get-premium-button:focus {
    color: var(--color-light, #ffffff);
    background-color: var(--ui-accent-hover-bg, #43d2e5);
    transform: scale(1);
}

.credit-window .account-data .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
}

.credit-window .section-separator {
    border: 1px solid var(--ui-highlight-bg, rgba(255, 255, 255, 0.1));
    margin-bottom: 16px;
}

.primary-text {
    font-size: 11px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.03em;
    overflow-wrap: break-word;
    color: var(--color-light, #ffffff);
}

.primary-big-text {
    font-family: var(--chat-font-family, "Wix Madefor Text", sans-serif);
    font-size: 24px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0em;
    overflow-wrap: break-word;
}

.primary-small-text {
    font-size: 10px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.03em;
    color: var(--ui-text-strong, rgba(255, 255, 255, 0.7));
}

.secondary-half-text {
    font-size: 11px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.03em;
    overflow-wrap: break-word;
    color: var(--ui-text-half, rgba(255, 255, 255, 0.4));
}
</style>