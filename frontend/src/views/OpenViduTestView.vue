<template>
    <div id="pink-container">

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
      <!-- 왼쪽 박스 끝-->

      <!-- 오른쪽 박스 -->
      <div id="RightBox">

        <div id="PurpleBoxGameSetting">
          <img v-if="isOwner" src="../assets/gamesetting.png" alt="game setting img" style="width:100%; cursor:pointer;" @click="SettingVisible2=true">
          <div v-if="!isOwner">
            <h1> 게임 정보 </h1>
            <li> {{ GameMode }} </li>
            <li> {{ BasicSong }}</li>
            <li> {{ Difficulty }}</li>
          </div>
        </div>



        <div id="BlueBoxUserList">
          <button @click="isOwner=!isOwner">{{ isOwner }}</button>
          <h1>User List</h1>
          <li v-for="user in UserList" :key="user">
            {{ user }}
            <img v-if="isOwner" src="../assets/Xbox.png" alt="Xbox img" style="width:10px;">            
          </li>
        </div>

        <div id="RedBoxRightBottom">
          <img src="../assets/confsetting.png" alt="configuration setting img" 
            @click="SettingVisible=true" style="cursor:pointer; width: 45px;"
          >
          <img src="../assets/goback.png" alt="game setting img" 
            @click="leaveSession" style="cursor:pointer; width: 45px; "
          >
        </div>
      </div>
      <!-- 오른쪽 박스 끝 -->


      <!-- 게임설정 모달 창 -->
      <el-dialog v-model="SettingVisible2" title="" width="20%" 
        style="border-radius: 10px; background-color: #DFE4F6;">
        <span>
          <img src="../assets/gamesetting.png" alt="game setting img in modal" style="width: 25px;">
          게임설정
        </span>
        <hr>

        <h1 style="border:5px solid red">게임선택</h1>
        <el-radio-group v-model="GameMode" class="ml-4">
          <el-radio label="연주하기" size="large">연주하기</el-radio>
          <el-radio label="소리내기" size="large">소리내기</el-radio>
        </el-radio-group>
        <hr>
    
        <h1>곡 선택 - 곡 연주</h1>
        <el-radio-group v-model="BasicSong" class="ml-4">
          <el-radio label="비행기" size="large">비행기</el-radio>
          <el-radio label="애국가" size="large">애국가</el-radio>
        </el-radio-group>
        <hr>

        <h1>난이도 선택 - 소리내기, 운지법</h1>
        <el-radio-group v-model="Difficulty" class="ml-4">
          <el-radio label="1단계(5초)" size="large">1단계(5초)</el-radio>
          <el-radio label="2단계(3초)" size="large">2단계(3초)</el-radio>
          <el-radio label="3단계(2초)" size="large">3단계(2초)</el-radio>
        </el-radio-group>
        <hr>
        
        <template #footer>
          <el-button type="success" @click="SettingVisible2=false">설정완료</el-button>
        </template>
      </el-dialog>
      <!-- 게임설정 모달 창 끝-->

      <!-- 환경설정 모달 창 -->
      <el-dialog v-model="SettingVisible" width="20%" 
          style="border-radius: 10px; background-color: #DFE4F6;">
        <span>
          <img src="../assets/confsetting.png" alt="configuration setting img in modal" style="width: 45px;">
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
          <el-button type="success" @click="SettingVisible=false">설정완료</el-button>
        </template>
      </el-dialog>
      <!-- 환경설정 모달 창 끝-->
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


      // 환경설정 모달
      SettingVisible: false,
      MusicVolume: ref(0),
      EffectVolume: ref(0),
      Cam: false,
      MiC: false,
      
      // 게임설정 모달
      SettingVisible2: false,
      GameMode: ref(0),
      BasicSong: ref(0),
      Difficulty: ref(0),


      // 사용자 목록
      isOwner: false,
      UserList: ['user1','user2','user3'],
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

  li {
    text-align: left;;
    margin-left: 5px;
  }
  #pink-container{
    width: 95vw;
    height: 95vh;
    background-color: #F2E6E6;
    margin: auto;
    border-radius: 30px;
    padding:0;
    display: flex;
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
    width: 85%;
    
  }
  #YellowBoxVideo{
    border: 5px solid yellow;
    display: flex;
    width:99%;
    height:80%;
    margin: 0;
    padding: 0;
  }
  #GreenBoxChat{
    border: 5px solid green;
    display: inline-block;
    width: 85%;
    height: 15%; 
    margin: 0;
    padding: 0;
  } 
  #OrangeBoxStart{
    border: 5px solid orange;
    display: inline-block;
    width: 12%;
    height: 15%;
    margin: 0;
    padding: 0;
  }




  #RightBox{
    border: 5px solid hotpink;
    margin: 0;
    padding: 0;
    width: 15%;
  }
  #PurpleBoxGameSetting{
    border : 5px solid purple;
    padding: 0;
    margin: 0;
    height: 25%;
  }
  #BlueBoxUserList{
    margin: 0;
    padding: 0;
    border: 5px solid blue;
    height: 63%;
  }
  #RedBoxRightBottom{
    margin: 0;
    padding: 0;
    border: 5px solid red;
    display: flex;
    justify-content: space-between;
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