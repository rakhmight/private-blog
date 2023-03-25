<template>
  <div>
    <div class="mark-section">
      <div id="map2" style="width: 100%; height: 35vh"></div>

      <div class="mt-5">
        <v-file-input
          density="compact"
          theme="dark"
          :rules="rules"
          variant="outlined"
          accept="image/png, image/jpeg, image/bmp, image/webm"
          prepend-icon="mdi-image-area"
          label="Загрузите значок метки"
          v-model="file"
        ></v-file-input>
        <v-text-field
          density="compact"
          label="Добавьте описание метки"
          variant="outlined"
          prepend-icon="mdi-fountain-pen"
        ></v-text-field>
        <v-text-field
          density="compact"
          label="Секретный код"
          prepend-icon="mdi-key-variant"
          variant="outlined"
        ></v-text-field>

        <v-btn theme="dark" width="100%" class="mt-5">Создать</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    /* eslint-disable */
    ymaps.ready(init);
    function init() {
      var myMap = new ymaps.Map("map2", {
        center: [41.309757, 69.252073],
        zoom: 12,
      });
    }
  },
}
</script>


<style scoped>
.mark-section {
  width: 900px;
  padding: 0 15px 15px;
  background-color: var(--block-color);
  border-radius: 0 0 5px 5px;
}
</style>
