<template>
  <div class="test-page">
    <h2>Test page</h2>
    <h3>Current component</h3>
    <div class="component-wrapper">
      <button @click="generateRandomString">generate random string</button>

      <!-- put here current component -->
    </div>
    <div v-if="true" class="other-components">
      <h3>Other components</h3>
      <div class="component-wrapper">
        <h4>CognitoTest</h4>
        <CognitoTest />
      </div>
      <div class="component-wrapper">
        <h4>Web3Auth</h4>
        <Web3Auth />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * This page is created to test various JG components. No login required to access this page
 */
import CognitoTest from "@/components/structure/cognito/CognitoTest.vue";
import Web3Auth from "@/components/structure/web3auth/Web3Auth.vue";
import cripto from "crypto";
export default {
  components: {
    CognitoTest,
    Web3Auth,
  },
  methods: {
    generateRandomString() {
      const state = crypto.randomUUID();
    },
  },
};
</script>

<style scoped>
.component-wrapper:not(:last-child) {
  margin-bottom: 15px;
}
</style>
