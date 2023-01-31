<template>
    <div id="background-image">
      <router-view/>
    </div>
</template>

<style>

@font-face { /* JUA 폰트 */
  font-family: "JUA";
  src: url("./assets/fonts/Jua-Regular.ttf") format("truetype");
  font-weight: normal;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  font-family: 'JUA', serif;
}

#background-image{
  background-image: url("./assets/BackgroundImage.png");
  height: 100vh;
  background-size: 100vw 100vh;
  display: flex;
  justify-content: center;
}



</style>
