<template>
    <div>
        <SoloMain/>
    </div>
</template>
<script>
import SoloMain from '@/components/solo/SoloMain.vue';

export default {
    name: 'SoloView',
    components: {
        SoloMain,
    },

}
</script>

<style>

.solo-analyze-button{
    background-color: #8684FF;
    color: white;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 18vh;
    height: 6vh;
    margin-right: 8vh;

}

.solo-out-button{
    background-color: #F0AFAF;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 18vh;
    height: 6vh;
}
</style>