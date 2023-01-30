<template>
  <div>
    <div id="background-image">
      <router-view/>
      <div class="char1 shake"></div>
      <div class="char2 shake"></div>
      <div class="char3 shake"></div>
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
/* div {
  border: 1px solid red;
} */
.char1{
  background-image: url("./assets/Background/char1.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  z-index: 1;
  height: 20vh;
  width:20vw;
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
  width: 20vh;
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
  width: 20vh;
  left: 60%;
  top: 55%;
}
.char4{
  background-image: url("./assets/Background/char4.png");
  background-size:contain;
  background-repeat:no-repeat;
  position: absolute;
  z-index: 1;
  height: 20vh;
  width: 15vh;
  left: 85%;
  top: 65%;
}

</style>
