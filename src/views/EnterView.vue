<template>
  <div class="content">
    <div class="form">
      <div class="form__header d-flex flex-row">
        <div class="header__img mr-2 mb-8"></div>
        <div class="header__title"><h3>Введите известный вам ключ</h3></div>
      </div>
      <div class="form__content d-flex flex-column">
        <v-text-field
          density="compact"
          width="100%"
          label="Секретный ключ"
          variant="outlined"
          :type="show ? 'text' : 'password'"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
          loading
          class="mb-2"
          v-model="code"
          :error="codeError"
        >
          <template v-slot:loader>
            <v-progress-linear
              :active="wait"
              absolute
              height="3"
              indeterminate
            ></v-progress-linear>
          </template>
        </v-text-field>

        <v-btn
          width="150"
          theme="dark"
          style="margin: 0 auto"
          @click="claimCode()"
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
import { defineComponent } from "vue";
import { mapMutations } from "vuex";

export default defineComponent({
  name: "EnterView",
  data() {
    return {
      code: null,
      show: false,
      wait: false,
      errors: [],
      codeError: false,
    };
  },
  methods: {
    ...mapMutations(["changeCode"]),

    claimCode() {
      this.errors = [];
      if (!this.code) {
        this.codeError = true;
        return this.errors.push("Вы должны ввести секретный код");
      }

      this.changeCode(this.code);
      this.$router.push("/blog");
    },
  },
  watch: {
    code() {
      this.errors = [];
      this.codeError = false;
    },
  },
});
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
  height: 250px;
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

@media only screen and (max-width: 770px) {
  .form {
    width: 100vw;
    padding: 10px;
  }
  .header__title > h3 {
    font-size: 0.9rem;
  }
  .header__img {
    width: 22px;
    height: 22px;
  }
  .error-box {
    width: 100%;
  }
}
</style>
