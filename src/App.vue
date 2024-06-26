<template>
  <div>
    <v-app v-if="allowBrowser && blockOtherBrowserOrNotChrome">
      <header-component />

      <v-main style="background: var(--bg-color)">
        <router-view />
      </v-main>
    </v-app>

    <div
      v-if="!allowBrowser && blockOtherBrowserOrNotChrome"
      class="d-flex flex-column align-center justify-center"
      style="
        width: 100%;
        height: 100vh;
        color: #fff;
        text-align: center;
        padding: 20px;
      "
    >
      <div>
        <v-img
          src="@/assets/media/chrome.png"
          width="65px"
          height="65px"
          class="mb-3"
        ></v-img>
      </div>
      <h4>Сайт поддерживает браузер Google Chrome</h4>
      <p class="mt-3">
        Просим прощения за неудобства. Некоторые браузеры не в полной мере
        поддерживают функционал сайта.<br /><b>Это временное ограничение.</b>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import randomGenerator from "@/plugins/randomGenerator.js";
import { mapMutations } from "vuex";

export default {
  name: "App",
  data() {
    return {
      allowBrowser: false,
      blockOtherBrowserOrNotChrome: true,
    };
  },
  watch: {
    $route(to, from) {
      const routeDeep = ["/", "/blog", "/map", "/admin", "/auth"];
      const toDepth = routeDeep.indexOf(to.path);
      const fromDepth = routeDeep.indexOf(from.path);
      this.routerTransition =
        toDepth > fromDepth ? "slide-left" : "slide-right";
    },
  },
  methods: {
    ...mapMutations(["changeID"]),
  },
  mounted() {
    let platformID = localStorage.getItem("id");

    if (platformID) {
      this.changeID(JSON.parse(platformID));
    } else {
      let newID = randomGenerator(32);
      localStorage.setItem("id", JSON.stringify(newID));
      this.changeID(newID);
    }

    if (navigator) {
      if (navigator.userAgentData) {
        if (
          navigator.userAgentData.brands[0].brand == "Google Chrome" ||
          navigator.userAgentData.brands[1].brand == "Google Chrome" ||
          navigator.userAgentData.brands[2].brand == "Google Chrome"
        ) {
          this.allowBrowser = true;
        }
      }
    }
  },
  components: {
    HeaderComponent,
  },
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
  --block-color: #1f1f1f;
  --second-color: #6e6e6e;
  --special-color: #070707;
  --darkreader-bg--bg-color: #474747;
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

.slide-left-enter-active {
  animation-name: slide-left-in;
  animation-duration: 0.2s;
}
.slide-left-leave-active {
  animation-name: slide-left-out;
  animation-duration: 0.2s;
}
.slide-right-enter-active {
  animation-name: slide-right-in;
  animation-duration: 0.2s;
}
.slide-right-leave-active {
  animation-name: slide-right-out;
  animation-duration: 0.2s;
}

@keyframes slide-left-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slide-left-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes slide-right-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slide-right-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media only screen and (max-width: 770px) {
  ::-webkit-scrollbar {
    display: none;
  }
  .v-container {
    padding: 0;
  }
}
</style>
