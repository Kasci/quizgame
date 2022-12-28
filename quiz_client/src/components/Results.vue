<template>
    <div class="max-w-xs">
        <Bar 
        :chart-data="getBarChartData()"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
    props: ['results'],
    components: { Bar },
    methods: {
        getBarChartData() {
            let x = {
                labels: this.results.map((r: {name: string}) => r.name),
                datasets: [ { data: this.results.map((r: {points: number}) => r.points), backgroundColor: '#059669' } ]
            };
            console.log(this.results, x)
            return x;
        },
        getBarChartStyles() {
            return {
                type: Object as PropType<Partial<CSSStyleDeclaration>>,
                default: () => {}
            }
        }
    } 
})
</script>