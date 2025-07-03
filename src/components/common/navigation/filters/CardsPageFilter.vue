<template>
  <div class="main-artist-filter-holder">
    <div class="artist-filter-holder">
      <div class="search-holder">
        <input v-model="artistName" type="text" class="search" />
      </div>
      <div class="artist-type-filter-holder">
        <div v-for="box in checkbox" :key="box.id" class="filter-items">
          <input :id="box.id" v-model="artistType" class="checkbox" :value="box.value" type="checkbox" />
          <label :for="box.id">{{ box.label }}</label>
        </div>
      </div>
      <button class="search-button outlined" @click="searchArtist">search</button>
    </div>
  </div>
</template>

<script>
import checkboxFilter from "@/data/navbar/filter/checkboxFilter.json";

export default {
  data() {
    return {
      checkbox: checkboxFilter,
      artistName: "",
      artistType: [],
    };
  },
  computed: {
    artistsParams() {
      //Axios requires a single string if one and an Arrray of strings if many
      const artistTypes = this.artistType.length === 1 ? this.artistType[0] : this.artistType;
      return {
        query: this.artistName,
        types: artistTypes,
      };
    },
  },
  methods: {
    searchArtist() {
      this.$eventBus.emit("passParametersFilter", this.artistsParams);
    },
  },
};
</script>
<style scoped>
.main-artist-filter-holder {
  margin-bottom: 30px;
}

.artist-filter-holder {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.artist-type-filter-holder {
  display: flex;
  align-items: center;
  user-select: none;
  margin-left: 70px;
}

.filter-items {
  margin-right: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected {
  color: var(--color-accent-primary);
}

.filter-items label {
  padding-left: 35px;
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  letter-spacing: var(--app-letter-spacing);
}
.search-holder {
  display: flex;
  justify-items: center;
  align-items: center;
}
.search-button {
  width: 140px;
  height: 45px;
  margin-left: 25px;
}
.search {
  max-width: 400px;
}
</style>
