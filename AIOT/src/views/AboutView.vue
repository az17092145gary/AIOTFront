<script setup>
import BarChart from '../components/tesschart.vue'

// export default {
//   name: 'App',
//   components: { BarChart }
// }
let chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [10, 1,80] }]
};
let chartOptions = {
  responsive: true
};
</script>
<template>
  <BarChart :data="chartData" :options="chartOptions" />
</template>