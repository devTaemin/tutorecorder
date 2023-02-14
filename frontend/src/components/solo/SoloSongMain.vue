<template>
<div class="container">
    <el-row class="game-main-container">
        <div class="song-game-start" id="img-ready">
          <img class="ready-img" src="../../assets/game/song/prev_msg.png" alt="">
        </div>
        <el-col :span="22" class="game-main-note song-game-ready" id="game-part">
            <!-- 문제 나오는 부분 -->
        </el-col>
    </el-row>
    <el-row class="game-sub-container">
        <el-col :span="15" class="game-sub-my-cam">
            <user-video :stream-manager="mainStreamManager"/>
        </el-col>
        <el-col :span="8" :offset="1" class="game-sub-info">
            <div class="game-sub-title font" id="song-title">곡 선 택</div>
            <div class="game-sub-img no-image" id="game-BG">
                <!-- 곡 이미지 배경 -->
                <div class="game-sub-setting">
                  <!-- 곡 세팅 -->
                </div>
            </div>
            <div class="game-sub-button">
                <!-- <el-button class="solo-analyze-button" @click="goSoloAnalize">분석</el-button> -->
                <el-button class="solo-out-button" @click="goSolo">나가기</el-button>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>

import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "@/components/video/soloUserVideo.vue"
import { mapActions } from 'vuex'

axios.defaults.headers.post["Content-Type"] = "application/json";

const APPLICATION_SERVER_URL = "http://localhost:5000/";
// const APPLICATION_SERVER_URL = "https://i8c206.p.ssafy.io/";

export default {
    name: 'SoloSongMain',
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
    methods: {
        goSoloAnalize() {
            this.$router.push({ name: 'soloAnalize' })
        },
        goSolo() {
            this.$router.push({ name: 'solo' })
        },

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
        }, //joinSession 함수 끝

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
    mounted() {
        this.joinSession()
    }
}

</script>

<script setup>
import { onMounted } from 'vue';

var W = Object.defineProperty
var R = Object.getOwnPropertyDescriptor
var B = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6]
var O = 1e3 / 60
var q = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
var G = [262, 278, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494]
var g = (a, e, t, r) => {
    for (var i = r > 1 ? void 0 : r ? R(e, t) : e, c = a.length - 1, s; c >= 0; c--)
      (s = a[c]) && (i = (r ? s(e, t, i) : s(i)) || i);
    return r && i && W(e, t, i), i;
  }
  var j = [
      {
        title: "애국가",
        singer: "",
        author: "nobody",
        image: "nationalflag.png",
        score: `t60 o3 l4
d'동'g.'해'f+8'물'e'과' g'백'd'두'c-'산'd'이' g'마'a8'르'b8'고'b+.'닳'b8'도' a2'록'.r
>d.'하'c8'느'<b'님'a'이' g'보'f+8'우'e8d'하'c-'사' d'우'g'리'a8'나'a8'라'b'만' g2.'세'r
f+.'무'g8a'궁1'f+'화' b.'삼'>c8d'천'<b'리' a'화'g'려'f+'강'g a2.'산'r
>d.'대'c8'한'<b'사'a'람' g'대'f+8'한'e8d'으'c-'로' d'길'g'이'a8'보'a8'전'b'하'g2.'세'r`,
      },
      {
        title: "비행기",
        singer: "",
        author: "nobody",
        image: "airplane.png",
        score: `t80 o3 l4
e8.'떴' d16'다' c8'떴' d+8'다' e8'비' e8'행' e'기'r
d8'날' d8'아' d'라' e8'날' e8'아' e'라'r
e8.'높' d16'이' c8'높' d+8'이' e8'날' e8'아' e'라'r
d8'우' d8'리' e8.'비' d16'행' c2'기'r`,
      },
      {
        title: "구슬비",
        singer: "",
        author: "nobody",
        image: "beadrain.png",
        score: `t80 o3 l4
e8.'송' g8'알' g8'송' f8'알' e8'싸' g8'리' g'잎' f'에' e'은' g'구' f.'슬'r
d8'조' f8'롱' f8'조' e8'롱' d8'거' f8'미' f8'줄' e8'에' d'옥' f'구' e.'슬'r
c8.'대' c8'롱' e8'대' g8'롱' c.'풀' a8'잎' g8'마' g8'다' a'총' a.'총'r
e8'방' g8'긋' g8.'웃' f8'는' e8'꽃' g8'잎' g8'마' f8'다' e8'송' d8'송' c8.'송'r`,
      },
    ]
    var count = 0;
    var time = 0;
    var index = 0;
    var temp = 0;
    var arr;
    var before = 0;

