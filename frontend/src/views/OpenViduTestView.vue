<template>
  <div>

<!-- 최상단 위치 참고용 블럭 -->
    <el-row :gutter="20">
      <el-col :span="2"><div id="ColCheck"/>1</el-col>
      <el-col :span="2"><div id="ColCheck"/>2</el-col>
      <el-col :span="2"><div id="ColCheck"/>3</el-col>
      <el-col :span="2"><div id="ColCheck"/>4</el-col>
      <el-col :span="2"><div id="ColCheck"/>5</el-col>
      <el-col :span="2"><div id="ColCheck"/>6</el-col>
      <el-col :span="2"><div id="ColCheck"/>7</el-col>
      <el-col :span="2"><div id="ColCheck"/>8</el-col>
      <el-col :span="2"><div id="ColCheck"/>9</el-col>
      <el-col :span="2"><div id="ColCheck"/>10</el-col>
      <el-col :span="2"><div id="ColCheck"/>11</el-col>
      <el-col :span="2"><div id="ColCheck"/>12</el-col>
    </el-row>

<!-- 환경설정, 세션이름, 나가기 -->
    <div id="session">
      <div id="session-header">

        <img src="../assets/confsetting.png" alt="configuration setting img"
          @click="SettingVisible=true" style="cursor:pointer; float:left; width: 45px; margin-left: 10px;"
        >

        <h1 id="session-title">{{ isSession }}</h1>
        
        <img src="../assets/goback.png" alt="game setting img" 
          @click="leaveSession" style="cursor:pointer; float: right; width: 45px; margin-right: 10px;"
        >
        <!-- <span>나가기</span> -->
        <!-- <span @click="leaveSession" style="cursor:pointer; display:flex; flex-direction: column;">
          나가기
        </span> -->

      </div>
    </div>


    <!-- 환경설정 모달 창 -->
    <el-dialog v-model="SettingVisible" title="" width="20%">
      <span>
        <img src="../assets/confsetting.png" alt="configuration setting img in modal" >
        환경설정
      </span>
      <hr>


      <h1 style="border:5px solid red">노래</h1>
      <div class="slider-demo-block">
        <el-slider v-model="MusicVolume" />
      </div>
      <hr>

      <h1>효과음</h1>
      <div class="slider-demo-block">
        <el-slider v-model="EffectVolume" />
      </div>
      <hr>
    
      <h1>카메라</h1>
      <el-radio-group v-model="Cam" class="ml-4">
        <el-radio label="1" size="large">켜기</el-radio>
        <el-radio label="2" size="large">끄기</el-radio>
      </el-radio-group>
      <hr>
  
      <h1>마이크</h1>
      <el-radio-group v-model="MiC" class="ml-4">
        <el-radio label="1" size="large">켜기</el-radio>
        <el-radio label="2" size="large">끄기</el-radio>
      </el-radio-group>
      <hr>
      
      <template #footer>
        <el-button type="success" @click="SettingVisible=false">적용</el-button>
      </template>
    </el-dialog>
    <!-- 환경설정 모달 창 -->


  
  
<!-- 내용물 -->
    <div id="BlackBoxLargestBox">

      <!-- 왼쪽 박스 -->
      <div id="LeftBox">

        <div id="YellowBoxVideo">
          <span id="main-video">
            <user-video :stream-manager="mainStreamManager"/>
          </span>
          <span id="video-container">
            <user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)"/>
            <user-video v-for="sub in subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
          </span>
        </div>

        <div id="GreenBoxChat">
          <p> chat box</p>  
        </div>

        <div id="OrangeBoxStart"> 
          <p> start box</p>
        </div>

      </div>

      <!-- 오른쪽 박스 -->
      <div id="RightBox">

        <div id="PurpleBoxGameSetting">
          <img src="../assets/gamesetting.png" alt="game setting img" style="width:100%;">
        </div>

        <div id="BlueBoxUserList">user list</div>

      </div>

    </div>
  </div>
</template>




<script>
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "@/components/video/UserVideo.vue"
import { mapActions } from 'vuex'
import { ref } from 'vue'



axios.defaults.headers.post["Content-Type"] = "application/json";

const APPLICATION_SERVER_URL = "http://localhost:5000/";


