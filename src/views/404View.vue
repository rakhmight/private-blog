<template>
  <div class="content">
    <div class="img"></div>
    <h1>404 Error</h1>
    <p class="mb-10">Такой страницы нет</p>

    <Transition>
      <v-icon size="30" @click="$router.push('/')" v-if="showIcon">
        mdi-arrow-left-circle
      </v-icon>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showIcon: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showIcon = true;
    }, 1000);
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.img {
  width: 35px;
  height: 35px;
  background-image: url("@/assets/media/mustache.png");
  background-size: contain;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
