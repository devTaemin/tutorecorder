<template>
    <div v-if="streamManager" id="video-div">
        <ov-video :stream-manager="streamManager" id="video-box"/>
        <div style="margin:0; padding:0;"> {{ clientData }} </div>
    </div>
</template>

<script>
import OvVideo from '@/components/video/OvVideo'

export default {
  name: 'UserVideo',
  components: {
    OvVideo,
  },
  props: {
    streamManager: Object,
  },

  computed: {
    clientData () {
        const { clientData } = this.getConnectionData();
        return clientData;
    }
  },

  methods: {
    getConnectionData() {
        const { connection } = this.streamManager.stream;
        return JSON.parse(connection.data);
    }
  }
}
</script>

<style scoped>

  #video-div{
    border-radius: 10px;
    margin: 1%;
    margin-top: 1.5%;
    margin-bottom: 1.5%;
    padding: 0;  
  }

  #video-box {
    /* border: 15px solid red;  */
    margin: 0;
    padding: 0;  
  }

</style>