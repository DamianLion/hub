
<template>
  <div class="card">
    <div class="header">
      <slot name="title"></slot>
      <p class="category">
        <slot name="subTitle"></slot>
      </p>
    </div>
    <div class="content">
      <line-chart :data="chartData" :options="options"></line-chart>
      <div class="footer">
        <div class="chart-legend">
          <slot name="legend"></slot>
        </div>
        <hr>
        <div class="stats">
          <slot name="footer"></slot>
        </div>
        <div class="pull-right">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Line, mixins } from 'vue-chartjs'
  
  export default {
    name: 'live-card',
    mixins: [mixins.reactiveProp],
    props: ['chartData', 'options'],
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
