<template>
  <div class="filter-element">
    <div ref="filtersContainer" class="filters-container">
      <SortByFilter />
      <div class="filter-divider" />
      <SelectCityFilter />
    </div>
  </div>
</template>

<script>
import SortByFilter from "@/components/common/navigation/filters/SortByFilter.vue";
import SelectCityFilter from "@/components/common/navigation/filters/SelectCityFilter.vue";
export default {
  name: "FilterElement",
  components: {
    SortByFilter,
    SelectCityFilter,
  },
};
</script>

<style scoped>
.filter-element {
  margin-top: 0.3125rem;
  margin-left: 1rem;
}

.filters-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.filter-divider {
  width: 100%;
  height: 1px;
  background: var(--gradient-primary);
}
</style>
