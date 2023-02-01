<template>
    <div class="pink-container">
        <MultiSongMain/>
    </div>
</template>

<script>
import MultiSongMain from '@/components/multi/MultiSongMain.vue';

export default {
    name: 'MultiSongView',
    components: {
        MultiSongMain
    }
}
</script>

<style>

.solo-out-button{
    background-color: #F0AFAF;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 10vw;
    height: 6vh;
}

.solo-analyze-button{
    background-color: #8684FF;
    color: white;
    font-family: 'JUA', serif;
    font-size: 4vh;
    width: 10vw;
    height: 6vh;
    margin-right: 3vw;
}

</style>