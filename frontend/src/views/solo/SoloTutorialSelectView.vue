a<template>
    <div class="pink-container tutorial-container">
        <SoloTutorialSelect/>
    </div>
</template>

<script>
import SoloTutorialSelect from '@/components/solo/SoloTutorialSelect.vue';

export default {
    name: 'SoloTutorialSelectView',
    components: {
        SoloTutorialSelect
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