<template>
  <div class="drop-down-list-container">
    <div class="drop-down-list-container-content">
      <div v-for="(categoryData, index1) of dropDownListItemsData" :key="index1" class="drop-down-list-category-section">
        <div class="drop-down-list-category-header">
          <hr />
          <div class="hexagonal-container">
            <svg preserveAspectRatio="none" viewBox="0 0 80 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vector-effect="non-scaling-stroke" d="M0.636636 7L5.75979 0.5H74.2402L79.3634 7L74.2402 13.5H5.75979L0.636636 7Z" />
            </svg>
            <div class="hexagonal-container-content">
              {{ categoryData.category }}
            </div>
          </div>
          <hr />
        </div>
        <div class="drop-down-list-category-items-holder">
          <div v-for="(item, index2) of categoryData.ItemsData" :key="index2" class="drop-down-list-item">
            <div class="drop-down-list-item-icon-holder">
              <img v-if="isWithImage(item)" :src="item.imageSource" alt="" />
              <div v-if="!isWithImage(item)" class="svg-wrapper">
                {{ dummySvg(categoryData.category) }}
              </div>
            </div>
            <div class="drop-down-list-item-text-holder">
              {{ item.name }}
            </div>
            <div v-if="isWithMark(categoryData.category)" class="drop-down-list-item-mark-holder">
              <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.13989 1.61609L7.28593 1.47315L7.13989 1.33022L6.65647 0.857068L6.51664 0.720211L6.37674 0.857002L2.88561 4.27071L1.62315 3.03811L1.48326 2.90152L1.34353 3.03828L0.860106 3.51143L0.71407 3.65436L0.860106 3.79729L2.74582 5.64293L2.88571 5.77985L3.02561 5.64293L7.13989 1.61609Z" stroke-width="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HexagonDropDownList",
  data() {
    return {
      dropDownListItemsData: [
        {
          category: "artists",
          ItemsData: [
            { imageSource: "", name: "Artist Name1" },
            { imageSource: "", name: "Artist Name2" },
          ],
        },

        {
          category: "threads",
          ItemsData: [
            { imageSource: "", name: "Topic Name1" },
            { imageSource: "", name: "Topic Name2" },
          ],
        },
      ],

      dummySvgsByCategory: [
        {
          category: "artists",
          dummySvg: "<svg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'><path d='M4.99856 0.263672C5.62671 0.263672 6.22912 0.513201 6.67329 0.957366C7.11745 1.40153 7.36698 2.00395 7.36698 2.63209C7.36698 3.26024 7.11745 3.86265 6.67329 4.30682C6.22912 4.75098 5.62671 5.00051 4.99856 5.00051C4.37042 5.00051 3.768 4.75098 3.32383 4.30682C2.87967 3.86265 2.63014 3.26024 2.63014 2.63209C2.63014 2.00395 2.87967 1.40153 3.32383 0.957366C3.768 0.513201 4.37042 0.263672 4.99856 0.263672ZM4.99856 6.18472C7.61567 6.18472 9.7354 7.24459 9.7354 8.55315V9.73736H0.261719V8.55315C0.261719 7.24459 2.38146 6.18472 4.99856 6.18472Z'/></svg>",
        },
        {
          category: "threads",
          dummySvg:
            "<svg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'><path d='M10.1684 0.00197793H1.83155C0.821004 0.00197793 0 0.823072 0 1.83362V7.42938C0 8.43992 0.821004 9.26093 1.83155 9.26093H2.02098C1.9705 9.65248 1.85675 10.0441 1.7052 10.3977C1.51576 10.8399 1.61673 11.3325 1.9578 11.6609C2.17253 11.863 2.45043 11.9767 2.74094 11.9767C2.90517 11.9767 3.08201 11.9388 3.24615 11.863C4.47141 11.2567 5.51983 10.1451 6.21456 9.2609H10.1685C11.179 9.2609 12 8.4399 12 7.42936V1.83359C12 0.823047 11.179 0.00195312 10.1685 0.00195312L10.1684 0.00197793ZM11.0778 7.42931C11.0778 7.93453 10.6736 8.33878 10.1684 8.33878H5.97469C5.83574 8.33878 5.69679 8.40196 5.60842 8.51562C5.0905 9.19768 4.04209 10.4356 2.81685 11.0293C2.74108 11.0672 2.65262 11.0546 2.58953 10.9914C2.52635 10.9282 2.51375 10.8525 2.53904 10.7641C2.81694 10.1451 2.95588 9.48832 2.98119 8.79359C2.98119 8.66724 2.9307 8.55357 2.85484 8.46519C2.77906 8.37673 2.65271 8.32624 2.52644 8.32624L1.8316 8.32615C1.32638 8.32615 0.922126 7.9219 0.922126 7.41668V1.83355C0.922126 1.32833 1.32638 0.924079 1.8316 0.924079H10.1684C10.6736 0.924079 11.0779 1.32833 11.0779 1.83355L11.0778 7.42931Z'/><path d='M8.24972 3.71568L7.07503 3.61462C6.93608 3.60202 6.82242 3.51355 6.77185 3.39989L6.31712 2.31358C6.19076 2.02308 5.77401 2.02308 5.66025 2.31358L5.20552 3.39989C5.15503 3.52624 5.04128 3.61462 4.90234 3.61462L3.75294 3.71568C3.43715 3.74097 3.31079 4.13252 3.55081 4.34725L4.435 5.10519C4.53606 5.19365 4.58655 5.33251 4.54866 5.45887L4.28335 6.59567C4.20758 6.91145 4.54866 7.15147 4.81388 6.98722L5.81172 6.38093C5.92539 6.30515 6.06433 6.30515 6.19069 6.38093L7.18854 6.98722C7.46643 7.15146 7.79483 6.91144 7.71906 6.59567L7.45375 5.45887C7.42847 5.33252 7.46635 5.19357 7.56742 5.10519L8.4516 4.33467C8.70448 4.13254 8.57813 3.74099 8.24974 3.7157L8.24972 3.71568Z'/></svg>",
        },
      ],
    };
  },
  methods: {
    isWithImage(item) {
      return item.imageSource !== "";
    },
    dummySvg(category) {
      let dummySvg = "";
      for (let dummySvgsByCategoryItem of this.dummySvgsByCategory) {
        if (dummySvgsByCategoryItem.category === category) {
          dummySvg = dummySvgsByCategoryItem.dummySvg;
          break;
        }
      }
      return dummySvg;
    },
    isWithMark(category) {
      return category === "artists";
    },
  },
};
</script>

