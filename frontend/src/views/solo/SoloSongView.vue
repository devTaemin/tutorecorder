<template>
    <div class="pink-container">
        <SoloSongMain/>
    </div>
</template>

<script>
import SoloSongMain from '@/components/solo/SoloSongMain.vue';

export default {
    name: 'SoloSongView',
    components: {
        SoloSongMain
    }
}
</script>

<style>
.pink-container{
    width: 95vw;
    height: 95vh;
    background-color: #F2E6E6;
    margin: auto;
    position: relative;
    z-index: 2;
    border-radius: 30px;
}
</style>