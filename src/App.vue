<template>
  <v-app>
    <v-app-bar :elevation="9" color="#1a1a1a" theme="dark">
      <v-container class="d-flex flex-row align-center justify-center">
        <div class="d-flex flex-row align-center justify-center">
          <div class="app-bar-img mr-2"></div>
          <v-app-bar-title>Интелегенция Ташкента</v-app-bar-title>
        </div>
      </v-container>
    </v-app-bar>

    <v-main style="background: var(--bg-color)">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  position: relative;
  font-family: MontserratRegular, sans-serif;
}

.content {
  background-color: var(--bg-color);
  color: #fff;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #2e2e2e;
}

::-webkit-scrollbar-thumb {
  background-color: #ffffff;
  border-radius: 1em;
}

/*=========================| VARS |===========================*/
:root {
  --main-color: #0d5fd8;
  --bg-color: #474747;
}
/*=============================================================*/

/*=========================| FONTS |===========================*/
@font-face {
  font-family: MontserratLight;
  src: url("@/assets/fonts/montserrat/Montserrat-Light.ttf");
}
@font-face {
  font-family: MontserratThin;
  src: url("@/assets/fonts/montserrat/Montserrat-Thin.ttf");
}
@font-face {
  font-family: MontserratExtraLight;
  src: url("@/assets/fonts/montserrat/Montserrat-ExtraLight.ttf");
}
@font-face {
  font-family: MontserratMedium;
  src: url("@/assets/fonts/montserrat/Montserrat-Medium.ttf");
}
@font-face {
  font-family: MontserratRegular;
  src: url("@/assets/fonts/montserrat/Montserrat-Regular.ttf");
}
/*=============================================================*/

.app-bar-img {
  width: 40px;
  height: 40px;
  background-image: url("@/assets/media/mustache.png");
  background-size: contain;
}
</style>
