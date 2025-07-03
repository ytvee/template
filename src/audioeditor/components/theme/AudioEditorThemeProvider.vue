<template>
  <div class="audio-editor-theme-provider"></div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.audio-editor {
  /* fonts */
  // usage examples
  // <uniquifier>: Use a unique and descriptive class name
  // <weight>: Use a value from 400 to 800
  // .wix-madefor-display-<uniquifier> {
  //   font-family: "Wix Madefor Display", sans-serif;
  //   font-optical-sizing: auto;
  //   font-weight: <weight>;
  //   font-style: normal;
  // }

  // <uniquifier>: Use a unique and descriptive class name
  // <weight>: Use a value from 400 to 800
  // .wix-madefor-text-<uniquifier> {
  //   font-family: "Wix Madefor Text", sans-serif;
  //   font-optical-sizing: auto;
  //   font-weight: <weight>;
  //   font-style: normal;
  // }

  // <uniquifier>: Use a unique and descriptive class name
  // <weight>: Use a value from 100 to 900
  // .inter-<uniquifier> {
  //   font-family: "Inter", system-ui;
  //   font-optical-sizing: auto;
  //   font-weight: <weight>;
  //   font-style: normal;
  // }

  /* /fonts */

  /* colors */
  --audio-editor-color-white: var(--color-light);
  --audio-editor-color-translucent-white-1: var(--transparent-light-40);
  --audio-editor-color-translucent-white-2: var(--transparent-light-07);
  --audio-editor-color-translucent-white-3: var(--transparent-light-15);
  --audio-editor-color-translucent-white-4: var(--transparent-light-23);

  --audio-editor-color-translucent-black-1: rgba(0, 0, 0, 0.3);
  --audio-editor-color-tooltip-1: rgba(31, 31, 31, 0.8);

  --audio-editor-color-accent: rgba(82, 187, 77, 0.8);

  --audio-editor-color-danger-1: rgba(255, 0, 0, 0.4);
  --audio-editor-color-danger-2: rgb(255, 0, 0);

  --audio-editor-dropdown-background-color: linear-gradient(45deg, rgba(92, 92, 92, 0.6) 0%, rgba(92, 92, 92, 1) 30%, rgba(239, 92, 92, 0.01) 100%);
  --audio-editor-dropdown-background-color-2: rgba(92, 92, 92, 0.6);
  --audio-editor-dropdown-background-color-3: rgba(255, 255, 255, 0.102);

  --audio-editor-dropdown-shadow-color: rgba(0, 0, 0, 0.302);

  --audio-editor-dropdown-blur: blur(3px);

  /* /colors */

  /* fonts */
  --audio-editor-font-label-extra-small-family: "Wix Madefor Text", sans-serif; //time labels on workarea
  --audio-editor-font-label-extra-small-size: 8px;
  //--audio-editor-font-label-extra-small-weight: 700;

  --audio-editor-font-label-small-family: "Inter", system-ui;
  --audio-editor-font-label-small-size: 10px;
  --audio-editor-font-label-small-weight: 700;
  --audio-editor-font-label-small-weight-normal: 400;
  --audio-editor-font-label-small-letter: 0.02em;

  --audio-editor-font-label-family: "Wix Madefor Text", sans-serif; //M S buttons on track mixing controls
  --audio-editor-font-label-size: 12px;
  //--audio-editor-font-label-weight: 700;

  --audio-editor-font-headline-family: "Wix Madefor Text", sans-serif; //current time
  --audio-editor-font-heandline-size: 18px;
  //--audio-editor-font-heandline-weight: 700;

  --audio-editor-font-text-family: "Wix Madefor Text", sans-serif; //default font
  --audio-editor-font-text-size: 14px;
  //--audio-editor-font-text-weight: 700;
  --audio-editor-font-text-weight-normal: 400;

  --audio-editor-font-large-family: "Wix Madefor Display", sans-serif; //New Track button
  --audio-editor-font-large-size: 17px;
  --audio-editor-font-large-weight: 500;

  --audio-editor-dropdown-font-family: "Wix Madefor Display", sans-serif;
  /* /fonts */

  /* common */
  --audio-editor-default-border-radius: var(--small-border-radius);
  //--audio-editor-default-transition: 0.3s;
  /* /common */

  /* structure */
  --audio-editor-time-line-height: 35px;
  --audio-editor-track-mixing-tools-border-radius: 22px;
  --audio-editor-main-left-column-width: 278px;
  --audio-editor-bottom-panel-height: 35px;

  /* test */
  --audio-editor-default-test-transition: 3s;
  --audio-editor-gradient-test-vertical: linear-gradient(0deg, #0000ff 0%, #ff0000 100%);
  --audio-editor-gradient-test-horizontal: linear-gradient(90deg, #0000ff 0%, #ff0000 100%);

  font-family: var(--audio-editor-font-text-family);
  font-size: var(--audio-editor-font-text-size);
  font-weight: var(--largest-font-weight);
  color: var(--audio-editor-color-translucent-white-1);

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    display: flex;
  }

  /* reset styles for standard elements */
  input[type="text"],
  input[type="number"],
  input[type="password"],
  input[type="email"] {
    border: 2px solid var(--audio-editor-color-translucent-white-1);
    border-radius: var(--small-border-radius);
    /* width 100% of parent container */
    width: 100%;
    height: unset;
    background: transparent;
    color: var(--audio-editor-color-white);
    font-family: var(--audio-editor-font-text-family);
    font-size: var(--audio-editor-font-text-size);

    font-weight: var(--largest-font-weight);
  }
  input[type="text"]::placeholder,
  input[type="password"]::placeholder,
  input[type="email"]::placeholder {
    color: var(--color-gray-medium);
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  input[type="number"]:focus-visible {
    outline: none;
  }
  /* /reset styles for standard elements */

  /* common */
  .danger {
    color: var(--audio-editor-color-danger-1);
  }
  /* /common */

  /* buttons */
  button {
    all: unset;
  }
  .audio-editor-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: var(--audio-editor-color-translucent-white-3);
    color: var(--audio-editor-color-white);
    border-radius: var(--audio-editor-default-border-radius);

    cursor: pointer;

    outline: 2px dashed transparent;
    outline-offset: -2px;

    transition: var(--default-transition);
  }
  .audio-editor-button:hover {
    filter: unset;
    -webkit-text-fill-color: unset;
  }

  .audio-editor-button:active {
    transform: unset;
  }
  .audio-editor-button.disabled {
    opacity: 0.5;
    cursor: unset;
    pointer-events: none;
  }
  .audio-editor-button.drag-over {
    outline-color: var(--audio-editor-color-white);
  }
  .medium-button {
    border: none;

    height: 20px;
    padding: 0 5px;
  }

  .audio-editor-svg-button {
    display: flex;
    cursor: pointer;
    transition: color var(--default-transition);
  }
  .audio-editor-svg-button:hover {
    color: var(--audio-editor-color-white);
  }
  .audio-editor-svg-button.danger {
    color: var(--audio-editor-color-danger-1);
  }
  .audio-editor-svg-button.danger:hover {
    color: var(--audio-editor-color-danger-2);
  }
  /* buttons */
}
</style>