<style scoped>
.drop-down-list-container {
  width: 100%;
  position: absolute;
}

.drop-down-list-container-content {
  padding: 20px 0px 5px 0px;
  border-radius: var(--large-border-radius-2);
  background: var(--color-dark);
  color: var(--color-gray);
  overflow: auto;
}

.drop-down-list-category-header {
  margin-bottom: 10px;
  padding-right: 16px;
  height: 14px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.drop-down-list-category-header hr {
  border: none;
  background-color: var(--color-gray-medium);
  color: var(--color-gray-medium);
  height: 1px;
}

.drop-down-list-category-header hr:first-child {
  flex: 0 1 8%;
  max-width: 28px;
}

.drop-down-list-category-header hr:last-child {
  flex: 1 1 71%;
}

.drop-down-list-category-header .hexagonal-container {
  flex: 1 1 21%;
  min-width: 30px;
  max-width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.drop-down-list-category-header .hexagonal-container svg {
  stroke: var(--color-gray-medium);
  width: 100%;
  height: 100%;
  /* width: 100%;
  height: 12px; */
}

.hexagonal-container-content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: var(--smallest-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-accent-primary);
  justify-content: center;
  align-items: center;
}

.drop-down-list-category-items-holder {
  margin-left: min(10%, 36px);
}

.drop-down-list-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: var(--medium-font-size-2);
  font-weight: var(--medium-font-weight);
}

.drop-down-list-item > * {
  margin-right: 5px;
}

.drop-down-list-item-icon-holder {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: var(--border-raduis-circle);
  background: var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.drop-down-list-item-icon-holder svg {
  fill: var(--color-dark);
}
.drop-down-list-item-icon-holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.drop-down-list-item-mark-holder {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: var(--border-raduis-circle);
  background: var(--color-accent-primary);
  display: flex;
  justify-content: center;
  align-items: center;
}
.drop-down-list-item-mark-holder svg {
  fill: var(--color-dark);
}
</style>
