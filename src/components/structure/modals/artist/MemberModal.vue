<template>
  <div v-if="!waitingForResponse" class="artist-modal" :class="{ 'user-modal': !isEntityArtist }">
    <ProfileHeader :is-user-card="true" :is-creator-card="isEntityUser" :user="entity" />
    <div class="artist-modal-body">
      <div v-if="!isEntityArtist" class="roles-list">
        <h4>Roles</h4>
        <div class="role-tags-wrapper">
          <div v-if="!isEntityNotApproveUser" class="roles">
            <RoleTag v-for="tag in entity.tags.confirmed" :key="tag" :tag="tag" :is-active="true" :is-approve="true" :not-moderate="true" />
          </div>
          <div v-if="isEntityNotApproveUser" class="roles">
            <RoleTag v-for="tag in modalProps.user.tags.confirmed" :key="tag" :tag="tag" :is-active="true" :is-approve="true" :not-moderate="true" />
            <RoleTag v-for="tag in modalProps.user.tags.unconfirmed" :key="tag" :tag="tag" :is-active="true" :is-approve="false" @is-tag-active="handlerActiveTag" />
          </div>
        </div>
      </div>
      <div class="bio-holder">
        <h4>Bio</h4>
        <div class="bio"></div>
        <div v-if="entity.description" class="bio-wrapper">
          <div class="bio">
            {{ entity.description }}
          </div>
        </div>
        <h4 v-else class="read-more-wrapper">
          {{ messageStatus.NO_BIO_INFORMATION }}
        </h4>
      </div>
      <div v-if="isEntityMember" class="teams-memember-wrapper">
        <h4>Actual teams</h4>
        <TeamsList v-if="entity.memberships" :is-team-tab="true" :artists="entity.memberships" />
        <div v-else class="status-teams-container">
          <h4>{{ messageStatus.TEAMS_IS_EMPTY }}</h4>
        </div>
      </div>
      <div v-if="isEntityUser" class="links-wrapper">
        <h4>Links</h4>
        <div v-if="entity.links" class="links">
          <SocialLinksList :user-links="entity.links" />
        </div>
        <h4 v-else>{{ messageStatus.LINKS_IS_EMPTY }}</h4>
      </div>
      <div v-if="isEntityArtist" class="artist-info-wrapper">
        <div class="artist-gallery-wrapper">
          <h4>Photo</h4>
          <div v-if="modalProps.artist.images.length" class="artist-gallery">
            <ArtistModalGallery :images="entity.images" />
          </div>
          <h4 v-else class="empty-gallery">
            {{ messageStatus.GALLERY_IS_EMPTY }}
          </h4>
        </div>
        <div class="artist-teams-wrapper">
          <h4>Teams</h4>
          <div v-if="modalProps.artist.members.length" class="artist-teams">
            <UserPlugList class="artist-teams" :user-list="entity.members" />
          </div>
          <h4 v-else class="empty-teams">{{ messageStatus.NO_TEAMS }}</h4>
        </div>
      </div>
      <div v-if="isEntityApproved && (isEntityUser || isEntityArtist)" class="accept-button-wrapper">
        <div class="button decline ban-button" @click="banEntity(entity.id)">Ban</div>
      </div>
      <div v-if="!isEntityApproved && !isEntityMember" class="accept-button-wrapper">
        <div class="button large decline decline-button" @click="declineRequestCreator()">Decline</div>
        <div class="button large accept-button" :class="{ disabled: isEntityUser && confirmedTags.length === 0 }" @click="acceptRequest()">Accept</div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileHeader from "@/components/common/headers/ProfileHeader.vue";
