<template>
  <ExtendableContainer>
    <template #header> Select a city </template>
    <template #content>
      <div class="search-item">
        <input type="text" class="search" />
      </div>

      <div class="fieldset">
        <div v-for="item in optionsList" :key="item.id" class="filter-item">
          <input :id="item.id" v-model="checkedList" type="checkbox" class="checkbox" name="selectCityCheckBoxes" :value="item.id" />
          <label :for="item.id">{{ item.name }}</label>
        </div>
      </div>

      <div class="buttons-holder">
        <div>Show all</div>
        <div class="clear-button">Clear</div>
      </div>
    </template>
  </ExtendableContainer>
</template>

<script>
import ExtendableContainer from "@/components/common/navigation/dropdowns/ExtendableContainer.vue";
export default {
  name: "SelectCityFilter",
  components: {
    ExtendableContainer,
  },
  data() {
    return {
      optionsList: [
        { id: "4", name: "All cities" },
        { id: "5", name: "Seattle" },
        { id: "6", name: "New York" },
        { id: "7", name: "Los Angeles" },
        { id: "8", name: "Washington" },
        { id: "9", name: "Chicago" },
        { id: "11", name: "11th city" },
      ],
      checkedList: ["4"],
    };
  },
};
</script>
<style scoped>
.search-item {
  padding-bottom: 1.25rem;
}
.fieldset {
  padding-bottom: 1.25rem;
}
.filter-item {
  font-weight: var(--medium-font-weight);
}
.buttons-holder {
  display: flex;
  justify-content: space-between;
}
.buttons-holder > * {
  cursor: pointer;
  user-select: none;
  text-decoration: underline;

  font-size: var(--regular-font-size);
  font-weight: var(--large-font-weight);
}
.clear-button {
  color: var(--color-error);
}
</style>
