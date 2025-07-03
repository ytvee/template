<template>
  <div class="search-item">
    <input class="search" type="search" @blur="isDropdownVisible = false" @focus="isDropdownVisible = true" />
    <HexagonDropDownList v-show="isDropdownVisible" />
  </div>
</template>

<script>
import HexagonDropDownList from "@/components/common/navigation/dropdowns/HexagonDropDownList.vue";
export default {
  name: "SearchArea",
  components: {
    HexagonDropDownList,
  },
  data() {
    return {
      isDropdownVisible: false,
      isDropdownInput: false,
    };
  },
};
</script>

<style>
.search-item {
  margin-right: auto;
  flex: auto;
  max-width: 400px;
  min-width: 100px;
  position: relative;
}

.search-item input {
  border-color: var(--color-gray-medium);
}
</style>
