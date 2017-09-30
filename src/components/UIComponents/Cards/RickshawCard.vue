<template>
  <div class="card">
    <div class="chart_container" ref="rickshaw">
      <div class="y_axis" ref="y_axis"></div>
      <div ref="chart"></div>
      <div ref="legend"></div>
    </div>
  </div>
</template>

<style src="rickshaw/rickshaw.min.css"></style>

<style>
  .chart_container {
    padding: 30px;
  }
  .y_axis {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 40px;
  }

  .y_ticks text {
    fill: #fff
  }
</style>

<script>
  import * as d3 from 'd3' // eslint-disable-line
  import Rickshaw from 'rickshaw'

  export default {
    name: 'rickshaw-card',
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      sensor: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        test: {}
      }
    },
    sockets: {
      sensorData (val) {
        if (val.sensor_id === this.sensor.id) {
          let data = { sensor: val.y }
          this.graph.series.addData(data)
          this.graph.update()
        }
      }
    },
    methods: {
      handleResize (e) {
        this.graph.configure({
          width: this.$refs.rickshaw.innerWidth,
          height: 400
        })
        this.graph.render()
      },
      buildGraph () {
        let palette = new Rickshaw.Color.Palette()

        this.graph = new Rickshaw.Graph({
          element: this.$refs.chart,
          renderer: 'bar',
          height: 400,
          series: new Rickshaw.Series.FixedDuration([{ name: 'sensor', color: palette.color() }], undefined, {
            timeInterval: 1000,
            maxDataPoints: 100,
            timeBase: new Date().getTime() / 1000
          })
        })
        this.x_axis = new Rickshaw.Graph.Axis.Time({ graph: this.graph })
        this.y_axis = new Rickshaw.Graph.Axis.Y({
          graph: this.graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: this.$refs.y_axis
        })
      }
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    },
    created () {
      this.$nextTick(function () {
        this.buildGraph()
        this.graph.render()
        window.addEventListener('resize', this.handleResize)
      })
    }
  }
</script>
<style>

</style>
