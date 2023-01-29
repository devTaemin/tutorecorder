<template>
    <div class="pink-container">
        <SoloSoundMain/>
    </div>
</template>

<script>
import SoloSoundMain from '@/components/solo/SoloSoundMain.vue';

export default {
    name: 'SoloSoundView',
    components: {
        SoloSoundMain
    }
}
</script>

<style>
.pink-container{
    width: 95vw;
    height: 95vh;
    background-color: #F2E6E6;
    margin: auto;
}
</style>