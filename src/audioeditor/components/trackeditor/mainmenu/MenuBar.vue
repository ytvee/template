<template>
  <div class="menu-bar">
    <div class="menu-item-wrapper">
      <MenuItem>
        <template #menu-item-content>
          <div class="menu-item-content-slot-argument transition-text-gradient-accent-parent">
            New song
            <svg class="menu-bar-svg-icon" width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.6474 27.331V27.7156C19.6414 28.3235 19.3956 28.9045 18.9635 29.3323C18.5315 29.76 17.948 29.9999 17.34 29.9999H2.28432C1.67848 29.9999 1.09745 29.7592 0.669061 29.3309C0.240669 28.9025 0 28.3214 0 27.7156V7.26057C0.00500885 6.65593 0.247165 6.07741 0.674369 5.64949C1.10157 5.22157 1.67968 4.97844 2.28432 4.97241H2.40353V22.7355C2.40862 23.9561 2.89706 25.1249 3.76195 25.9862C4.62684 26.8475 5.79772 27.331 7.01832 27.331H19.6474Z" fill="url(#paint0_linear_1278_6790)" />
              <path d="M24.278 5.38401H19.4209V0.192383C19.698 0.309407 19.948 0.482199 20.1554 0.700009L23.7165 4.40722C23.9844 4.67919 24.1778 5.0156 24.278 5.38401Z" fill="url(#paint1_linear_1278_6790)" />
              <path
                d="M19.402 7.6913C18.794 7.69134 18.2106 7.45141 17.7785 7.02366C17.3465 6.59592 17.1007 6.01494 17.0946 5.40699V2.88846e-09H6.99977C6.39179 -3.03969e-05 5.80837 0.239899 5.37631 0.667641C4.94424 1.09538 4.69846 1.67637 4.69238 2.28432V22.7355C4.69745 23.3441 4.94279 23.9261 5.37496 24.3547C5.80713 24.7832 6.39113 25.0237 6.99977 25.0237H22.0747C22.6794 25.0176 23.2575 24.7745 23.6847 24.3466C24.1119 23.9187 24.354 23.3401 24.359 22.7355V7.6913H19.402ZM17.4176 14.2289H15.6909V15.9556C15.6909 16.2616 15.5694 16.555 15.353 16.7714C15.1367 16.9878 14.8432 17.1093 14.5373 17.1093C14.2313 17.1093 13.9378 16.9878 13.7215 16.7714C13.5051 16.555 13.3836 16.2616 13.3836 15.9556V14.2289H11.6569C11.3509 14.2289 11.0574 14.1074 10.8411 13.891C10.6247 13.6746 10.5032 13.3812 10.5032 13.0752C10.5032 12.7692 10.6247 12.4758 10.8411 12.2594C11.0574 12.0431 11.3509 11.9215 11.6569 11.9215H13.3836V10.1794C13.3836 9.87346 13.5051 9.58002 13.7215 9.36366C13.9378 9.14729 14.2313 9.02575 14.5373 9.02575C14.8432 9.02575 15.1367 9.14729 15.353 9.36366C15.5694 9.58002 15.6909 9.87346 15.6909 10.1794V11.9215H17.4176C17.7236 11.9215 18.0171 12.0431 18.2334 12.2594C18.4498 12.4758 18.5713 12.7692 18.5713 13.0752C18.5713 13.3812 18.4498 13.6746 18.2334 13.891C18.0171 14.1074 17.7236 14.2289 17.4176 14.2289Z"
                fill="url(#paint2_linear_1278_6790)"
              />
              <defs>
                <linearGradient id="paint0_linear_1278_6790" x1="-1.8244" y1="4.13816" x2="22.4992" y2="7.42233" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
                <linearGradient id="paint1_linear_1278_6790" x1="18.9699" y1="0.0193281" x2="24.938" y2="0.979654" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
                <linearGradient id="paint2_linear_1278_6790" x1="2.86619" y1="-0.834124" x2="27.2126" y2="2.45685" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </template>
        <template #sub-menu-content>
          <UploadNewAudioFileSubMenu />
        </template>
      </MenuItem>
    </div>
    <div class="menu-item-wrapper">
      <MenuItem>
        <template #menu-item-content>
          <div class="menu-item-content-slot-argument transition-text-gradient-accent-parent">BMP 120</div>
        </template>
        <template #sub-menu-content>
          <BpmMenu />
        </template>
      </MenuItem>
    </div>
    <div class="menu-item-wrapper">
      <MenuItem>
        <template #menu-item-content>
          <div class="menu-item-content-slot-argument transition-text-gradient-accent-parent">Key note C#</div>
        </template>
        <template #sub-menu-content>
          <KeyNoteSubmenu />
        </template>
      </MenuItem>
    </div>
    <div class="menu-item-wrapper">
      <MenuItem>
        <template #menu-item-content>
          <div class="menu-item-content-slot-argument transition-text-gradient-accent-parent">
            Export
            <svg width="33" height="31" viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="1.04419" width="32" height="29" rx="4.5" stroke="url(#paint0_linear_1825_24506)" />
              <path d="M8.5 25.5442H24C24.2761 25.5442 24.5 25.3203 24.5 25.0442V23.6912C24.5 23.4151 24.2761 23.1912 24 23.1912H8.5M23.6758 13.4514C23.9838 13.1344 23.7592 12.603 23.3172 12.603H20.4286C20.1524 12.603 19.9286 12.3792 19.9286 12.103V6.04419C19.9286 5.76805 19.7047 5.54419 19.4286 5.54419H13.5714C13.2953 5.54419 13.0714 5.76805 13.0714 6.04419V12.103C13.0714 12.3792 12.8476 12.603 12.5714 12.603H9.68279C9.24083 12.603 9.0162 13.1344 9.32415 13.4514L16.1414 20.4691C16.3377 20.6713 16.6623 20.6713 16.8586 20.4691L23.6758 13.4514Z" fill="url(#paint1_linear_1825_24506)" />
              <defs>
                <linearGradient id="paint0_linear_1825_24506" x1="-3.06429" y1="-0.455813" x2="37.0971" y2="7.14239" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
                <linearGradient id="paint1_linear_1825_24506" x1="7.01429" y1="4.87752" x2="26.8087" y2="7.60111" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </template>
        <template #sub-menu-content>
          <ExportSubmenu :tracks-count="tracksCount" />
        </template>
      </MenuItem>
    </div>
  </div>
</template>

<script>
import MenuItem from "./menubar/MenuItem.vue";
import UploadNewAudioFileSubMenu from "./submenucontent/UploadNewAudioFileSubMenu.vue";
import BpmMenu from "./submenucontent/BpmMenu.vue";
import KeyNoteSubmenu from "./submenucontent/KeyNoteSubmenu.vue";
import ExportSubmenu from "./submenucontent/ExportSubmenu.vue";

export default {
  name: "MenuBar",
  components: {
    MenuItem,
    UploadNewAudioFileSubMenu,
    ExportSubmenu,
    KeyNoteSubmenu,
    BpmMenu,
  },
  data() {
    return {
      tracksCount: 5,
    };
  },
};
</script>
<style scoped>
.menu-bar {
  display: flex;
  justify-content: flex-end;
}
.menu-bar > *:not(:last-child) {
  margin-right: 20px;
}
.menu-bar > *:last-child {
  margin-right: 15px;
}
.menu-item-content-slot-argument {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: var(--small-border-radius);
  background: red;

  transition: var(--default-transition);

  position: relative;
  z-index: 1;
}
.menu-item-content-slot-argument::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: red;
  border-radius: var(--audio-editor-default-border-radius);
  content: "";
  opacity: 0;
  transition: opacity var(--default-transition);
}
.menu-item-content-slot-argument:hover::before {
  opacity: 1;
}
.menu-item-content-slot-argument svg stop {
  transition: var(--default-transition);
}
.menu-item-content-slot-argument:hover svg stop {
  stop-color: red;
}
</style>
