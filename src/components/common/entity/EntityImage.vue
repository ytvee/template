<template>
  <div class="container-img">
    <img :src="imageSrc" alt="image not available" />
    <div v-if="!isImageLoaded" class="dummy">
      <div class="svg-holder">
        <svg fill="none" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M103.801 21.5128L120 5.31425L114.687 0L93.3779 21.3087H89.6063C89.4813 13.5396 85.8322 7.94634 80.8409 7.94634H39.5038C34.5116 7.94634 30.8652 13.5396 30.7384 21.3087H18.837C11.2395 21.3087 5.05799 27.4902 5.05799 35.0877V89.7874C5.05799 95.1466 8.14022 99.791 12.6194 102.067L0 114.687L5.31425 120L21.7492 103.565H101.51C109.108 103.565 115.289 97.3836 115.289 89.786V35.0884C115.289 28.2721 110.308 22.6123 103.8 21.5153L103.801 21.5128ZM12.5757 89.7844V35.0847C12.5757 31.6305 15.3847 28.8215 18.8389 28.8215H38.2545V21.7223C38.2545 18.1528 39.3453 16.0314 39.8742 15.4592H80.4748C81.0045 16.0314 82.0945 18.152 82.0945 21.7223V28.8215H85.862L74.5929 40.093C70.4391 37.2038 65.3996 35.5024 59.9668 35.5024C45.8069 35.5024 34.288 47.0215 34.288 61.1811C34.288 66.6134 35.9879 71.6535 38.8778 75.8073L18.6487 96.0373C15.2827 95.9347 12.5753 93.1729 12.5753 89.7838L12.5757 89.7844ZM78.1309 61.182C78.1309 71.1966 69.9826 79.3456 59.968 79.3456C56.0218 79.3456 52.368 78.0762 49.3859 75.93L74.7158 50.6C76.8613 53.5822 78.1309 57.2352 78.1309 61.1822V61.182ZM41.8039 61.182C41.8039 51.1673 49.9521 43.0191 59.9668 43.0191C63.3208 43.0191 66.4607 43.936 69.1601 45.5269L44.3123 70.3747C42.7222 67.6747 41.8045 64.5338 41.8045 61.1814L41.8039 61.182ZM107.776 89.7844C107.776 93.2386 104.967 96.0475 101.512 96.0475H29.2688L44.0257 81.2906C48.4087 84.7738 53.9474 86.8613 59.9678 86.8613C74.1276 86.8613 85.6466 75.3416 85.6466 61.1826C85.6466 55.1621 83.5588 49.6235 80.0767 45.2405L96.4933 28.8238H101.513C104.967 28.8238 107.776 31.6327 107.776 35.0869L107.776 89.7844Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artist: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      imgDummySrc: "./assets/profile/gallery/imgDummy.png",
    };
  },
  computed: {
    imageSrc() {
      if (this.isImageLoaded) {
        return this.artist.logoURI || this.artist.pictureURI;
      }
      return this.publicPath + this.imgDummySrc;
    },
    isImageLoaded() {
      return this.artist.logoURI || this.artist.pictureURI;
    },
  },
};
</script>

<style scoped>
.container-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: black;
  position: relative;
}

.container-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

.container-img .dummy {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-light);
  font-family: var(--main-font-family);
  font-weight: var(--large-font-weight);
  font-size: 1.5rem;
  text-align: center;
}

.container-img .dummy .svg-holder {
  display: flex;
  width: 18%;
  aspect-ratio: 1/1;
  min-width: 32px;
  min-height: 32px;
}

.container-img .dummy .svg-holder svg {
  width: 100%;
  height: 100%;
  fill: var(--color-gray);
}
</style>
