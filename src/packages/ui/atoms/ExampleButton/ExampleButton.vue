<template>
  <button class="example-button" @click="$emit('click')">
    <slot>Button</slot>
  </button>
</template>

<script>
export default {
  name: "ExampleButton",
};
</script>

<style scoped>
.example-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #42b983;
  color: white;
  cursor: pointer;
}
</style>
