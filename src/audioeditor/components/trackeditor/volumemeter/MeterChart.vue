<template></template>

<script>
import { MeterChartCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/MeterChartCanvasPainter";
import { shallowRef } from "vue";
export default {
  name: "MeterChart",
  data() {
    return {
      canvasPainter: null,
    };
  },
  mounted() {
    this.canvasPainter = shallowRef(new MeterChartCanvasPainter(this.$refs.meterChartRef));
    this.canvasPainter.updateCanvasSize(this.$refs.meterChartRef.width, this.$refs.meterChartRef.height);
    this.canvasPainter.drawMeterChart(-10, 10, 2, 0);
  },
};
</script>

<style scoped>
.meter-chart {
}
canvas {
  /* border: 1px solid red; */
}
</style>
