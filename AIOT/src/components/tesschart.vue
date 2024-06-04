<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
import 'chart.js/auto';
//const { chartData, chartOptions } = defineProps('chartData', 'chartOptions');
const chartData = ref({
    labels: [],
    datasets: [{ data: [] }]
});

const chartOptions = ref({
    responsive: true
});
</script>
<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>