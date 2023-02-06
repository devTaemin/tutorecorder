<template>
    <div class="tutorial-content-container">
        <div style="margin-top:15px;">
            <iframe width="80%" style="aspect-ratio:16/9;" src="https://www.youtube.com/embed/z1igNLdMSJk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <el-button class="solo-out-button" id="solo-tutorial-button" @click="completeTutorial">나가기</el-button>
    </div>
</template>
<script>
export default {
    name: 'SoloTutorialMain',
    props: {
    },
    data() {
        return{
        }
    },
    methods: {
        completeTutorial() {
            this.$router.push({ name: 'solo' })
        }
    }


}
</script>

<style>
#solo-tutorial-button{
    margin: 10px 0px 15px 0px;
    width: 80%;
}
.tutorial-content-container{
    background-color: rgba(0, 0, 0, 0.374);
    width: 90%;

}
</style>