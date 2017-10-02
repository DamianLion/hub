<template>
  <div class="card rickshaw-card">
    <form class="side_panel">
      <h1>Random Data in the Future</h1>
      <section><div class="legend" ref="legend"></div></section>
      <!--<section>
        <div id="renderer_form" class="toggler">
          <input type="radio" name="renderer" id="area" value="area" checked>
          <label for="area">area</label>
          <input type="radio" name="renderer" id="bar" value="bar">
          <label for="bar">bar</label>
          <input type="radio" name="renderer" id="line" value="line">
          <label for="line">line</label>
          <input type="radio" name="renderer" id="scatter" value="scatterplot">
          <label for="scatter">scatter</label>
        </div>
      </section>-->
      <!--<section>
        <div id="offset_form">
          <label for="stack">
            <input type="radio" name="offset" id="stack" value="zero" checked>
            <span>stack</span>
          </label>
          <label for="stream">
            <input type="radio" name="offset" id="stream" value="wiggle">
            <span>stream</span>
          </label>
          <label for="pct">
            <input type="radio" name="offset" id="pct" value="expand">
            <span>pct</span>
          </label>
          <label for="value">
            <input type="radio" name="offset" id="value" value="value">
            <span>value</span>
          </label>
        </div>
        <div id="interpolation_form">
          <label for="cardinal">
            <input type="radio" name="interpolation" id="cardinal" value="cardinal" checked>
            <span>cardinal</span>
          </label>
          <label for="linear">
            <input type="radio" name="interpolation" id="linear" value="linear">
            <span>linear</span>
          </label>
          <label for="step">
            <input type="radio" name="interpolation" id="step" value="step-after">
            <span>step</span>
          </label>
        </div>
      </section>-->
      <section>
        <h6>Smoothing</h6>
        <div class="smoother" ref="smoother"></div>
      </section>
      <section></section>
    </form>
    <div class="chart_container" ref="rickshaw">
      <div class="chart" ref="chart"></div>
      <div class="timeline" ref="timeline"></div>
      <div class="preview" ref="preview"></div>
    </div>
  </div>
</template>

<style src="rickshaw/rickshaw.min.css"></style>

<style>
  .rickshaw-card h1 {
    font-size: 20px;
  }

  .rickshaw-card .side_panel {
    padding: 0 20px 20px 0;
    width: 240px;
    display: inline-block;
    vertical-align: top;
  }
  .rickshaw-card .side_panel section {
    color: #505050;
    font-size: 12px;
  }
  .rickshaw-card .side_panel section h6 {
    margin: 0 0 1em 0;
    font-size: 12px;
    font-weight: normal;
  }
  .rickshaw-card .side_panel .ui-slider-horizontal {
    height: 1px !important;
    border-color: #e0e0e0;
    margin-bottom: 10px;
  }
  .rickshaw-card .side_panel .ui-slider-handle {
    border-color: #a0a0a0;
    height: 9px !important;
    width: 9px !important;
    top: -5px !important;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
  }

  .rickshaw-card section {
    border: none;
    border-top: 1px solid #eaeaea;
    padding: 15px 0;
  }

  .rickshaw-card .smoother {
    margin: 5px 0 0 10px;
    width: 90%;
  }

  .rickshaw-card .chart_container {
    position: relative;
    display: inline-block;
  }

  .rickshaw-card .legend {
    background-color: #292929;
    margin-left: 0;
    padding: 0;
    left: 0;
  }

  .rickshaw-card .legend .label {
    color: #fff;
  }

  .rickshaw-card .legend .action {
    color: #fff;
    opacity: 0.5;
  }

  .rickshaw-card .legend ul {
    padding: 0;
  }

  .rickshaw-card .chart {
    display: inline-block;
    border: 1px solid #f0f0f0;
  }

  .rickshaw-card .chart path {
    -webkit-transition: opacity 0.2s linear;
  }

  .rickshaw-card .preview {
    margin-top: 10px;
  }

  .rickshaw-card .rickshaw_graph .detail .x_label {
    background: transparent;
  }

  .rickshaw-card .chart_container {
    width: 300px;
  }

  /* .rickshaw-card .y_axis {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 40px;
  }

  .rickshaw-card .y_ticks text {
    fill: #fff
  } */
</style>

<script>
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
          /* this.graph.series.removeData()
           this.graph.series.addData({
            sensor: val.y
          }) */
          if (this.sensor.data.length > 100) {
            this.sensor.data.pop()
          }
          this.sensor.data.push({
            x: val.x,
            y: val.y
          })
          this.renderGraph()
        }
      }
    },
    computed: {
      series () {
        let palette = new Rickshaw.Color.Palette()
        return [
          {
            name: 'sensor',
            color: palette.color(),
            data: this.sensor.data
          }
        ]
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
        this.graph = new Rickshaw.Graph({
          element: this.$refs.chart,
          renderer: 'area',
          height: 400,
          width: 300,
          series: this.series
        })
        this.graph.render()
        this.hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: this.graph,
          xFormatter: x => {
            return new Date(x * 1000).toString()
          }
        })
        this.preview = new Rickshaw.Graph.RangeSlider({
          graph: this.graph,
          element: this.$refs.preview
        })
        this.x_axis = new Rickshaw.Graph.Axis.Time({
          graph: this.graph
        })
        this.x_axis.render()
        this.y_axis = new Rickshaw.Graph.Axis.Y({
          graph: this.graph,
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT
        })
        this.y_axis.render()
        this.hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: this.graph,
          xFormatter: x => { return new Date(x * 1000).toString() },
          yFormatter: y => { return Math.floor(y) }
        })
        this.annotator = new Rickshaw.Graph.Annotate({
          graph: this.graph,
          element: this.$refs.timeline
        })
        this.legend = new Rickshaw.Graph.Legend({
          graph: this.graph,
          element: this.$refs.legend
        })
        this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
          graph: this.graph,
          legend: this.legend
        })
        this.order = new Rickshaw.Graph.Behavior.Series.Order({
          graph: this.graph,
          legend: this.legend
        })
        this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
          graph: this.graph,
          legend: this.legend
        })
      },
      updateGraph () {
        this.graph.update()
        this.x_axis.update()
        this.y_axis.update()
      },
      renderGraph () {
        this.graph.render()
        this.x_axis.render()
        this.y_axis.render()
      }
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    },
    created () {
      this.$nextTick(function () {
        this.buildGraph()
        window.addEventListener('resize', this.handleResize)
      })
    }
  }
</script>
<style>

</style>
