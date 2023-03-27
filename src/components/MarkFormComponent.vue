<template>
  <div style="width: 100%" class="mb-7 d-flex flex-column align-center">
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
          label="Загрузите значок метки (необязательно)"
          v-model="file"
          @click:clear="media = null"
          @click="media = null"
        ></v-file-input>
        <v-text-field
          density="compact"
          label="Добавьте описание метки"
          variant="outlined"
          prepend-icon="mdi-fountain-pen"
          v-model="description"
          :error="descriptionError"
        ></v-text-field>
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
          label="Унаследовать метки из кода (необязательно)"
          prepend-icon="mdi-key-variant"
          variant="outlined"
          v-model="codeLegacy"
        ></v-text-field>

        <v-btn
          theme="dark"
          width="100%"
          class="mt-5"
          @click="createMark()"
          :disabled="blockBtn"
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
      >Метка успешно добавлена</v-alert
    >
  </div>
</template>

<script>
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
      coords: [41.309757, 69.252073],
      file: null,
      description: null,
      code: null,
      codeLegacy: null,
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
      errors: [],
      descriptionError: false,
      codeError: false,
      media: null,
      blockBtn: false,
      successAdd: false,
    };
  },
  methods: {
    readFile(file) {
      let reader = new FileReader();
      file = file[0];
      if (file) {
        if (/\.(jpe?g|png|svg|webp)$/i.test(file.name)) {
          reader.readAsDataURL(file);
        }
      }

      reader.onload = function () {
        this.media = reader.result;
      }.bind(this);
    },

    async createMark() {
      this.errors = [];
      if (!this.description) {
        this.descriptionError = true;
        return this.errors.push("Добавьте описание метки");
      }
      if (!this.code) {
        this.codeError = true;
        return this.errors.push("Укажите привязочный код метки");
      }
      this.blockBtn = true;

      let markToSave = {
        coords: this.coords,
        description: this.description,
        media: this.media ? this.media : null,
      };

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
          const legacyMarks = await this.legacyCodeMarks(this.codeLegacy);
          if (legacyMarks) {
            if (documentData.marks) {
              await updateDoc(docUpdRef, {
                marks: [markToSave, ...documentData.marks, ...legacyMarks],
              });
            } else {
              await updateDoc(docUpdRef, {
                marks: [markToSave, ...legacyMarks],
              });
            }
          } else {
            await updateDoc(docUpdRef, {
              marks: [markToSave],
            });
          }
        } else {
          if (documentData.marks) {
            await updateDoc(docUpdRef, {
              marks: [...documentData.marks, markToSave],
            });
          } else {
            await updateDoc(docUpdRef, {
              marks: [markToSave],
            });
          }
        }

        this.successAdd = true;
        setTimeout(() => {
          this.file = null;
          this.media = null;
          this.description = null;
          this.code = null;
          this.blockBtn = false;
          this.successAdd = false;
          this.codeLegacy = null;
        }, 3000);
      } else {
        if (this.codeLegacy) {
          const legacyMarks = await this.legacyCodeMarks(this.codeLegacy);
          if (legacyMarks) {
            await addDoc(collection(db, "codes"), {
              code: this.code,
              marks: [markToSave, ...legacyMarks],
            });
          } else {
            await addDoc(collection(db, "codes"), {
              code: this.code,
              marks: [markToSave],
            });
          }
        } else {
          await addDoc(collection(db, "codes"), {
            code: this.code,
            marks: [markToSave],
          });
        }

        this.successAdd = true;
        setTimeout(() => {
          this.file = null;
          this.media = null;
          this.description = null;
          this.code = null;
          this.blockBtn = false;
          this.successAdd = false;
          this.codeLegacy = null;
        }, 3000);
      }
    },

    async legacyCodeMarks(code) {
      const docRef = query(collection(db, "codes"), where("code", "==", code));
      const docSnap = await getDocs(docRef);
      let marks;

      if (docSnap.docs.length) {
        let documentData;
        docSnap.forEach((doc) => {
          documentData = doc.data();
          marks = documentData.marks;
        });
      }

      return marks;
    },
  },
  watch: {
    description() {
      this.descriptionError = false;
      this.errors = [];
    },
    code() {
      this.codeError = false;
      this.errors = [];
    },
    file() {
      this.media = null;
      if (this.file) {
        this.readFile(this.file);
      }
    },
  },
  mounted() {
    /* eslint-disable */
    const ctx = this
    ymaps.ready(init);
    function init() {
      var myMap = new ymaps.Map("map2", {
        center: [41.309757, 69.252073],
        zoom: 12,
      });

      var myPlacemark = new ymaps.Placemark(ctx.coords, {}, {
        draggable: true, // Метку можно перемещать.
        preset: 'islands#whiteStretchyIcon',
        iconLayout: 'default#image',
        iconImageHref: 'data:image/png;base64,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',
        iconImageSize: [42, 42],
        iconImageOffset: [-3, -42]
      });
      myPlacemark.events.add('dragend', function(e) {
        // Получение ссылки на объект, который был передвинут.
        var thisPlacemark = e.get('target');
        // Определение координат метки
        var coords = thisPlacemark.geometry.getCoordinates();
        // и вывод их при щелчке на метке
        thisPlacemark.properties.set('balloonContent', coords);
        ctx.coords = coords
      });
      myMap.geoObjects.add(myPlacemark);
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

@media only screen and (max-width: 770px) {
  .mark-section {
    width: 100%;
    padding: 0 10px 10px;
  }
}
</style>
