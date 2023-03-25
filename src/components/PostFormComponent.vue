<template>
  <div>
    <div class="post-section">
      <v-file-input
        theme="dark"
        density="compact"
        multiple
        :rules="rules"
        variant="outlined"
        accept="image/png, image/jpeg, image/bmp, image/webm"
        prepend-icon="mdi-image-area"
        label="Загрузите фотографии"
        v-model="files"
        @click:clear="post.media = []"
        @click="post.media = []"
      ></v-file-input>
      <v-textarea
        density="compact"
        theme="dark"
        label="Текст публикации"
        variant="outlined"
        rows="3"
        v-model="post.content"
        :error="contentError"
      ></v-textarea>
      <v-select
        density="compact"
        clearable
        theme="dark"
        v-model="reactions"
        :items="items"
        variant="outlined"
        chips
        label="Реакции (необязательно)"
        multiple=""
      ></v-select>
      <v-text-field
        density="compact"
        label="Секретный код"
        prepend-icon="mdi-key-variant"
        variant="outlined"
        v-model="code"
        :error="codeError"
      ></v-text-field>
      <v-text-field
        density="compact"
        label="Унаследовать посты из кода (необязательно)"
        prepend-icon="mdi-key-variant"
        variant="outlined"
        v-model="codeLegacy"
      ></v-text-field>
      <v-btn
        :disabled="blockBtn"
        theme="dark"
        width="100%"
        class="mt-5"
        @click="createPost()"
      >
        <span v-if="!blockBtn">Создать</span>
        <v-progress-circular
          indeterminate
          size="20"
          :width="3"
          color="#fff"
          v-if="blockBtn"
        ></v-progress-circular>
      </v-btn>
    </div>

    <v-alert
      color="red"
      density="compact"
      dismissible
      elevation="3"
      type="error"
      class="subtitle-2"
      v-for="(error, i) in errors"
      :key="i"
      >{{ error }}</v-alert
    >
    <v-alert
      color="success"
      density="compact"
      dismissible
      elevation="3"
      type="success"
      class="subtitle-2"
      v-if="successAdd"
      >Пост успешно добавлен</v-alert
    >
    <v-divider class="mt-3 mb-3"></v-divider>

    <post-component :post="post" class="mb-5" />
  </div>
</template>

<script>
import PostComponent from "@/components/PostComponent.vue";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/main.js";

