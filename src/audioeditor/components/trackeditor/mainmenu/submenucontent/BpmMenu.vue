<template>
  <div class="bpm-menu">
    <p class="subtitle">BPM</p>
    <div class="container">
      <div class="container-button audio-editor-button" @click="changeBpm('-')">
        <span class="colored-text">-</span>
      </div>
      <div class="gradient-bordered-button">
        <span class="gradient-bordered-button-content" :data-after="currentBPM">
          {{ currentBPM }}
        </span>
      </div>

      <div class="container-button audio-editor-button" @click="changeBpm('+')">
        <span class="colored-text">+</span>
      </div>
    </div>
    <div class="reset-bpm-button" @click="resetHandle()">Reset</div>
  </div>
</template>

<script>
export default {
  name: "BpmMenu",
  data() {
    return {
      currentBPM: 120,
    };
  },
  methods: {
    changeBpm(sign) {
      sign === "+" ? this.currentBPM++ : this.currentBPM--;
    },
    resetHandle() {
      this.currentBPM = 120;
    },
  },
};
</script>

<style scoped>
.bpm-menu {
  font-size: var(--very-large-font-size);
  width: 150px;
  margin: 10px auto;
}
.subtitle,
.colored-text {
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  margin-top: 0px;
  margin-bottom: 0;

  color: red;
  text-align: center;

  background: green;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px auto;
}
.container-button {
  margin: auto;
  color: red;
}
.audio-editor-button {
  cursor: pointer;
}
.reset-bpm-button {
  text-align: center;
  margin: 10px 0;
  cursor: pointer;
}
.gradient-bordered-button {
  display: flex;
  justify-content: center;
  height: 30px;
  border-radius: var(--audio-editor-default-border-radius);
  position: relative;
  cursor: text;
  margin: 5px 5px;
  width: 83px;
}
.gradient-bordered-button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--audio-editor-default-border-radius);
  padding: 1px;
  background: red;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) 0 content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 1;
  transition: opacity var(--default-transition);
}

.gradient-bordered-button .gradient-bordered-button-content {
  background: red;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}
.colored-text:hover {
  opacity: 1;
  transition: var(--default-transition);
}
</style>
