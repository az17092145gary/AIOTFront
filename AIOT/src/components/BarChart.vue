<script setup>
import { ref, onMounted, computed } from "vue";
import { Line } from "vue-chartjs";
//引入全部Chart
import { Chart } from "chart.js/auto";
//引入數值標籤
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
const myChartData = ref({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      type: "bar",
      label: "利潤",
      backgroundColor: "#732EF5",
      barThickness: 15,
      order: 2,
      data: [1, 2, 5, 7, 8, 50],
    },
    {
      type: "bar",
      label: "成長率",
      borderColor: "#FF8A00",
      borderWidth: 2,
      order: 1,
      data: ["5", "8", "16", "32", "8", "61"],
    },
    {
      type: "bar",
      label: "稼動率",
      borderColor: "#FF8A00",
      borderWidth: 2, // 折線的寬度
      // pointBackgroundColor: '#FFFFFF', // 折線圖圓點的背景顏色
      // pointBorderColor: '#FF8A00',
      // pointBorderWidth: 2,
      // radius: 4, // 折線圖圓點的半徑
      order: 1,
      data: ["50", "18", "36", "38", "10", "41"],
    },
  ],
});
const myOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <Line :data="myChartData" :options="myOptions"/>
</template>
