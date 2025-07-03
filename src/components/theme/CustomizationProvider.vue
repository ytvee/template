<!-- eslint-disable-next-line -->
<template><div class="provider"></div></template>

<script>
import "@/components/theme/base.css";
import "@/components/theme/colors.css";
import "@/components/theme/buttons.css";
import "@/components/theme/typography.css";
import "@/components/theme/transitions.css";
import "@/components/theme/spaces.css";
import "@/components/theme/borders.css";
import "@/components/theme/other.css";

export default {
  data() {
    return {};
  },
};
</script>

<style>

*, *::before, *::after {
  font-family: var(--main-font-family);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  position: relative;
  margin: auto;
  background-attachment: fixed;
  background:
    radial-gradient(43.98% 71.63% at 3.19% 94.8%, rgba(242, 158, 29, 0.05) 0%, rgba(242, 158, 29, 0) 100%),
    radial-gradient(14.59% 23.76% at 3.19% 93.56%, rgba(242, 158, 29, 0.05) 0%, rgba(242, 158, 29, 0) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%),
    linear-gradient(0deg, #1E1E1E, #1E1E1E);
  font-family: var(--main-font-family);
}

::-webkit-scrollbar {
  width: var(--size-of-scrollbar);
  height: var(--size-of-scrollbar);
}

::-webkit-scrollbar-track {
  background-color: var(--color-gray-medium);
  border-radius: 100px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-light);
  border-radius: 100px;
}

.disabled,
:disabled,
.disabled:hover,
:disabled:hover {
  user-select: none;
  pointer-events: none;
  opacity: 0.5;
  transition: var(--default-transition);
}

.hide {
  display: none !important;
}

h1, .h1,
h2, .h2,
h3, .h3,
h4, .h4 {
  user-select: none;
  color: var(--color-light);
}

h1, .h1 { font-size: var(--h1-font-size); font-weight: var(--h1-font-weight); }
h2, .h2 { font-size: var(--h2-font-size); font-weight: var(--h2-font-weight); }
h3, .h3 { font-size: var(--h3-font-size); font-weight: var(--h3-font-weight); }
h4, .h4 { font-size: var(--h4-font-size); font-weight: var(--h4-font-weight); }

label {
  color: var(--color-light);
  font-size: var(--medium-font-size-2);
}

textarea,
input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  background: transparent;
  color: var(--color-light);
  font-size: var(--medium-font-size);
  border-radius: var(--small-border-radius);
  border: 2px solid var(--color-gray);
  transition: var(--default-transition);
}

input[type="text"],
input[type="password"],
input[type="email"] {
  height: var(--input-height);
  padding: var(--input-padding);
  font-weight: var(--medium-font-weight);
}

textarea {
  resize: vertical;
  padding: var(--textarea-padding);
}

input::placeholder,
textarea::placeholder {
  color: var(--color-gray-medium);
}

input:focus,
textarea:focus {
  border-color: var(--color-gray-light);
  outline: none;
}

input[type="text"].search {
  background-image: url("data:image/png;base64,...");
  background-repeat: no-repeat;
  background-position: 95%;
  padding-right: 3rem;
}

.errored,
.errored:focus {
  border-color: var(--color-error);
  color: var(--color-error);
}

[type="checkbox"],
[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox + label,
.radiobtn + label {
  position: relative;
  padding-left: 40px;
  cursor: pointer;
  margin-bottom: 10px;
  line-height: 20px;
  display: inline-block;
}

.checkbox + label::before,
.radiobtn + label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-gray-light);
  background: transparent;
}

.checkbox + label::before { border-radius: 3px; }
.radiobtn + label::before { border-radius: 50%; }

.checkbox + label::after,
.radiobtn + label::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: var(--color-gray-light);
  opacity: 0;
  transition: 0.2s;
}

.checkbox + label::after { border-radius: 1px; }
.radiobtn + label::after { border-radius: 50%; }

.checkbox:checked + label:after,
.radiobtn:checked + label:after {
  opacity: 1;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
}

#app-landing-page {
  position: absolute;
  left: 0;
}

#content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden auto;
}

main {
  width: calc(100% - 100px);
}

.main-no-navbar {
  height: 100%;
}

@media (max-width: 1600px) {
  body {
    --content-width: 1000px;
    --preview-card-for-creater-column-gap: 35px;
  }
}

@media (max-width: 1200px) {
  body {
    --content-width: 800px;
    --preview-card-for-creater-column-gap: 50px;
  }
}

@media (max-width: 900px) {
  body {
    --content-width: 700px;
  }
  .logo-text {
    display: none;
  }
}

#nprogress .bar {
  background: var(--color-gray-light) !important;
}

.animation-circle {
  color: var(--color-gray-light) !important;
}

