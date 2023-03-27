<template>
  <v-container>
    <div class="content">
      <div class="posts__wrapper" v-if="posts.length">
        <post-component
          v-for="(post, i) in posts"
          :key="i"
          :post="post"
          :postID="i"
          :doReaction="makeReaction"
        />
      </div>

      <div class="not-content" v-if="!posts.length">
        <div
          class="d-flex flex-column align-center justify-center w-100 h-100"
          v-if="!posts.length && !loader"
        >
          <div>
            <v-img
              src="@/assets/media/rabbit-in-the-hat.png"
              width="65px"
              height="65px"
            ></v-img>
          </div>
          <h3 class="mt-2">Публикаций нет</h3>
          <a @click="$router.push('/')" style="cursor: pointer" class="mt-3"
            >Ввести другой код</a
          >
        </div>

        <div
          class="d-flex flex-column align-center justify-center w-100 h-100"
          v-if="loader"
        >
          <v-progress-circular
            :size="50"
            color="#fff"
            indeterminate
            class="mt-10"
            style="margin: 0 auto"
          ></v-progress-circular>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import PostComponent from "@/components/PostComponent.vue";
import { mapGetters } from "vuex";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/main.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default {
  data() {
    return {
      posts: [],
      loader: true,
    };
  },
  methods: {
    async loadPosts() {
      if (this.getCode) {
        const docRef = query(
          collection(db, "codes"),
          where("code", "==", this.getCode)
        );
        try {
          const docSnap = await getDocs(docRef);
          if (docSnap.docs.length) {
            docSnap.forEach((doc) => {
              let claimDocs = doc.data();
              if (claimDocs.posts) {
                if (claimDocs.posts.length) {
                  this.posts = [...claimDocs.posts];
                }
              }
            });
          }
          this.loader = false;
        } catch (error) {
          console.error("Ошибка сервера: ", error);
          this.$router.push("/");
        }
      }
    },

    makeReaction(postID, reactionID) {
      let reactionsStore = localStorage.getItem("reactions");

      if (reactionsStore) {
        let store = JSON.parse(reactionsStore);
        let successSearch = false;
        let hasBeen = false;

        store = store.map((el) => {
          // ищем код
          if (el.code == this.getCode) {
            successSearch = true;

            el.reactions.map((obj) => {
              if (obj.post == postID) {
                // ошибка, реакция уже есть
                hasBeen = true;
              }
            });

            // кидаем новую реакцию
            if (!hasBeen) {
              el.reactions.push({
                post: postID,
                reaction: reactionID,
              });

              this.posts[postID].reactions[reactionID].counter += 1;
              this.shootReaction(postID, reactionID);
              this.saveReaction(postID, reactionID);
            }
          }
          return el;
        });

        // если кода нет, то добавляем
        if (!successSearch) {
          store.push({
            code: this.getCode,
            reactions: [
              {
                post: postID,
                reaction: reactionID,
              },
            ],
          });

          localStorage.setItem("reactions", JSON.stringify(store));
          if (!hasBeen) {
            this.posts[postID].reactions[reactionID].counter += 1;
            this.shootReaction(postID, reactionID);
            this.saveReaction(postID, reactionID);
          }
        }
        localStorage.setItem("reactions", JSON.stringify(store));
      } else {
        let store = [
          {
            code: this.getCode,
            reactions: [
              {
                post: postID,
                reaction: reactionID,
              },
            ],
          },
        ];

        localStorage.setItem("reactions", JSON.stringify(store));
        this.saveReaction(postID, reactionID);
        this.posts[postID].reactions[reactionID].counter += 1;
        this.shootReaction(postID, reactionID);
      }
    },

    shootReaction(postID, emojiID) {
      const confetti = require("canvas-confetti");

      var myCanvas = document.createElement("canvas");
      let target = document.getElementById(`reaction-${postID}-${emojiID}`);
      target.appendChild(myCanvas);

      var myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true,
      });

      var defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 1,
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      };

      function shoot() {
        myConfetti({
          ...defaults,
          particleCount: 5,
          scalar: 1.2,
          shapes: ["star"],
        });

        myConfetti({
          ...defaults,
          particleCount: 2,
          scalar: 0.75,
          shapes: ["circle"],
        });
      }

      shoot();
      setTimeout(() => {
        myCanvas.remove();
      }, 2000);
    },

    async saveReaction(postID, reactionID) {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, "system_call@bot.dev", "25566dev")
        .then(async () => {
          let currentDoc;
          let documentID;

          const docRef = query(
            collection(db, "codes"),
            where("code", "==", this.getCode)
          );
          const docSnap = await getDocs(docRef);
          if (docSnap.docs.length) {
            docSnap.forEach((doc) => {
              currentDoc = doc.data();
              documentID = doc.id;
            });
          }
          let currentDocPosts = currentDoc.posts;
          currentDocPosts[postID].reactions[reactionID].counter += 1;

          const docUpdRef = doc(db, "codes", documentID);
          await updateDoc(docUpdRef, {
            posts: [...currentDocPosts],
          });
        })
        .then(() => {
          signOut(auth).catch((error) => {
            console.error("Some error with DB: ", error);
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    },
  },
  computed: mapGetters(["getCode"]),
  mounted() {
    if (!this.getCode) {
      this.$router.push("/");
    } else {
      this.loadPosts();
    }
  },
  components: {
    PostComponent,
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  margin-top: 20px;
}
.posts__wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}
.not-content {
  height: 70vh;
  width: 100%;
}
</style>