import RoleTag from "@/components/structure/roleForm/acceptPerson/RoleTag.vue";
import TeamsList from "@/components/structure/user/artist/team/TeamsList.vue";
import UserPlugList from "@/components/common/info/UserPlug/UserPlugList.vue";
import ArtistModalGallery from "@/components/structure/user/general/userGallery/ArtistModalGallery.vue";
import DeclineEntityModal from "@/components/structure/modals/artist/DeclineEntityModal.vue";
import SocialLinksList from "@/components/common/info/socialLinks/SocialLinksList.vue";
import messageStatus from "@/data/navbar/message/messageStatus.json";
import entityTypes from "@/data/user/entityTypes.json";
import { mapState, mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";

export default {
  name: "MemberModal",
  components: {
    ProfileHeader,
    RoleTag,
    TeamsList,
    UserPlugList,
    ArtistModalGallery,
    SocialLinksList,
  },
  props: {
    modalProps: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:unapproveEntity"],
  data() {
    return {
      entityTypes: entityTypes,
      entity: {},
      claimID: "",
      confirmedTags: [],
      messageStatus,
      waitingForResponse: false,
    };
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modal: (state) => state.modal,
    }),
    isEntityApproved() {
      return this.modalProps.isApprove;
    },
    isEntityArtist() {
      return this.modalProps.memberType === this.entityTypes.TYPE_ARTIST_APPROVE;
    },
    isEntityNotApproveUser() {
      return this.modalProps.memberType === this.entityTypes.TYPE_USER_APPROVE;
    },
    isEntityUser() {
      return this.modalProps.memberType === this.entityTypes.TYPE_USER;
    },
    isEntityMember() {
      return this.modalProps.memberType === this.entityTypes.TYPE_MEMBER;
    },
    declineModalProps() {
      return {
        displayedComponent: DeclineEntityModal,
        displayedComponentProps: {
          entityName: this.entity.name,
          claimID: this.claimID,
          entityType: this.modalProps.memberType,
        },
      };
    },
  },
  async created() {
    if (!this.isEntityArtist && !this.isEntityNotApproveUser) {
      await this.getUserById();
    }
  },
  mounted() {
    switch (this.modalProps.memberType) {
      case entityTypes.TYPE_ARTIST_APPROVE:
        this.entity = this.modalProps.artist;
        this.claimID = this.modalProps.artist.id;
        break;
      case entityTypes.TYPE_USER_APPROVE:
        this.waitingForResponse = true;
        this.entity = this.modalProps.user;
        this.claimID = this.modalProps.claimID;
        this.confirmedTags = [...this.modalProps.user.tags.unconfirmed];
        this.waitingForResponse = false;
        break;
      default:
        console.error("this.modalProps", this.modalProps.memberType);
    }
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    declineRequestCreator() {
      this[modalActions.SET_MODAL](this.declineModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    async getUserById() {
      this.waitingForResponse = true;
      await this.$load(async () => {
        const {
          data: { data: resdata },
        } = await this.$api.user.getUserById(this.modalProps.id);
        this.entity = resdata.user;
        if (this.isEntityMember) {
          this.entity.memberships = resdata.memberships;
        }
        this.waitingForResponse = false;
      });
    },
    async getArtistById() {
      await this.$load(async () => {
        const { data: resdata } = await this.$api.artist.getArtist(this.modalProps.id);
        this.entity = resdata?.data?.artist;
      });
    },
    acceptRequest() {
      if (this.isEntityArtist) {
        this.acceptRequestArtist();
      } else if (this.isEntityNotApproveUser) {
        this.acceptRequestCreator();
      }
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    async acceptRequestCreator() {
      const payload = {
        claim_id: this.claimID,
        confirmed_tags: this.confirmedTags,
      };
      await this.$load(async () => {
        await this.$api.user.confirmCreator(payload);
        this.$eventBus.emit("updated-unapprove-creators");
      });
    },
    async acceptRequestArtist() {
      const payload = {
        artist_id: this.claimID,
      };
      await this.$load(async () => {
        await this.$api.user.confirmArtist(payload);
        this.$eventBus.emit("updated-unapprove-artists");
      });
    },
    banEntity(id) {
      if (this.isEntityArtist) {
        this.banArtist(id);
      }
      if (this.isEntityUser) {
        this.banUser(id);
      }
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    banUser(id) {
      this.$load(
        async () => {
          await this.$api.user.deleteUser(id);
          this.$eventBus.emit("updated-creators");
        },
        null,
        false
      );
    },
    banArtist(id) {
      this.$load(
        async () => {
          await this.$api.user.deleteArtist(id);
          this.$eventBus.emit("updated-artists");
        },
        null,
        false
      );
    },
    editEntity() {
      console.log("Edit entity imitation");
    },
    handlerActiveTag(tagStateActive, tag) {
      const index = this.confirmedTags.indexOf(tag);
      if (tagStateActive && index === -1) {
        this.confirmedTags.push(tag);
      } else {
        this.confirmedTags.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped>
.artist-modal {
  max-width: 870px;
  border-radius: var(--medium-border-radius);
  /* max-height: 740px; */
  padding: 5px;
  overflow: auto;
  box-sizing: border-box;
  background: var(--color-dark);
}

.user-modal {
  width: 410px;
}

.artist-modal-body {
  padding: 25px;
  padding-top: 0;
}

h4 {
  margin-bottom: 10px;
}

.bio-holder,
.roles-list,
.artist-gallery-wrapper,
.artist-teams-wrapper,
.links-wrapper {
  margin-bottom: 25px;
}

.bio {
  color: var(--color-light);
  max-height: 350px;
  display: -webkit-box;
  overflow: auto;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
}

.artist-teams {
  height: 300px;
  overflow: auto;
}

.links {
  max-height: 190px;
  overflow: auto;
  scroll-snap-type: both mandatory;
}
.artist-info-wrapper {
  display: grid;
  grid-template-columns: 49% 49%;
  gap: 2%;
}

.role-tags-wrapper .roles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--smallest-block-gap);
}

.accept-button-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 40px;
  margin-bottom: 20px;
}
</style>