.container-circle-svg {
  background: var(--transparent-dark-70) !important;
  backdrop-filter: blur(3px) !important;
}

button {
  all: unset;
  box-sizing: border-box;
}

.button,
button {
  border: 0.1px solid rgba(255, 255, 255, 0);
  text-align: center;
  display: block;
  user-select: none;
  border-color: transparent;
  background: var(--gradient-primary);
  color: var(--color-dark);
  outline: none;
  transition: var(--default-transition);
  height: var(--button-height-small);
  line-height: calc(var(--button-height-small) - (var(--button-border-width) * 2));
  border-radius: var(--button-border-radius);
  padding: var(--button-padding-small);
  font-size: var(--button-font-size);
  font-weight: var(--large-font-weight);
  border-width: var(--button-border-width);
  border-style: solid;
}

.button.round,
button.round {
  border-radius: var(--border-raduis-circle);
  width: var(--button-height-small);
  padding: 0;
}

.button.medium,
button.medium {
  font-size: var(--regular-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-dark);
  height: var(--button-height-medium);
  padding: var(--button-padding-medium);
  line-height: calc(var(--button-height-medium) - (var(--button-border-width) * 2));
}

.button.medium.round,
button.medium.round {
  height: var(--button-height-medium);
  width: var(--button-height-medium);
  padding: 0;
}

.button.large,
button.large {
  color: var(--color-dark);
  height: var(--button-height-large);
  padding: var(--button-padding-medium);
  width: 100%;
  line-height: calc(var(--button-height-large) - (var(--button-border-width) * 2));
  font-size: var(--button-font-size);
}

.button.large.round,
button.large.round {
  height: var(--button-height-large);
  width: var(--button-height-large);
  padding: 0;
}

.button:hover,
button:hover {
  transition: var(--default-transition);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border: var(--button-border-width) solid var(--color-accent-secondary);
  filter: brightness(1.3);
  cursor: pointer;
}

.button.outlined,
button.outlined {
  border: var(--button-border-width) solid var(--color-accent-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.button.disabled,
button.disabled,
button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.button:focus,
button:focus {
  transition: var(--default-transition);
  outline: 2px solid var(--color-gray-light);
  outline-offset: 2px;
}

.button.active,
button.active,
button:active {
  transition: var(--default-transition);
  transform: scale(0.98);
}

.button-profile {
  font-size: var(--button-profile-font-size);
  font-weight: var(--large-font-weight);
  height: var(--button-profile-height);
  border-radius: var(--button-profile-border-radius);
  padding: var(--button-profile-padding);
  border: solid var(--button-profile-border-width) var(--color-dark);
  background: transparent;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.button-profile:hover {
  background: var(--color-dark);
  color: var(--color-gray-light);
  -webkit-text-fill-color: unset;
}

.button-profile:focus {
  outline: unset;
}

.button-profile.heart {
  padding-left: 1.1875rem;
  padding-right: 1.1875rem;
}

.button-profile svg {
  fill: var(--color-dark);
  transition: var(--default-transition);
}

.button-profile:hover svg {
  fill: var(--color-gray-light);
  transition: var(--default-transition);
}
.button.decline,
button.decline {
  background: none;
  border-color: var(--color-error);
  color: var(--color-error);
  outline-color: var(--color-error);
  background-clip: unset !important;
  -webkit-text-fill-color: unset !important;
}
.button.button-svg-transition svg path {
  fill: var(--color-dark);
  /* transition: var(--default-transition); */
}
.button.button-svg-transition:hover svg path {
  fill: var(--color-gray-light);
  /* transition: var(--default-transition); */
}
.svg-button {
  cursor: pointer;
  transition: var(--default-transition);
}
.svg-button svg path {
  fill: var(--color-gray);
  transition: var(--default-transition);
}
.svg-button.accent svg path {
  fill: var(--color-gray-light);
}
.svg-button:hover svg path {
  fill: var(--color-gray-light);
  transition: var(--default-transition);
}
.svg-button:active svg path {
  fill: var(--color-gray-light);
  opacity: 50%;
  transition: var(--default-transition);
}
.svg-button.danger:hover svg path {
  fill: var(--color-error);
  transition: var(--default-transition);
}
.svg-button.danger:active svg path {
  fill: var(--color-error);
  opacity: 50%;
  transition: var(--default-transition);
}
.svg-button-stroke {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: var(--default-transition);
}
.svg-button-stroke svg path {
  stroke: var(--color-gray);
  transition: var(--default-transition);
}
.svg-button-stroke.accent svg path {
  stroke: var(--color-gray-light);
}
.svg-button-stroke:hover svg path {
  stroke: var(--color-gray-light);
  transition: var(--default-transition);
}
.svg-button-stroke:active svg path {
  stroke: var(--color-gray-light);
  opacity: 50%;
  transition: var(--default-transition);
}
</style>
