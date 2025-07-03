<template>
  <div class="terms-use-holder">
    <div class="terms-use-title-holder">
      <h2>Terms of Use</h2>
      <CloseModalButton />
    </div>
    <div class="terms-use-content">
      The user agreement for the website (hereinafter referred to as the "Agreement") is a special type of agreement between the website and its users regarding the procedure for its use, and also determines the obligations of the parties and their responsibilities.
      <br />
      <br />
      This document helps users (1) understand their acceptable uses of the website; (2) determine the possible consequences of using the website in any way; (3) designate the measures of responsibility applicable to users for violation of the established rules.
      <br />
      <br />
      The agreement is nothing more than the rules of the game for the website and the user, in view of this, the value of this document is difficult to overestimate. Once the user agrees to the terms of the Agreement (for example, by checking the box provided or by creating a personal account), the terms of this Agreement are legally binding on the user. Thus, violation of the terms of the Agreement by the user inevitably entails the application to such user of the types of liability provided for by such an Agreement.
      <br />
      <br />
      The proposed document template is suitable for websites of any kind, for example, an online store, online marketplace, social network, blog, business, entertainment and gambling, media (magazines), etc. Please note that this document cannot be used for mobile applications (you can use the Mobile Application User Agreement) or cloud platforms (you can use the Cloud Platform User Agreement).
      <br />
      <br />
      The User Agreement should not be identified with the Privacy Policy (a document defining the procedure for collecting and processing users' personal data), since the latter focuses solely on the methods, methods, terms and purposes of processing and collecting personal data.
      <br />
      <br />
      The User Agreement should not be identified with the Privacy Policy (a document defining the procedure for collecting and processing users' personal data), since the latter focuses solely on the methods, methods, terms and purposes of processing and collecting personal data.
    </div>
  </div>
</template>

<script>
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";

export default {
  name: "TermsUse",
  components: {
    CloseModalButton,
  },
};
</script>

<style scoped>
.terms-use-holder {
  max-width: 750px;
  padding: 50px;
  background: var(--color-dark);
  border-radius: var(--medium-border-radius);
}

.terms-use-title-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: var(--color-gray);
}

.close-button {
  cursor: pointer;
}

.close-button:hover svg path {
  opacity: 50%;
}

.close-button:active svg path {
  opacity: 30%;
}

.terms-use-content {
  font-size: var(--regular-font-size);
  font-weight: var(--regular-font-weight);
  overflow: auto;
  max-height: 520px;
  color: var(--color-gray);
  user-select: none;
  padding-right: var(--default-padding);
}
</style>
