<template>
    <div class="tutorial-content-container">
        <div style="margin-top:15px;" >
            <iframe width="80%" style="aspect-ratio:16/9;" :src=videoList[index]
                title="YouTube video player" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <el-button class="solo-out-button" id="solo-tutorial-button" @click="completeTutorial">나가기</el-button>
    </div>
</template>
<script>

export default {
    name: 'SoloTutorialSelect',
    props: {
    },
    data() {
        return{
            videoList: [
                'https://www.youtube.com/embed/z1igNLdMSJk', // 텅잉과 자세
                'https://www.youtube.com/embed/JK_HGv36TA4', // 바로크식 운지법
                'https://www.youtube.com/embed/Uu948PVnRQc', // 저먼식 운지법 
            ],

        }
    },
    computed:{
        index() {
            return this.$store.state.videoIndex  
        }
    },
    methods: {
        completeTutorial() {
            this.$router.push({ name: 'soloTutorial' })
        },
        prinntNum(){
            console.log(this.index)
            console.log(this.$store.state.videoIndex)
        }
        
    }


}
</script>

<style>
.tutorial-content-container{
    background-color: rgba(0, 0, 0, 0.374);
    width: 90%;
    border-radius: 30px;
}
#solo-tutorial-button{
    margin: 10px 0px 15px 0px;
    width: 80%;
}
</style>