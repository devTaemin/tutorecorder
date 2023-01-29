<template>
  <div>


    <el-row :gutter="20">
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>
      <el-col :span="2"><div class="grid-content ep-bg-purple"  id="ColCheck"/>1</el-col>

    </el-row>
    
    <div id="session">
      <div id="session-header">        
        <span id="ConfSetting">
          <img src="../assets/confsetting.png" alt="">
        </span>
        <h1 id="session-title">{{ isSession }}</h1>
        <input type="button" id="buttonLeaveSession" @click="leaveSession" value="Leave session" />
      </div>
    </div>

  
  
    <div id="BlackBoxLargestBox">

      <div>
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




        
      <div>
        <div id="GameSettingBox">
          <img src="../assets/gamesetting.png" alt="">
        </div>
        <div id="UserList">user list</div>
      </div>
    </div>
      
  
  </div>
</template>

<script>
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "@/components/video/UserVideo.vue"
import { mapActions } from 'vuex'

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

  }
}
</script>


<style scoped>
#ColCheck{
  border : 5px solid red
}
  #ConfSetting{
    border: 5px solid red;
    /* position: relative;  */
    /* float: left;   */

  }

  #BlackBoxLargestBox{
    display: flex;
    flex-direction: row;
    border: 5px solid black;
    margin: 0;
    padding: 0;
  }

  
  #YellowBoxVideo{
    border: 5px solid yellow;
    display: inline-block;
    width: 90%;
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

  #GameSettingBox{
    top: 45px;
    right: 0px;
    
    border : 5px solid purple;
  }

  #session-title{
    margin: 0;
    padding: 0;
    display: inline-block;
  }

  #UserList{
    margin: 0;
    padding: 0;
    border: 5px solid blue;
    
  }


</style>