export default {
  data() {
    return {
      errors: [],
      successAdd: false,
      blockBtn: false,
      codeError: false,
      code: null,
      codeLegacy: null,
      contentError: false,
      post: {
        date: "",
        media: [],
        content: "Начните что-то писать..",
        reactions: [],
      },
      files: [],
      reactions: [],
      items: [
        "🤣",
        "😍",
        "🤩",
        "🤑",
        "😜",
        "😑",
        "🤨",
        "😴",
        "🤤",
        "🤮",
        "🥴",
        "🤯",
        "😭",
        "🤬",
        "😈",
        "💩",
        "🤡",
        "💘",
        "💯",
        "💦",
        "👌",
        "👍",
        "👎",
        "🤝",
        "👅",
        "👄",
        "🍌",
        "🥒",
        "👠",
        "🐔",
        "🐓",
        "🐇",
        "🐀",
        "🐖",
        "🐽",
      ],
      rules: [
        (value) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 20000000 ||
            "Изображение не может превышать 20 МБ!"
          );
        },
      ],
    };
  },
  methods: {
    convert() {
      this.files.map((file) => {
        this.readFile(file);
      });
    },

    readFile(file) {
      let reader = new FileReader();

      if (file) {
        if (/\.(jpe?g|png|svg|webp)$/i.test(file.name)) {
          reader.readAsDataURL(file);
        }
      }

      reader.onload = function () {
        this.post.media.push(reader.result);
      }.bind(this);
    },

    async createPost() {
      this.errors = [];
      if (!this.post.content) {
        this.contentError = true;
        this.blockBtn = false;
        return this.errors.push("Вы не ввели текст публикации");
      }
      if (!this.code) {
        this.codeError = true;
        this.blockBtn = false;
        return this.errors.push("Вы не ввели привязочный секретный код");
      }
      this.blockBtn = true;

      const docRef = query(
        collection(db, "codes"),
        where("code", "==", this.code)
      );
      const docSnap = await getDocs(docRef);

      if (docSnap.docs.length) {
        let documentData;
        let documentID;
        docSnap.forEach((doc) => {
          documentData = doc.data();
          documentID = doc.id;
        });

        const docUpdRef = doc(db, "codes", documentID);
        if (this.codeLegacy) {
          const legacyPosts = await this.legacyCodePosts(this.codeLegacy);
          if (legacyPosts) {
            if (documentData.posts) {
              await updateDoc(docUpdRef, {
                posts: [this.post, ...documentData.posts, ...legacyPosts],
              });
            } else {
              await updateDoc(docUpdRef, {
                posts: [this.post, ...legacyPosts],
              });
            }
          } else {
            await updateDoc(docUpdRef, {
              posts: [this.post],
            });
          }
        } else {
          if (documentData.posts) {
            await updateDoc(docUpdRef, {
              posts: [...documentData.posts, this.post],
            });
          } else {
            await updateDoc(docUpdRef, {
              posts: [this.post],
            });
          }
        }

        this.successAdd = true;
        console.log("Done");
        setTimeout(() => {
          this.files = [];
          this.content = "Начните что-то писать..";
          this.code = null;
          this.blockBtn = false;
          this.successAdd = false;
          this.codeLegacy = null;
        }, 3000);
      } else {
        console.log("Begin");
        if (this.codeLegacy) {
          const legacyPosts = await this.legacyCodePosts(this.codeLegacy);
          if (legacyPosts) {
            const docRefNew = await addDoc(collection(db, "codes"), {
              code: this.code,
              posts: [this.post, ...legacyPosts],
            });
            console.log("Document written with ID: ", docRefNew.id);
          } else {
            const docRefNew = await addDoc(collection(db, "codes"), {
              code: this.code,
              posts: [this.post],
            });
            console.log("Document written with ID: ", docRefNew.id);
          }
        } else {
          const docRefNew = await addDoc(collection(db, "codes"), {
            code: this.code,
            posts: [this.post],
          });
          console.log("Document written with ID: ", docRefNew.id);
        }

        this.successAdd = true;
        console.log("Done");
        setTimeout(() => {
          this.files = [];
          this.content = "Начните что-то писать..";
          this.code = null;
          this.blockBtn = false;
          this.successAdd = false;
          this.codeLegacy = null;
        }, 3000);
      }
    },

    async legacyCodePosts(code) {
      const docRef = query(collection(db, "codes"), where("code", "==", code));
      const docSnap = await getDocs(docRef);
      let posts;

      if (docSnap.docs.length) {
        let documentData;
        docSnap.forEach((doc) => {
          documentData = doc.data();
          posts = documentData.posts;
        });
      }

      return posts;
    },
  },
  watch: {
    files() {
      this.post.media = [];
      if (this.files.length) {
        this.convert();
      }
    },

    reactions() {
      this.post.reactions = [];
      this.reactions.map((reaction) => {
        this.post.reactions.push({ emoji: reaction, counter: 0 });
      });
    },

    "post.content"() {
      this.contentError = false;
      this.errors = [];
    },

    code() {
      this.codeError = false;
      this.errors = [];
    },
  },
  mounted() {
    let date = new Date();
    this.post.date = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  },
  components: {
    PostComponent,
  },
};
</script>

<style scoped>
.post-section {
  width: 900px;
  padding: 0 15px 15px;
  background-color: var(--block-color);
  border-radius: 0 0 5px 5px;
}
</style>
