<template>
  <!-- <div id="main-container" class="container">
    <div id="join" v-if="!isSession">
      <div>입장 화면</div>
      <div id="join-dialog" class="jumbotron vertical-center">
        <h1>비디오 세션 생성</h1>
        <div class="form-group">
          <p>
            <label>Participant</label>
            <input v-model="myUserName" class="form-control" type="text" required />
          </p>
          <p>
            <label>Session</label>
            <input v-model="mySessionId" class="form-control" type="text" required />
          </p>
          <p>
            <button @click="joinSession()">Join</button>
          </p>
        </div>
      </div>
    </div>
  </div> -->

  <div id="session">
    <div id="session-header">
      <h1 id="session-title">{{ isSession }}</h1>
      <input type="button" id="buttonLeaveSession" @click="leaveSession" value="Leave session" />
    </div>
    <span id="main-video">
      <user-video :stream-manager="mainStreamManager"/>
    </span>
    <span id="video-container">
      <user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)"/>
      <user-video v-for="sub in subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
    </span>
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
    ...mapActions(['initMyUserName']),

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
              resolution: "360x240",
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

      this.initMyUserName();
      window.removeEventListener("beforeunload", this.leaveSession);
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