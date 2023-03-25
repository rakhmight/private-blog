<template>
  <div class="content d-flex flex-column align-center">
    <div class="d-flex flex-column mt-7">
      <v-text-field
        label="Секретный код"
        prepend-icon="mdi-key-variant"
        variant="outlined"
        v-model="code"
        :error="codeError"
        density="compact"
        style="width: 400px"
      ></v-text-field>
      <div>
        <div class="d-flex flex-row justify-center w-100">
          <v-btn
            density="compact"
            theme="dark"
            @click="deleteCode()"
            :disabled="blockBtn"
            >Удалить код</v-btn
          >
        </div>
        <v-alert
          color="red"
          density="compact"
          dismissible
          elevation="3"
          type="error"
          class="subtitle-2 mt-3"
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
          class="subtitle-2 mt-3"
          v-if="success"
          >Успешное удаление</v-alert
        >
      </div>
    </div>

    <v-divider class="mt-3 mb-3"></v-divider>

    <div class="section">
      <div class="d-flex flex-row justify-space-between align-center">
        <h2 v-if="mode == 'post'">Создать публикацию</h2>
        <h2 v-if="mode == 'mark'">Создать марку</h2>
        <v-tooltip theme="dark" text="Создать метку" v-if="mode == 'post'">
          <template v-slot:activator="{ props }">
            <v-icon class="tomap" v-bind="props" @click="mode = 'mark'"
              >mdi-map-marker</v-icon
            >
          </template>
        </v-tooltip>
        <v-tooltip theme="dark" text="Создать публикацию" v-if="mode == 'mark'">
          <template v-slot:activator="{ props }">
            <v-icon class="tomap" v-bind="props" @click="mode = 'post'"
              >mdi-post</v-icon
            >
          </template>
        </v-tooltip>
      </div>

      <v-divider class="mt-3 mb-5"></v-divider>
    </div>

    <post-form-component v-if="mode == 'post'" />
    <mark-form-component v-if="mode == 'mark'" />
  </div>
</template>

<script>
import PostFormComponent from "@/components/PostFormComponent.vue";
import MarkFormComponent from "@/components/MarkFormComponent.vue";
import { mapGetters } from "vuex";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/main.js";

export default {
  data() {
    return {
      code: null,
      mode: "post", // || 'mark'
      codeError: false,
      errors: [],
      blockBtn: false,
      success: false,
    };
  },
  methods: {
    async deleteCode() {
      this.errors = [];
      if (!this.code) {
        this.codeError = true;
        return this.errors.push("Введите код");
      }
      this.blockBtn = true;

      const docRef = query(
        collection(db, "codes"),
        where("code", "==", this.code)
      );
      const docSnap = await getDocs(docRef);

      if (docSnap.docs.length) {
        let documentID;
        docSnap.forEach((doc) => {
          documentID = doc.id;
        });

        await deleteDoc(doc(db, "codes", documentID)).then(() => {
          this.success = true;
          setTimeout(() => {
            this.blockBtn = false;
            this.success = false;
            this.code = null;
          }, 3000);
        });
      } else {
        this.blockBtn = false;
        this.codeError = true;
        return this.errors.push("Такого кода нет");
      }
    },
  },
  components: {
    PostFormComponent,
    MarkFormComponent,
  },
  computed: mapGetters(["getUser"]),
  mounted() {
    if (!this.getUser) {
      this.$router.push("/auth");
    }
  },
  watch: {
    code() {
      this.errors = [];
      this.codeError = false;
    },
  },
};
</script>

<style scoped>
.section {
  width: 900px;
  padding: 15px 15px 0;
  background-color: var(--block-color);
  border-radius: 5px 5px 0 0;
}
</style>
