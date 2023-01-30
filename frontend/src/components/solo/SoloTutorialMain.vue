<template>
    <div>
        <div>
            <iframe width="90%" style="aspect-ratio:16/9;" src="https://www.youtube.com/embed/z1igNLdMSJk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <el-button id="solo-complete-button" type="success" @click="completeTutorial">완료하기</el-button>
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
            this.$emit('click-complete-tutorial-Button')
        }
    }


}
</script>

<style>
#solo-complete-button{
    width: 90%;
    height: 40px;
    font-size: 26px;
    margin-top: 10px;
}
</style>