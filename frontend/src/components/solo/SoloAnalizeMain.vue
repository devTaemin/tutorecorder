<template>
    <div id="analize-total-container">
        <div id="analize-container">
            <div class="analize-result-title">분석결과</div>
            <div class="demo-progress">
                <div class="pitch-container">
                    <span style="color:#F44336" class="pitch">도</span>
                    <el-progress :percentage="gameResult[0]" :color="doRed"/>
                </div>
                <div class="pitch-container">
                    <span style="color:#FF5722" class="pitch">레</span>
                    <el-progress :percentage="gameResult[1]" :color="reOrange"/>
                </div>
                <div class="pitch-container">
                    <span style="color:#FFEB3B" class="pitch">미</span>
                    <el-progress :percentage="gameResult[2]" :color="miYellow"/>
                </div>
                <div class="pitch-container">
                    <span style="color:#4CAF50" class="pitch">파</span>
                    <el-progress :percentage="gameResult[3]" :color="paGreen"/>
                </div>
                <div class="pitch-container">
                    <span style="color:#03A9F4" class="pitch">솔</span>
                    <el-progress :percentage="gameResult[4]" :color="solBlue"/>
                </div>
                <div class="pitch-container">
                    <span style="color:#3F51B5" class="pitch">라</span>
                    <el-progress :percentage="gameResult[5]" :color="laIndigo"/>
                </div>
                <div class="pitch-container">
                    <span style="color:#9C27B0" class="pitch">시</span>
                    <el-progress :percentage="gameResult[6]" :color="siPurple"/>
                </div>
            </div>
            <div class="analize-result">
                <div>분석결과</div>
                <div>{{ analizeResultText }}</div>
            </div>
        </div>
        <div>
            <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
        </div>
    </div>
</template>

<script>

const pitchText = ['도', '레', '미', '파', '솔', '라', '시'];
const badTextForm = '는 연습이 많이 필요해 보여요. '
const goodTextForm = '는 아주 잘하고 있어요. '
const nomalTextForm = '는 조금만 더 연습 하면 지금보다 더 잘할 수 있어요. '
const allBad = '전체적으로 많은 연습이 필요해요. 운지법을 다르게 알고 있는 것은 아닌지 튜토리얼을 확인해보아요. '
const allNomal = '조금만 더 연습하면 더 빠르고 정확하게 연주할 수 있어요. 다시 한 번 해볼까요? '
const allGood = '훌룡해요! 이제는 노래를 연주해 보는건 어떨까요? '

export default {
    name: 'SoloAnalizeMain',
    created() {
        this.analizeResultText = ''
        const badList = [];
        const nomalList = [];
        const goodList = [];
        const gameResult = this.$store.state.gameResult
        for (let i = 0; i<7; i++) {
            if (gameResult[i].length === 0) {
                this.gameResult.push(0)
            } else {
                this.gameResult.push(((gameResult[i].reduce((a, b) => a + b, 0) / gameResult[i].length)*100).toFixed(0));
            }
        }

        console.log(this.gameResult)

        // 분석 결과를 내주기 위해서 텍스트로 변환
        for (let i=0; i<7; i++) {
            if (this.gameResult[i] < 40) {
                badList.push(pitchText[i])
            } else if (this.gameResult[i] < 70) {
                nomalList.push(pitchText[i])
            } else {
                goodList.push(pitchText[i])
            }
        }

        let badText;
        let nomalText;
        let goodText;
        if (badList.length !== 0 && badList.length !== 7) {
            badText = badList[0]
            for (let i=1; i<badList.length; i++) {
                badText = badText + ', ' + badList[i]
            }
            this.analizeResultText = badText + badTextForm
        }
        if (nomalList.length !== 0 && nomalList.length !== 7) {
            nomalText = nomalList[0]
            for (let i=1; i<nomalList.length; i++) {
                nomalText = nomalText + ', ' + nomalList[i]
            }
            this.analizeResultText += nomalText + nomalTextForm
        }
        if (goodList.length !== 0 && goodList.length !== 7) {
            goodText = goodList[0]
            for (let i=1; i<goodList.length; i++) {
                goodText = goodText + ', ' + goodList[i]
            }
            this.analizeResultText += goodText + goodTextForm
        }

        if (this.analizeResultText === '') {
            if (badList.length === 7) {
                this.analizeResultText = allBad
            } else if (nomalList.length === 7) {
                this.analizeResultText = allNomal
            } else {
                this.analizeResultText = allGood
            }

        }


    },
    data() {
        return{
            doRed: [
                { color: '#FFCDD2', percentage: 20 },
                { color: '#EF9A9A', percentage: 40 },
                { color: '#E57373', percentage: 60 },
                { color: '#EF5350', percentage: 80 },
                { color: '#F44336', percentage: 100 },
            ],
            reOrange: [
                { color: '#FFCCBC', percentage: 20 },
                { color: '#FFAB91', percentage: 40 },
                { color: '#FF8A65', percentage: 60 },
                { color: '#FF7043', percentage: 80 },
                { color: '#FF5722', percentage: 100 },
            ],
            miYellow: [
                { color: '#FFF9C4', percentage: 20 },
                { color: '#FFF59D', percentage: 40 },
                { color: '#FFF176', percentage: 60 },
                { color: '#FFEE58', percentage: 80 },
                { color: '#FFEB3B', percentage: 100 },
            ],
            paGreen: [
                { color: '#C8E6C9', percentage: 20 },
                { color: '#A5D6A7', percentage: 40 },
                { color: '#81C784', percentage: 60 },
                { color: '#66BB6A', percentage: 80 },
                { color: '#4CAF50', percentage: 100 },
            ],
            solBlue: [
                { color: '#B3E5FC', percentage: 20 },
                { color: '#81D4FA', percentage: 40 },
                { color: '#4FC3F7', percentage: 60 },
                { color: '29B6F6', percentage: 80 },
                { color: '#03A9F4', percentage: 100 },
            ],
            laIndigo: [
                { color: '#C5CAE9', percentage: 20 },
                { color: '#9FA8DA', percentage: 40 },
                { color: '#7986CB', percentage: 60 },
                { color: '#5C6BC0', percentage: 80 },
                { color: '#3F51B5', percentage: 100 },
            ],
            siPurple: [
                { color: '#E1BEE7', percentage: 20 },
                { color: '#CE93D8', percentage: 40 },
                { color: '#BA68C8', percentage: 60 },
                { color: '#AB47BC', percentage: 80 },
                { color: '#9C27B0', percentage: 100 },
            ],
            gameResult: [],
            analizeResultText: '',
        }
    },
    methods: {
        goSolo() {
            this.$router.push({ name: 'solo' })
        }
    }
}



</script>

<style>
#analize-container{
    background-color: rgba(0, 0, 0, 0.374);
    height: 80vh;
    width: 45vw;
    margin: auto;
    border-radius: 20px;
    margin-bottom: 2vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.analize-result-title{
    font-size: 2.5rem;
}

.demo-progress{
    margin-top: 3vh;
}

.demo-progress .el-progress--line{
  width: 33vw;
}

.pitch{
    font-size: 2rem;
    margin-right: 2vw;
}

.pitch-container{
    display: flex;
    justify-content: center;
}

.analize-result{
    height: 25%;
    width: 90%;
    border-radius: 20px;
    background-color: #DFE4F6;
    margin-top: 5vh;
}
</style>