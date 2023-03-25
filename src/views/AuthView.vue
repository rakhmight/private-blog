<template>
  <div class="content">
    <div class="form">
      <div class="form__header d-flex flex-row">
        <div class="header__img mr-2 mb-8"></div>
        <div class="header__title"><h3>Введите логин/пароль</h3></div>
      </div>
      <div class="form__content d-flex flex-column">
        <v-text-field
          density="compact"
          width="100%"
          label="Почта"
          variant="outlined"
          type="text"
          class="mb-2"
          v-model="email"
          :error="emailError"
        >
        </v-text-field>
        <v-text-field
          density="compact"
          width="100%"
          label="Пароль"
          variant="outlined"
          :type="show ? 'text' : 'password'"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
          class="mb-2"
          v-model="password"
          :error="passwordError"
        >
        </v-text-field>

        <v-btn
          width="150"
          theme="dark"
          style="margin: 0 auto"
          @click="initAuth()"
        >
          Войти
        </v-btn>
      </div>
    </div>

    <v-alert
      density="compact"
      color="red"
      dense
      dismissible
      elevation="3"
      type="error"
      class="subtitle-2 error-box"
      v-for="(error, i) in errors"
      :key="i"
      >{{ error }}</v-alert
    >
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "EnterView",
  data() {
    return {
      email: "",
      password: "",
      show: false,
      errors: [],
      emailError: false,
      passwordError: false,
    };
  },
  methods: {
    ...mapMutations(["login"]),
    async initAuth() {
      this.errors = [];
      if (!this.email) {
        this.emailError = true;
        return this.errors.push("Введите логин");
      }
      if (!this.password) {
        this.passwordError = true;
        return this.errors.push("Введите пароль");
      }

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.login(user);
          this.$router.push("/admin");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          return this.errors.push("Не верный логин/пароль");
        });
    },
  },
  computed: mapGetters(["getUser"]),
  watch: {
    email() {
      this.errors = [];
      this.emailError = false;
    },
    password() {
      this.errors = [];
      this.passwordError = false;
    },
  },
  mounted() {
    if (this.getUser) {
      this.$router.push("/admin");
    }
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
.form {
  padding: 30px;
  width: 550px;
  height: auto;
  border-radius: 5px;
  background-color: var(--block-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.header__img {
  width: 30px;
  height: 30px;
  background-image: url("@/assets/media/secret.png");
  background-size: contain;
}
.form__content {
  width: 100%;
}
.error-box {
  padding: 10px;
  width: 550px;
  height: auto;
  max-height: 50px;
}
</style>
