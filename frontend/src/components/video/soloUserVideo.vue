<template>
    <div v-if="streamManager" id="video-div">
        <ov-video :stream-manager="streamManager"  id="video-box"/>
    </div>
</template>

<script>
import OvVideo from '@/components/video/OvVideo'

export default {
  name: 'soloUserVideo',
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
  display: inline-block;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#video-box {
  display: inline-block;
  margin: 0;
  padding: 0;
  /* flex-basis: 86.5%; */
  flex-basis: 100%;
  max-height: 100%;
  border-radius: 3%;
  transform: scaleX(-1);
}

</style>