<template>
    <div>
        <SoloTutorialMain @click-complete-tutorial-Button="closeTutorial"/>
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
        closeTutorial() {
            this.$emit('close-tutorial')
        }
    }
}
</script>

<style>


</style>