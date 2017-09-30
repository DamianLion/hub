<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="(sensor, key, index) in sensors">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-success`" slot="header">
            <i class="ti-server"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{sensor.name}}</p>
            {{sensor.value}} {{sensor.unit}}
          </div>
          <div class="stats" slot="footer">
            <i class="ti-time"></i> <timeago :since="sensor.lastUpdated" :auto-update="60"></timeago>
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-md-6 col-xs-12" v-for="(sensor, key, index) in sensors">
        <rickshaw-card :sensor="sensor"></rickshaw-card>
      </div>
    </div>

  </div>
</template>
<script>
  import axios from 'axios'
  import StatsCard from '@/components/UIComponents/Cards/StatsCard.vue'
  import RickshawCard from '@/components/UIComponents/Cards/RickshawCard.vue'

  export default {
    components: {
      StatsCard,
      RickshawCard
    },
    /**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
    data () {
      return {
        sensors: {}
      }
    },
    sockets: {
        connect () {
          console.log('socket connected')
        },
        sensorData (val) {
          this.updateSensor(val)
        }
    },
    methods: {
      updateSensor (data) {
        this.sensors.forEach((element, index, array) => {
          if (element.id === data['sensor_id']) {
            this.sensors[index].value = data.value
            this.sensors[index].lastUpdated = data.createdAt
            this.sensors[index].data.unshift(data)
            this.sensors[index].data.pop()
          }
        })
      },
      clickButton (val) {
        // $socket is socket.io-client instance
        this.$socket.emit('emit_method', val)
      }
    },
    mounted () {
      axios.get('/api/v1/sensors?graph=true')
        .then(response => {
          this.sensors = response.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>
<style>

</style>