// ------------------------- function --------------------------
function A(a) {
    return (
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? (this.A = function (t) {
            return typeof t;
          })
        : (this.A = function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
      A(a)
    );
  }
function F(a, e, t) {
    var r = t.value;
    if (typeof r != "function")
      throw new TypeError(
        "@boundMethod decorator can only be applied to methods not: ".concat(A(r))
      );
    var i = !1;
    return {
      configurable: !0,
      get: function () {
        if (i || this === a.prototype || Object.prototype.hasOwnProperty.call(this, e) || typeof r != "function")   return r;
        
        
        var s = r.bind(this);
        return (
          (i = !0),
          Object.defineProperty(this, e, {
            configurable: !0,
            get: function () {
              return s;
            },
            set: function (y) {
              (r = y), delete this[e];
            },
          }),
          (i = !1),
          s
        );
      },
      set: function (s) {
        r = s;
      },
    };
  }
function z(a) {
    var e;
    return (
      typeof Reflect != "undefined" && typeof Reflect.ownKeys == "function"
        ? (e = Reflect.ownKeys(a.prototype))
        : ((e = Object.getOwnPropertyNames(a.prototype)),
          typeof Object.getOwnPropertySymbols == "function" &&
            (e = e.concat(Object.getOwnPropertySymbols(a.prototype)))),
      e.forEach(function (t) {
        if (t !== "constructor") {
          var r = Object.getOwnPropertyDescriptor(a.prototype, t);
          typeof r.value == "function" && Object.defineProperty(a.prototype, t, F(a, t, r));
        }
      }),
      a
    );
  }
function b() {
    return arguments.length === 1 ? z.apply(void 0, arguments) : F.apply(void 0, arguments);
  }
function v(a, e, t) {
    let r = document.createElement(a);
    if (
      (Object.keys(e).forEach((i) => {
        if (i === "class") {
          let c = e[i];
          if (Array.isArray(c)) {
            for (let j=0; j<c.length; j++) {
              r.classList.add(c[j])
            }
          } else if (c == [c]) {
            r.classList.add(e[i]);
          }
        } else r.setAttribute(i, e[i]);
      }),
      typeof t == "string")
    ) {
      let i = document.createTextNode(t);
      r.appendChild(i);
    } else
      Array.isArray(t)
        ? t.forEach((i) => {
            r.appendChild(i);
          })
        : t !== void 0 && r.appendChild(t);
    return r;
  }
  // 버튼 만드는 함수
function w(a) {
  let span = v("span", {id: "innerSpan", style: "display: inline-flex; align-items: center;"}, a)
  let button = v("button", {class: "el-button", type: "button",id: "startBtn"}, span)
  button.classList.add("solo-start-button-disable")
  button.disabled = true
  return button
}

function V(a) {
  let e = 4,
    t,
    r = 120,
    i = (60 * 1e3) / r,
    c = 4,
    s = i,
    n = 0;
  a = a.toUpperCase().replace(/\b/g, "");
  let y = a.length,
    d = 0,
    o = "",
    p = null,
    m = [];
  function f() {
    n++, (t = a[n]);
  }
  function L() {
    let l = { note: 0, octav: e, length: s, start: d },
      S = [1],
      M = !1;
    for (l.note = q.indexOf(t), f(); n < y; )
      if (["+", "#", "-"].includes(t))
        (l.note += t !== "-" ? 1 : -1),
          l.note < 0 ? (l.octav--, (l.note += 12)) : l.note > 11 && (l.octav++, (l.note -= 12)),
          f();
      else if (/[0-9]/.test(t)) {
        for (o = ""; /[0-9]/.test(t); ) (o += t), f();
        o.length > 0 && (l.length = (i * 4) / parseInt(o, 10));
      } else if (t === ".") S.push(S[S.length - 1] / 2), f();
      else if (/['"]/.test(t)) {
        for (f(), o = ""; !/['"]/.test(t); ) (o += t), f();
        (l.lylic = o), (o = ""), f();
      } else if (t === "&") (M = !0), f();
      else break;
    let u = 0;
    S.forEach((k) => {
      u += k * l.length;
    }),
      (l.length = u),
      p && p.note === l.note && p.octav === l.octav
        ? ((p.length += l.length), (l = p))
        : m.push(l),
      (p = null),
      M && (p = l),
      (d += u);
  }
  function D() {
    for (o = "", f(); t !== "]"; ) (o += t), f();
    let l = o.length;
    if (l === 0) return;
    let S = 0,
      M = 0;
    for (let u = m.length - 1; u >= 0; u--)
      if ((m[u].note !== -1 && S++, S === l)) {
        M = u;
        break;
      }
    for (let u = M, k = 0; k < l && u < m.length; u++)
      m[u].note !== -1 && ((m[u].lylic = o[k]), k++);
    o = "";
  }
  function h() {
    for (o = "", f(); /[0-9]/.test(t); ) (o += t), n++, (t = a[n]);
    (r = parseInt(o)), (i = (60 * 1e3) / r), (s = (i * 4) / c), (o = "");
  }
  function T() {
    for (n++, o = ""; /[0-9]/.test(a[n]); ) (o += a[n]), n++;
    (c = parseInt(o, 10)), (s = (i * 4) / c);
  }
  for (; n < y; )
    switch (((t = a[n]), t)) {
      case "T":
        h();
        break;
      case "C":
      case "D":
      case "E":
      case "F":
      case "G":
      case "A":
      case "B":
      case "R":
        L();
        break;
      case ">":
        (e = Math.min(8, e + 1)), n++;
        break;
      case "<":
        (e = Math.max(0, e - 1)), n++;
        break;
      case "O":
        n++, (t = a[n]), (e = parseInt(t));
        break;
      case "L":
        T();
        break;
      case "[":
        D();
        break;
      default:
        n++;
        break;
    }
  return m;
}

function K(a) {
  var e = 12 * (Math.log(a / 440) / Math.log(2));
  return Math.round(e) + 69;
}
function makeSwitch() {
  let outsideDiv = v("div", {class: ["el-switch", "is-checked", "mb-2"], style:"--el-switch-on-color:#13ce66; --el-switch-off-color:#ff4949;" , id: "outside-div"}, )
  let inputPart = v("input", { class:"el-switch__input", type: "checkbox", role:"switch", "aria-checked": "true", "aria-disabled": "false", "true-value": "true", "false-value":"false", "id": "check-box"})
  let exSpan_off = v("span", {class:["el-switch__label", "el-switch__label--left"], id: "ex-span-off"})
  let inSpan_off = v("span", {"aria-hidden": "true", id:"in-span-off"}, "OFF")
  let exter_core = v("span", {class: "el-switch__core", id: "exter-core"})
  let inner_core = v("div", {class: "el-switch__action", id: "inner-core"})
  let exSpan_on = v("span", {class: ["el-switch__label", "el-switch__label--right", "is-active"], id: "ex-span-on"})
  let inSpan_on = v("span", {"aria-hidden": "false", id: "in-span-on"}, "ON")

  exter_core.classList.add("can-click")
  exSpan_on.classList.add("can-click")
  exSpan_off.classList.add("can-click")

  exSpan_off.appendChild(inSpan_off)
  exter_core.appendChild(inner_core)
  exSpan_on.appendChild(inSpan_on)
  outsideDiv.appendChild(inputPart)
  outsideDiv.appendChild(exSpan_off)
  outsideDiv.appendChild(exter_core)
  outsideDiv.appendChild(exSpan_on)

  return outsideDiv
}

  // ------------------- class -------------------------------
class H {
  _canvas;
  _notes;
  playerScore = 0;
  _oct = 0;
  _elapsed = 0;
  _lastTime = 0;
  _screenWidth = 600;
  _screenTime = 600 * (1e3 / 60);
  _playScore = [];
  _volumeElem;
  _toneElem;
  _inited = !1;
  _currentNote = null;
  constructor() {
    (this._canvas = document.createElement("canvas")),
      (this._canvas.width = this._screenWidth), // 악보 가로
      (this._canvas.height = 140), // 악보 세로
      (this._canvas.style.width = "100%"); // 악보 가로 스타일 설정
      (this._notes = new Array(300).fill(-1)); // fill() 메서드는 배열의 시작 인덱스부터 끝 인덱스의 이전까지 정적인 값 하나로 채웁니다.
      new ResizeObserver(this._resizeCallback).observe(this._canvas);
  }
  updateScreentime() {
    let e = this.updateScreenWidth();
    this._screenTime = e * (1e3/60);
  }
  updateScreenWidth() {
    this._screenWidth = this._canvas.offsetWidth;
  }
  renderElement() {
    return this._canvas;
  }
  _resizeCallback() {
    this._fitToContainer();
  }
  _fitToContainer() {
    this.updateScreenWidth();
    let e = this._screenWidth;
    let r = Math.floor(e / 2); // 화면의 너비 2분의 1
    this._notes.length < r // canvas의 절반의 길이보다 _notes의 길이가 더 크다면
      ? this._notes.unshift(...new Array(r - this._notes.length).fill(-1))
      : this._notes.length > r && this._notes.splice(0, this._notes.length - r);
      
  }
  start(e) {
    (this._playScore = e.slice()), (this._elapsed = -1e3);
  }
  stop() {
    this._playScore = [];
  }
  get currentTime() {
    return this._elapsed;
  }
  // 노트 찍기
  _renderNotes(e) {
    e.save();
    let t = 1e3 / 60, // 커지면 노드가 작아지고, 작아지면 노드가 커짐
      r = this._screenWidth,
      i = r / 2;
    e.translate(i, 0); // 캔버스를 이동 오른쪽에서 왼쪽으로
    let n = 40 / t,
      y = null;
    this._playScore.forEach((d) => {
      if (d.note === -1) return;
      let o = (d.start - this._elapsed) / t;
      if (o > i) return;
      let p = d.length / t - 1;
      if (o + p < -i) return;
      let m = B[d.note] * 5 + (d.octav - 3) * 35 + 150 + this._oct * 5 - 2.5;
      d.start <= this._elapsed && d.start + d.length - t >= this._elapsed
        ? ((y = d), (e.fillStyle = "orange"))
        : (e.fillStyle = "blue"), // 노드 색깔 설정
        e.fillRect(o + n, m, p, 5),
        d.lylic &&
          (e.save(), // canvas 스타일 저장
          (e.fillStyle = "black"), // 노드 아래 가사 색깔 설정
          e.translate(o + n, m), // 글씨
          e.scale(0.1, -0.1), // 글씨 크기, 글씨 위치
          e.fillText(d.lylic, 0, 5), // canvas 글씨 쓰기, "텍스트", x 위치, y 위치
          e.restore()); // canvas 스타일 불러오기
    }),
      e.restore(),
      (this._currentNote = y);
  }
  getCurrentNote() {
    return this._currentNote;
  }
  pushNote(e) {
    this._notes.push(e), this._notes.shift();
  }
  update(e) {
    this._elapsed += e;
  }
  render() {
    this.updateScreenWidth();
    this.updateScreentime();
    this._canvas.width = this._screenWidth;
    let e = this._canvas.getContext("2d"); 
    e.save(),
      (e.font = "14px monospace"), 
      (e.textBaseline = "top"), 
      e.clearRect(0, 0, this._canvas.width, 250);
    e.scale(1, -1),
      e.translate(0, -260),
      this._renderLines(e),
      (e.globalAlpha = 0.5),
      (e.fillStyle = "blue"),
      this._renderNotes(e),
      this._renderVoice(e),
      (e.strokeStyle = "yellowgreen"), 
      e.beginPath(),
      e.moveTo(this._screenWidth / 2, 140), 
      e.lineTo(this._screenWidth / 2, 300), 
      e.stroke(),
      e.restore();
      (e.font = "30px monospace"),
      e.fillText(this.playerScore.toString(), this._canvas.width - 50, 30);
  }
  _renderVoice(e) {
    (e.fillStyle = "red"),
      this._notes.forEach((t, r) => {
        if (t !== -1) {
          let i = Math.floor(t / 12) - 4,
          c = t % 12,
          y = B[c] * 5 + 80 + i * 35 - 2.5;
          e.fillRect(r, y, 1, 5);
          let num = 1e3 / 60;
          this._playScore.forEach((d) => {
            let p = d.length / num - 1;
            let m = B[d.note] * 5 + (d.octav - 3) * 35 + 150 + this._oct * 5 - 2.5;
            if(d.start <= this._elapsed && d.start + d.length - num >= this._elapsed) {
              if(!arr[index]) {
                if(this._elapsed >= p * 16) {
                  temp = p * 16;
                  if(y == m) {
                    arr[index] = true;
                    index++;
                    if(before != m) {
                      this.playerScore++;
                      before = m;
                    }
                  }
                }
              }else {
                  if(time < temp) {
                    time += temp;
                  }
                }
            }
            this.countArr = arr;
          })

        }
      });
  }
  inited() {
    this._inited = !0;
  }

  _renderLines(e) {
    (e.strokeStyle = "black"), e.beginPath(); 
    for (let t = 0; t < 5; t++)
      e.moveTo(0, t * 10 + 160), e.lineTo(this._screenWidth, t * 10 + 160); 
    e.stroke(), (e.strokeStyle = "#ddd"), e.beginPath();
  }
}

class _ {
  _handlers = new Map();
  on(e, t, r = !1) {
    this._handlers.has(e) || this._handlers.set(e, []),
    this._handlers.get(e).push({ handler: t, once: r });
  }
  emit(e, ...t) {
    if (!this._handlers.has(e)) return;
    let r = this._handlers.get(e);
    r.forEach((i) => {
      i.handler(...t);
    });
    for (let i = r.length - 1; i >= 0; i--) r[i].once && r.splice(i, 1);
  }
}

class x extends _ {
  _list = [];
    _element;
    songTitle;
    songBGI;
    constructor() {
      super();
      (this._element = document.createElement("div"));
      this._element.classList.add("song-list");
      this._element.addEventListener("click", this._clickHandler);
    }
    set list(e) {
      (this._list = e.slice()),
      this._update();
    }
    _clickHandler(e) {
      let t = e.target;
      for (; t && t.dataset.index === void 0; ) t = t.parentElement;
      if (!t) return;
      let r = this._list[parseInt(t.dataset.index, 10)];
      this.songTitle = document.getElementById("song-title")
      this.songBGI = document.getElementById("game-BG")
      this.songTitle.innerHTML = r.title;
      const startButton = document.getElementById("startBtn")
      if (r.title === "애국가") {
        if (document.getElementById("innerSpan").innerHTML === '곡을 선택해주세요') {
          document.getElementById("innerSpan").innerHTML = "시작하기"
        }
        startButton.disabled = false
        startButton.classList.remove("solo-start-button-disable")
        startButton.classList.add("solo-start-button")
        this.songBGI.classList.remove("no-image")
        this.songBGI.classList.remove("airplane")
        this.songBGI.classList.remove("beadrain")
        this.songBGI.classList.add("nationalflag")
      } else if (r.title === "비행기"){
        if (document.getElementById("innerSpan").innerHTML === '곡을 선택해주세요') {
          document.getElementById("innerSpan").innerHTML = "시작하기"
        }
        startButton.disabled = false
        startButton.classList.remove("solo-start-button-disable")
        startButton.classList.add("solo-start-button")
        this.songBGI.classList.remove("no-image")
        this.songBGI.classList.remove("nationalflag")
        this.songBGI.classList.remove("beadrain")
        this.songBGI.classList.add("airplane")
      } else if (r.title === "구슬비") {
        if (document.getElementById("innerSpan").innerHTML === '곡을 선택해주세요') {
          document.getElementById("innerSpan").innerHTML = "시작하기"
        }
        startButton.disabled = false
        startButton.classList.remove("solo-start-button-disable")
        startButton.classList.add("solo-start-button")
        this.songBGI.classList.remove("no-image")
        this.songBGI.classList.remove("nationalflag")
        this.songBGI.classList.remove("airplane")
        this.songBGI.classList.add("beadrain")
      } else {
        this.songBGI.classList.remove("beadrain")
        this.songBGI.classList.remove("nationalflag")
        this.songBGI.classList.remove("airplane")
        this.songBGI.classList.add("no-image")
      }
      this.emit("click", r);
    }
    render() {
      return this._element;
    }
    _update() {
      (this._element.innerHTML = "");
        this._list
          .map((e, t) => {
            let r = document.createElement("div");
            r.classList.add("list-item")
            r.classList.add("can-click")
            
            return (
              (r.dataset.index = t.toString()),
              (r.innerHTML = `<h2>${e.title}</h2>`),
              r
            );
          })
          .forEach((e) => this._element.appendChild(e));
    }
  }
  class U {
    list = [];
      constructor() {
        this.list = j;
      }
      getLatest() {
        return this.list.slice(0, 20);
      }
      save(e) {
        e.idx ? this.edit(e) : this.add(e);
      }
      add(e) {
        (e.idx = this.list.length), this.list.push(e);
      }
      edit(e) {
        let t = this.list.find((r) => r.idx === e.idx);
        (t.author = e.author), (t.score = e.score), (t.singer = e.singer), (t.title = e.title);
      }
  }

  class C extends _ {
    _wrapper;
      _list = new x();
      model = new U();
      constructor() {
        super();
        (this._wrapper = document.createElement("div")),
        this._wrapper.classList.add("sharer"),
        this._wrapper.appendChild(this._list.render()),
        this._list.on("click", this._listClick);
        (this._list.list = this.model.getLatest());
      }
      render() {
        return this._wrapper;
      }
      _listClick(e) {
        this.emit("song-select", e);
      }
  }


  class N extends _ {
    btnPlay;
    btnStop;
    chkMelody;
    inVolume;
    vol_label;
    settingVolume;
    buttons;
    constructor() {
      super();
      this.initElements();
    }
    initElements() {
      (this.btnPlay = w("곡을 선택해주세요")),
      (this.chkMelody = makeSwitch()),
      (this.inVolume = v("input", { class:"volume-input", type: "range", min: 0, max: 100, value: 30, step: 1 })),
      (this.vol_label = v("div", {class: "vol-label"}, "소리 조절")),
      (this.buttons = v("div", { class: "song-editor" }, [
        this.btnPlay,
      ])),
      (this.settingVolume = v("div", {class : "setting-volume"},[
        this.vol_label,
        this.chkMelody,
        this.inVolume,
      ])),

      (this.gamePart=document.getElementById("game-part")),
      (this.imgPart=document.getElementById("img-ready")),
      this.btnPlay.addEventListener("click", () => {
        if (this.btnPlay.classList.contains("solo-start-button-playgame")){
          this.btnPlay.classList.remove("solo-start-button-playgame")
          this.gamePart.classList.remove("song-game-start")
          this.imgPart.classList.remove("song-game-ready")
          this.btnPlay.classList.add("solo-start-button")
          this.gamePart.classList.add("song-game-ready")
          this.imgPart.classList.add("song-game-start")
          document.getElementById("innerSpan").innerHTML = "시작하기"
          this._clickHandler("stop");
          
        } else {
          this.btnPlay.classList.remove("solo-start-button")
          this.gamePart.classList.remove("song-game-ready")
          this.imgPart.classList.remove("song-game-start")
          this.btnPlay.classList.add("solo-start-button-playgame")
          this.gamePart.classList.add("song-game-start")
          this.imgPart.classList.add("song-game-ready")
          document.getElementById("innerSpan").innerHTML = "그만하기"
          this._clickHandler("play");
        }
      }),

      this.chkMelody.addEventListener("click", () => {
        this.outsideDiv = document.getElementById("outside-div")
        this.chkBox = document.getElementById("check-box")
        this.exSpanOff = document.getElementById("ex-span-off")
        this.inSpanOff = document.getElementById("in-span-off")
        this.exSpanOn = document.getElementById("ex-span-on")
        this.inSpanOn = document.getElementById("in-span-on")

        if (this.chkBox.getAttribute('aria-checked')=='true') {
          this.outsideDiv.classList.remove("is-checked")
          this.chkBox.setAttribute('aria-checked', false)
          this.exSpanOff.classList.add("is-active")
          this.inSpanOff.setAttribute('aria-hidden', false)
          this.exSpanOn.classList.remove("is-active")
          this.inSpanOn.setAttribute('aria-hidden', true)
          
        } else{
          this.outsideDiv.classList.add("is-checked")
          this.chkBox.setAttribute('aria-checked', true)
          this.exSpanOff.classList.remove("is-active")
          this.inSpanOff.setAttribute('aria-hidden', true)
          this.exSpanOn.classList.add("is-active")
          this.inSpanOn.setAttribute('aria-hidden', false)
        }
        this.emit("change", "melody", this.chkBox.getAttribute('aria-checked')=='true');
      }),
      this.inVolume.addEventListener("input", () => {
        this.emit("change", "volume", parseInt(this.inVolume.value, 10) / 100);
      });
      }
      set key(e) {
        this.inKey.value = e.toString();
      }
      get key() {
        return parseInt(this.inKey.value, 10);
      }
      _clickHandler(e) {
        this.emit(e);
      }
      renderSettingVolume() {
        return this.settingVolume;
      }
      renderButtons() {
        return this.buttons;
      }
  }

  class P extends _ {
    ctx;
      analyser;
      buf = new Float32Array(2048);
      pitch = -1;
      note = 0;
      octav = 0;
      inited = !1;
      constructor(e) {
        super();
        this.ctx = e; 
      }
      start() {
        if (!this.inited) {
          let e = this.ctx.createAnalyser(); 
          (this.analyser = e), (this.analyser.fftSize = 2048), this.getUserMedia();
        }
      }
      getUserMedia() {
        let e = navigator;
        e.mediaDevices === void 0 && (e.mediaDevices = {}),
          e.mediaDevices.getUserMedia === void 0 &&
            (e.mediaDevices.getUserMedia = function (r) {
              let i = e.getUserMedia || e.webkitGetUesrmedia || e.mozGetUserMedia || e.msGetUserMedia; 
              return i
                ? new Promise(function (c, s) {
                    i.call(navigator, r, c, s);
                  })
                : Promise.reject(new Error("getUserMedia is not supported"));
            });
        let t = { audio: !0 };
        e.mediaDevices.getUserMedia(t).then((r) => {
          this.ctx.createMediaStreamSource(r).connect(this.analyser),
            (this.inited = !0),
            this.emit("inited");
        });
      }
      update() {
        this.ctx.resume();
        if (!this.inited) return;
        this.analyser.getFloatTimeDomainData(this.buf);
        let t = this.correlate(this.buf, this.ctx.sampleRate);
        (this.pitch = t),
          t === -1
            ? (this.note = -1)
            : ((this.note = K(t)), (this.octav = Math.floor(this.note / 12) - 1)),
            this.emit("note", this.note);
      }
      correlate(e, t) {
        if (this.isSilentBuffer(e)) return -1;
        let r = 0.2,
          i = this.trimBuffer(e, r),
          c = i.length,
          s = new Array(c).fill(0);
        for (let h = 0; h < c; h++) for (let T = 0; T < c - h; T++) s[h] = s[h] + i[T] * i[T + h];
        let n = 0;
        for (; s[n] > s[n + 1]; ) n++;
        let y = -1,
          d = -1;
        for (let h = n; h < c; h++) s[h] > y && ((y = s[h]), (d = h));
        let o = d,
          p = s[o - 1],
          m = s[o],
          f = s[o + 1],
          L = (p + f - 2 * m) / 2,
          D = (f - p) / 2;
        return L && (o = o - D / (2 * L)), t / o;
      }
      isSilentBuffer(e) {
        let t = e.length,
          r = 0;
        for (let i = 0; i < t; i++) r += e[i] * e[i];
        return (r = Math.sqrt(r / t)), r < 0.01;
      }
      trimBuffer(e) {
        let r = e.length,
          i = 0,
          c = r - 1,
          s = 0.2;
        for (let n = 0; n < r / 2; n++)
          if (Math.abs(e[n]) < s) {
            i = n;
            break;
          }
        for (let n = 1; n < r / 2; n++)
          if (Math.abs(e[r - n]) < s) {
            c = r - n;
            break;
          }
        return e.slice(i, c);
      }
  }

  class I {
    _ctx;
        _oscillator;
        _gain;
        constructor(e) {
          (this._ctx = e),
            (this._oscillator = this._ctx.createOscillator()),
            (this._oscillator.type = "sine"),
            this._oscillator.frequency.setValueAtTime(0, this._ctx.currentTime),
            this._oscillator.start(),
            (this._gain = this._ctx.createGain()),
            this._oscillator.connect(this._gain),
            (this._gain.gain.value = 0.5),
            this._gain.connect(this._ctx.destination);
      }
      setVolume(e) {
        this._gain.gain.value = e;
      }
      getVolume() {
        return this._gain.gain.value;
      }
      playTone(e) {
        this._oscillator.frequency.setValueAtTime(e, this._ctx.currentTime);
      }
      playNote(e, t = 0) {
        let r = this._noteToFreq(e, t);
        this.playTone(r);
      }
      _noteToFreq(e, t) {
        if (!e) return 0;
        let r = e.note + t,
          i = e.octav;
        for (; r < 0; ) (r += 12), i--;
        for (; r > 11; ) (r -= 12), i++;
        let c = G[r];
        if (i < 4) for (let s = i; s < 4; s++) c = (c / 2) | 0;
        else if (i > 4) for (let s = 4; s < i; s++) c *= 2;
        return c;
      }
  }

  class E {
    detector;
    drawer;
    player;
    wrapper;
    lastTime = 0;
    elapsed = 0;
    audio;
    inited = !1;
    playerScore = 0;
    key = 0;
    playMusic = !0;
    sharer = new C(); 
    songEditor = new N();

    constructor(e) {
      (this.drawer = new H()),
        this.createElements(),
        e.appendChild(this.wrapper),
        requestAnimationFrame(this.loop); 
  }
  createElements() {
    let a = document.createElement("div");
    let b = document.createElement("div");
    let c = document.createElement("div");
    let r = this.drawer.renderElement();
    let e = document.querySelector(".game-sub-img");
    let buttons = document.querySelector(".game-sub-button")
    b.appendChild(r);
    // c.appendChild(this.songEditor.render());
    c.appendChild(this.songEditor.renderSettingVolume());
    c.appendChild(this.sharer.render());
    buttons.appendChild(this.songEditor.renderButtons());
    a.appendChild(b);
    e.appendChild(c);
    this.wrapper = a;
    this.bindEvents();
  }

  bindEvents() {
    this.sharer.on("song-select", this.songSelected),
      this.songEditor.on("play", async () => {
        !this.inited || this.playSong(V(this.songEditor.score));
      }),
      this.songEditor.on("stop", this.stopSong),
      this.songEditor.on("change", (e, t) => {
        switch (e) {
          case "melody":
            this.toggleSound(t);
            break;
          case "volume":
            this.setVolume(t);
            break;
        }
      });
      this.init();
  }
  songSelected(e) {
    this.songEditor.score = e.score;
  }
  init() {
    return new Promise((e) => {
      (this.audio = new AudioContext()),
        (this.detector = new P(this.audio)),
        (this.player = new I(this.audio)),
        this.detector.on("note", this.onNote),
        this.detector.on("inited", () => {
          (this.inited = !0), this.drawer.inited(), e();
        }),
        this.detector.start(),
        this.drawer.start([]);
    });
  }
  playSong(e) {
    count = e.length;
    arr = new Array(count).fill(false);
    this.drawer.start(e);
  }
  stopSong() {
    this.drawer.start([]);
  }
  onNote(e) {
    this.drawer.pushNote(e);
  }
    loop(e) {
      this.lastTime === 0 && (this.lastTime = e);
      let t = e - this.lastTime;
      for (this.elapsed += t, this.lastTime = e; this.elapsed > O; )
        this.update(O), (this.elapsed -= O);
      this.render(), requestAnimationFrame(this.loop); 
    }
    update(e) {
      if (!!this.inited && (this.detector.update(e), this.drawer.update(e), this.playMusic)) {
        let t = this.drawer.getCurrentNote();
        this.player.playNote(t, this.key);
      }
    }
    render() {
      this.drawer.render();
    }
    setVolume(e) {
      this.player.setVolume(e);
    }
    toggleSound(e) {
      e === void 0 ? (this.playMusic = !this.playMusic) : (this.playMusic = e),
        this.playMusic || this.player.playTone(0);
    }
    setKey(e) {
      (this.key = e), (this.songEditor.key = e), (this.drawer.octav = this.key);
    }
  }

  onMounted(() => {
    g([b], H.prototype, "_resizeCallback", 1);
    g([b], x.prototype, "_clickHandler", 1);
    g([b], C.prototype, "_listClick", 1);
    g([b], N.prototype, "_clickHandler", 1);
    g([b], E.prototype, "songSelected", 1), 
    g([b], E.prototype, "stopSong", 1), 
    g([b], E.prototype, "onNote", 1), 
    g([b], E.prototype, "loop", 1); 
      new E(document.querySelector(".game-main-note"));
    })
</script>

<style>
.container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.game-main-container{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.374);
    height: 20%;
    width: 95%;
    margin-bottom: 10px;
    border-radius: 3%;
}
.song-game-ready {
  display: none;
}
.song-game-start {
  display: block;
}
#img-ready{
  height: 100%;
  width: 100%;
}
.ready-img {
  height: 100%;
  width: 100%;
}
.game-prev-msg{
  width: 80%;
  height: 80%;
  border: 3px solid red;
}
.game-prev-msg > img{
  width: 100%;
  height: 100%;
}

.prev-img {
  width: 100%;
  height: 100%;
}
.game-sub-container{
    height: 70%;
    width : 95%;
}

.game-sub-my-cam{
    height: 100%;
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 3%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.game-sub-info{
    background-color: rgba(0, 0, 0, 0.374);
    border-radius: 3%;
    height: 100%;
}
.game-sub-title{
    font-size: 5vh;
    color: white;
    margin-top: 3vh;
    margin-bottom: 10px;
}
.game-sub-img{
    width: 90%;
    height: 60%;
    margin: auto;
    aspect-ratio: 4 / 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5%;
}
.no-image {
  background-color: rgba(0, 0, 0, 0.374);
}
.airplane {
  background-image: url("@/assets/game/song/airplane.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.nationalflag{
  background-image: url("@/assets/game/song/nationalflag.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.beadrain {
  background-image: url("@/assets/game/song/beadrain.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.setting-volume {
  margin-bottom: 3vh;
  background-color: rgba(0, 0, 0, 0.374);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.vol-label{
  font-family: 'JUA', serif;
  color: white;
  margin-top: 1.5vh;
  margin-bottom: 1.5vh;
}
#outside-div{
  margin-bottom: 1.5vh;
}
.volume-input {
  cursor: url(../../assets/cursor_click.png), auto !important;
  margin-bottom: 1.5vh;
  margin-left: 1.5vw;
  margin-right: 1.5vw;
}
.song-list{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.list-item{
  background-color: rgba(0, 0, 0, 0.374);
  border-radius: 30px;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  width:fit-content
}
.list-item > h2{
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  margin-left: 3vh;
  margin-right: 3vh;
  color: white;
}
.game-sub-button{
    margin-top: 1vh;
}
.solo-start-button{
  background-color: #DDB13E !important;
  color: white !important;
  font-family: 'JUA', serif !important;
  font-size: 2vw !important;
  width: 80% !important;
  height: 6vh !important;
  margin-left: 0 !important;
  margin-top: 1.5vh;
  cursor: url(../../assets/cursor_click.png), auto !important;
  -webkit-animation: flickerAnimation 1s infinite;
  -moz-animation: flickerAnimation 1s infinite;
  -o-animation: flickerAnimation 1s infinite;
  animation: flickerAnimation 1s infinite;
}
.solo-start-button:hover {
  -webkit-animation: false;
  -moz-animation: false;
  -o-animation: false;
  animation: false;
}
.solo-start-button-playgame{
  background-color: #DD5A3E !important;
  color: white !important;
  font-family: 'JUA', serif !important;
  font-size: 2vw !important;
  width: 80% !important;
  height: 6vh !important;
  margin-left: 0 !important;
  margin-top: 1.5vh;
  cursor: url(../../assets/cursor_click.png), auto !important;
}

.solo-start-button-disable{
  background-color: #DD5A3E !important;
  color: white !important;
  font-family: 'JUA', serif !important;
  font-size: 2vw !important;
  width: 80% !important;
  height: 6vh !important;
  margin-left: 0 !important;
  margin-top: 1.5vh;
  cursor: url(../../assets/cursor_disable.png), auto !important;
  -webkit-animation: flickerAnimation 1s infinite;
  -moz-animation: flickerAnimation 1s infinite;
  -o-animation: flickerAnimation 1s infinite;
  animation: flickerAnimation 1s infinite;
}

.can-click{
  cursor: url(../../assets/cursor_click.png), auto !important;
}

</style>