export default {
  name: 'OpenViduTestView',

  components: {
    UserVideo,
  },

  computed: {
    isSession() {
      if (this.$store.state.mySessionId !== '') {
        return this.$store.state.mySessionId
      } else {
        return 'SessionA'
      }
    }
  },

  data() {
    return {
      // OpenVidu Object
      OV: undefined,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],

      // Join form
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),

      SettingVisible: false,
      MusicVolume: ref(0),
      EffectVolume: ref(0),
      Cam: false,
      MiC: false,


    }
  },
  mounted() {
    this.joinSession()
  },

  methods: {
    ...mapActions(['initMySessionId']),

    joinSession() {
      // 1. OpenVidu 객체 가져오기
      this.OV = new OpenVidu();
      
      // 2. 세션 시작
      this.session = this.OV.initSession();

      // 3. 세션에서 일어나는 이벤트 
      // 3-1. 새로운 스트림 생성시 사용자 등록
      this.session.on("streamCreated", ({ stream }) => {
        const subscriber = this.session.subscribe(stream);
        this.subscribers.push(subscriber);
      });

      // 3-2. 스트림 말소시 사용자 제외
      this.session.on("streamDestroyed", ({ stream }) => {
        const index = this.subscribers.indexOf(stream.streamManager, 0);
        if (index >= 0) {
          this.subscribers.splice(index, 1);
        }
      })

      // 3-3. 예외 발생 시
      this.session.on("exception", ({ exception }) => {
        console.warn(exception);
      })

      // 4. 유효한 사용자 토큰과 세션에 접속하기
      this.getToken(this.$store.state.mySessionId).then((token) => {
        this.session.connect(token, { clientData: this.$store.state.myUserName })
          .then(() => {

            // 5. 카메라 설정
            let publisher = this.OV.initPublisher(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: true,
              publishVideo: true,
              // ratio: 16/9,
              resolution: "240x160",
              framerate: 30,
              insertMode: "Append",
              mirror: false,
            });

            

            this.mainStreamManager = publisher;
            this.publisher = publisher;

            // 6. 스트림 퍼블리시
            this.session.publish(this.publisher);
          })
          .catch((error) => {
            console.log("ERROR: ", error.code, error.message);
          });
      });

      window.addEventListener("beforeunload", this.leaveSession);
    },

    leaveSession() {
      // 세션 종료
      if (this.session) this.session.disconnect();

      // 모든 요소 초기화
      this.session = undefined;
      this.mainStreamManager = undefined;
      this.publisher = undefined;
      this.subscribers = [];
      this.OV = undefined;

      this.initMySessionId(); // 세션 초기화, 닉네임은 유지
      window.removeEventListener("beforeunload", this.leaveSession);
      this.$router.push({ name: 'mode' }) // 모드 선택으로 이동


    },

    updateMainVideoStreamManager(stream) {
      // 메인 비디오 적용
      if (this.mainStreamManager === stream) return;
      this.mainStreamManager = stream;
    },

    async getToken(mySessionId) {
      const sessionId = await this.createSession(mySessionId);
      return await this.createToken(sessionId);
    },

    async createSession(sessionId) {
      const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId },{
        headers: { 'Content-Type': 'application/json', },
      });
      return response.data;
    },


    async createToken(sessionId) {
      const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    }

  },


}
</script>


<style scoped>


  #ColCheck{
    border : 5px solid red
  }


  #BlackBoxLargestBox{
    display: flex;
    flex-direction: row;
    border: 5px solid black;
    margin: 0;
    padding: 0;
    margin-top:5px;
  }

  #LeftBox{
    border: 5px solid gray;
    margin: 0;
    padding: 0;
    width: 80%;
  }
  
  #RightBox{
    border: 5px solid hotpink;
    margin: 0;
    padding: 0;
    width: 18%;
  }
  
  #YellowBoxVideo{
    border: 5px solid yellow;
    display: inline-block;
    width:99%;
  }

  #GreenBoxChat{
    border: 5px solid green;
    display: inline-block;
    width: 75%; 
    margin: 0;
    padding: 0;
  }

  #OrangeBoxStart{
    border: 5px solid orange;
    display: inline-block;
    width: 15%;
    margin: 0;
    padding: 0;
  }

  #PurpleBoxGameSetting{
    top: 45px;
    right: 0px;
    border : 5px solid purple;
    padding: 0;
    margin: 0;

  }

  #session-title{
    margin: 0;
    padding: 0;
    display: inline-block;
  }

  #BlueBoxUserList{
    margin: 0;
    padding: 0;
    border: 5px solid blue;
    width: 99%;
  }

  /* volume slider */
  .slider-demo-block {
    display: flex;
    align-items: center;
  }
  .slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
  }
  /* volume slider */
</style>