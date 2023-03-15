<template>
  <div class="content">
    <div class="form">
      <div class="form__header d-flex flex-row">
        <div class="header__img mr-2 mb-8"></div>
        <div class="header__title"><h3>Введите известный вам ключ</h3></div>
      </div>
      <div class="form__content d-flex flex-column">
        <v-text-field
          width="100%"
          label="Секретный ключ"
          variant="outlined"
          :type="show ? 'text' : 'password'"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
          loading
          class="mb-2"
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

        <v-btn width="150" theme="dark" style="margin: 0 auto"> Войти </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EnterView",
  data() {
    return {
      show: false,
      wait: false,
    };
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
</style>
