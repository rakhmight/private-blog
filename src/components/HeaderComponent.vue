<template>
  <v-app-bar :elevation="9" color="#1a1a1a" theme="dark">
    <v-container class="d-flex flex-row align-center justify-center">
      <div class="d-flex flex-row align-center justify-center">
        <div class="app-bar-img mr-2"></div>
        <v-app-bar-title class="header-title"
          >Интелегенция Ташкента</v-app-bar-title
        >
      </div>
    </v-container>

    <v-tooltip
      theme="dark"
      v-if="$route.meta.userArea == 'map'"
      text="Перейти в карту"
    >
      <template v-slot:activator="{ props }">
        <v-icon class="tomap" v-bind="props" @click="toMap"
          >mdi-map-marker</v-icon
        >
      </template>
    </v-tooltip>
    <v-tooltip
      theme="dark"
      v-if="$route.meta.userArea == 'blog'"
      text="Перейти в блог"
    >
      <template v-slot:activator="{ props }">
        <v-icon class="tomap" v-bind="props" @click="toMain">mdi-post</v-icon>
      </template>
    </v-tooltip>
    <v-tooltip
      theme="dark"
      text="Ввести другой код"
      v-if="$route.meta.userArea == 'blog' || $route.meta.userArea == 'map'"
    >
      <template v-slot:activator="{ props }">
        <v-icon class="toback" v-bind="props" @click="$router.push('/')"
          >mdi-arrow-left-circle</v-icon
        >
      </template>
    </v-tooltip>
  </v-app-bar>
</template>

<style scoped>
.tomap {
  position: absolute;
  right: 20px;
}
.toback {
  position: absolute;
  left: 20px;
}
</style>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toMap() {
      this.$router.push("/map");
    },
    toMain() {
      this.$router.push("/blog");
    },
  },
};
</script>

<style scoped>
.app-bar-img {
  width: 30px;
  height: 30px;
  background-image: url("@/assets/media/mustache.png");
  background-size: contain;
}

@media only screen and (max-width: 770px) {
  .header-title {
    font-size: 1rem;
  }
  .app-bar-img {
    width: 25px;
    height: 25px;
  }
}
</style>
