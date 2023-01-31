<template>
    <div class="pink-container-solo">
        <SoloAnalizeMain/>
    </div>
</template>

<script>
import SoloAnalizeMain from '@/components/solo/SoloAnalizeMain.vue';

export default {
    name: 'SoloAnalizeView',
    components: {
        SoloAnalizeMain
    }

}
</script>

<style>
.pink-container-solo{
    width: 50vw;
    height: 95vh;
    background-color: #F2E6E6;
    margin: auto;
    border-radius: 30px;
    position: relative;
    z-index: 2;
}
</style>