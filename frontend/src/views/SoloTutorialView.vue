<template>
    <div class="pink-container tutorial-container">
        <SoloTutorialMain/>
    </div>
</template>

<script>
import SoloTutorialMain from '@/components/solo/SoloTutorialMain.vue';

export default {
    name: 'SoloTutorialView',
    components: {
        SoloTutorialMain
    },
    methods: {
    }
}
</script>

<style>
.tutorial-container{
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>