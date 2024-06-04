<script setup>
import { ref, onMounted, computed } from "vue";
import { Doughnut } from "vue-chartjs";
//引入全部Chart
import { Chart } from "chart.js/auto";
//引入數值標籤
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
const myChartData = ref({
  labels: ["VueJs"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#00D8FF", "#00D8FF", "#DD1B16"],
      data: [40, 100],
    },
  ],
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <Doughnut :data="myChartData" :options="myOptions" />
</template>
