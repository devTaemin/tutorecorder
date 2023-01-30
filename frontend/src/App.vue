<template>
  <div>
    <div id="background-image">
      <router-view/>
      <div class="char1 enlarge"></div>
      <div class="char2 shake"></div>
      <div class="char3 enlarge"></div>
      <div class="char4 shake"></div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
#background-image{
  background-image: url("./assets/Background/BackgroundImage.png");
  width: 100vw;
  height: 100vh;
  background-size: 100vw 100vh;
}
.char1{
  background-image: url("./assets/Background/char1.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  z-index: 1;
  height: 20vh;
  width:11.2vw;
  left: 6%;
  top: 45%;
}
.char2{
  background-image: url("./assets/Background/char2.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  z-index: 1;
  height: 20vh;
  width: 19vh;
  left: 38%;
  top: 55%;
}
.char3{
  background-image: url("./assets/Background/char3.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  z-index: 1;
  height: 15vh;
  width: 12vh;
  left: 60%;
  top: 55%;
}
.char4{
  background-image: url("./assets/Background/char4.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  z-index: 1;
  height: 13vh;
  width: 15vh;
  left: 85%;
  top: 65%;
}

.shake:hover {
  animation-name: shaking;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 0.5s;
}
@keyframes shaking {
  0% {
    transform: rotate(0deg);
  }
  30% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  90% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.enlarge:hover {
  animation-name: enlarging;
  animation-iteration-count: infinite;
  animation-duration: 1s;
}
@keyframes enlarging {
  0% {
    transform: scale(1)
  }
  5% {
    transform: scale(0.8)
  }
  60% {
    transform: scale(1.2)
  }
  70% {
    transform: scale(0.9)
  }
  80% {
    transform: scale(1.1)
  }
  90% {
    transform: scale(0.95)
  }
  100% {
    transform: scale(1)
  }
}
</style>
