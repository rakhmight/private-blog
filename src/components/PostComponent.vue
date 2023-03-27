<template>
  <div class="post__wrapper">
    <div class="post">
      <div class="post__header d-flex flex-row">
        <v-icon color="var(--second-color)">mdi-calendar-range</v-icon>
        <p style="color: var(--second-color)" class="ml-1">{{ post.date }}</p>
      </div>
      <v-divider class="mt-2 mb-3"></v-divider>
      <div class="post__media" v-if="post.media.length">
        <v-carousel
          theme="dark"
          :show-arrows="post.media.length != 1"
          hide-delimiter-background
        >
          <template v-slot:prev="{ props }" v-if="post.media.length != 1">
            <v-btn
              variant="text"
              color="var(--second-color)"
              @click="props.onClick"
              ><span style="font-size: 2em">←</span></v-btn
            >
          </template>
          <template v-slot:next="{ props }" v-if="post.media.length != 1">
            <v-btn
              variant="text"
              color="var(--second-color)"
              @click="props.onClick"
              ><span style="font-size: 2em">→</span></v-btn
            >
          </template>
          <v-carousel-item
            v-for="(photo, i) in post.media"
            :key="i"
            :src="photo"
            contain
          ></v-carousel-item>
        </v-carousel>
      </div>
      <v-divider class="mt-3 mb-2" v-if="post.media.length"></v-divider>
      <div class="post__content">
        <p class="post-text">
          {{ post.content }}
        </p>
      </div>
    </div>
    <div class="post__footer" v-if="post.reactions.length">
      <div
        class="reaction d-flex flex-row align-center"
        v-for="(reaction, i) in post.reactions"
        :key="i"
      >
        <div class="reaction__emoji" @click="makeReaction(i)">
          {{ reaction.emoji }}
          <div
            class="reaction-animate"
            :id="'reaction-' + postID + '-' + i"
          ></div>
        </div>
        <p>{{ reaction.counter }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    postID: Number,
    doReaction: Function,
  },
  methods: {
    makeReaction(emoji) {
      this.doReaction(this.postID, emoji);
    },
  },
};
</script>

<style scoped>
.post {
  width: 900px;
  max-width: 900px;
  padding: 15px;
  border-radius: 5px 5px 0 0;
  background-color: var(--block-color);
}
.post-text {
  text-indent: 20px;
  text-align: justify;
  padding: 0 5px;
}
.post__footer {
  background: var(--special-color);
  height: 40px;
  border-radius: 0 0 5px 5px;
  display: flex;
  flex-direction: row;
  padding: 0 15px;
  gap: 10px;
}
.reaction__emoji {
  font-size: 1.2em;
  width: 30px;
  transition: font-size 0.1s ease-in-out;
  cursor: pointer;
  position: relative;
}
.reaction-animate {
  position: absolute;
  top: -57px;
  left: -120px;
}
.reaction__emoji:hover {
  font-size: 1.45em;
}

@media only screen and (max-width: 770px) {
  .post {
    width: 100%;
    min-width: 100%;
  }
  .post__wrapper {
    width: 100%;
  }
  .post__footer {
    width: 100%;
  }
}
</style>
