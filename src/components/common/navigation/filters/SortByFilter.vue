<template>
  <ExtendableContainer>
    <template #header> Sort by </template>
    <template #content>
      <div v-for="item in optionsList" :key="item.id" class="filter-item">
        <input :id="item.id" v-model="picked" type="radio" class="radiobtn" name="sortByRadioButtons" :value="item.id" />
        <label :for="item.id">{{ item.name }}</label>
      </div>
    </template>
  </ExtendableContainer>
</template>

<script>
import ExtendableContainer from "@/components/common/navigation/dropdowns/ExtendableContainer.vue";
export default {
  name: "SortByFilter",
  components: {
    ExtendableContainer,
  },
  data() {
    return {
      optionsList: [
        { id: "0", name: "By relevance" },
        { id: "1", name: "By date" },
        { id: "2", name: "By popularity" },
      ],
      picked: "0",
    };
  },
  methods: {
    isChecked(id) {
      return id === this.checkedId;
    },
  },
};
</script>
<style>
.filter-item {
  margin-bottom: 0.9375rem;
  font-weight: var(--medium-font-weight);
}
</style>
