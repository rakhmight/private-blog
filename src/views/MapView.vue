<template>
  <div class="content">
    <div id="map" style="width: 100%; height: 90vh"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    /* eslint-disable */
    ymaps.ready(init);
    function init() {
      // Создание карты.
      var myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [41.309757, 69.252073],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 13,
      });
    }
  },
}
</script>
