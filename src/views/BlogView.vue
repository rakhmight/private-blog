<template>
  <v-container>
    <div class="content">
      <div class="post">
        <div class="post__header d-flex flex-row">
          <v-icon color="var(--second-color)">mdi-calendar-range</v-icon>
          <p style="color: var(--second-color)" class="ml-1">12.23.2023</p>
        </div>
        <v-divider class="mt-2 mb-3"></v-divider>
        <div class="post__media">
          <v-carousel theme="dark" show-arrows hide-delimiter-background>
            <template v-slot:prev="{ props }">
              <v-btn
                variant="text"
                color="var(--second-color)"
                @click="props.onClick"
                ><span style="font-size: 2em">←</span></v-btn
              >
            </template>
            <template v-slot:next="{ props }">
              <v-btn
                variant="text"
                color="var(--second-color)"
                @click="props.onClick"
                ><span style="font-size: 2em">→</span></v-btn
              >
            </template>
            <v-carousel-item
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              contain
            ></v-carousel-item>

            <v-carousel-item
              src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
              contain
            ></v-carousel-item>

            <v-carousel-item
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              contain
            ></v-carousel-item>
          </v-carousel>
        </div>
        <v-divider class="mt-3 mb-2"></v-divider>
        <div class="post__content"></div>
        <div class="post__footer"></div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
}

.post {
  padding: 15px;
  border-radius: 5px;
  background-color: var(--block-color);
}
</style>
