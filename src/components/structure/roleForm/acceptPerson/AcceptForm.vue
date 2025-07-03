<template>
  <div class="accept-person-form-holder">
    <div class="content-holder">
      <div class="username-holder">
        <h3>{{ username }}</h3>
      </div>
      <RolesList />
      <SocialLinksList />
    </div>
    <div class="buttons-holder">
      <button class="large">Decline</button>
      <button class="large">Accept</button>
    </div>
  </div>
</template>

<script>
import RolesList from "@/components/structure/roleForm/acceptPerson/RolesList";
import SocialLinksList from "@/components/structure/roleForm/acceptPerson/SocialLinksList";
export default {
  name: "AcceptForm",
  components: {
    RolesList,
    SocialLinksList,
  },
  data() {
    return {
      username: "Nina Kraviz",
    };
  },
};
</script>

<style scoped>
.accept-person-form-holder {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--gradient-card-dark);
  width: 400px;
  border-radius: var(--medium-border-radius);
}

.content-holder {
  width: 100%;
}

.username-holder h3 {
  margin-bottom: 20px;
}

.buttons-holder {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

/* temp */
button {
  width: 140px !important;
  height: 40px !important;
  line-height: 40px;
}
</style>
