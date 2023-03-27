<template>
  <div class="content mt-7">
    <div class="coords-wrapper">
      <div class="d-flex flex-row justify-center">
        <v-progress-circular
          :size="50"
          color="#fff"
          indeterminate
          v-if="loading"
        ></v-progress-circular>
      </div>

      <v-expansion-panels theme="dark">
        <v-expansion-panel v-for="(coord, i) in coords" :key="i">
          <v-expansion-panel-title>
            <span style="font-size: 0.8rem">ID: {{ coord.id }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(item, i) in coord.coords" :key="i" class="mt-3">
              <h4>{{ item.main.time }}</h4>
              <v-table density="compact" style="font-size: 0.8rem">
                <thead>
                  <tr>
                    <th class="text-left">Параметр</th>
                    <th class="text-left">Значение</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Код</td>
                    <td>{{ item.main.code }}</td>
                  </tr>
                  <tr>
                    <td>Координаты</td>
                    <td>
                      lat: {{ item.main.latitude }}, lng:
                      {{ item.main.longitude }}
                    </td>
                  </tr>
                  <tr>
                    <td>IP</td>
                    <td>{{ item.additionally.ipapi.ip }}</td>
                  </tr>
                  <tr>
                    <td>Провайдер</td>
                    <td>{{ item.additionally.ipapi.org }}</td>
                  </tr>
                  <tr>
                    <td>Регион</td>
                    <td>
                      {{ item.additionally.ipapi.country_name }},
                      {{ item.additionally.ipapi.region }}
                    </td>
                  </tr>
                  <tr>
                    <td>UserAgent</td>
                    <td>{{ item.additionally.userAgent }}</td>
                  </tr>
                  <tr v-if="item.additionally.userAgentData">
                    <td>Браузер и движки</td>
                    <td>
                      {{ item.additionally.userAgentData.brands[0].brand }},
                      {{ item.additionally.userAgentData.brands[1].brand }},
                      {{ item.additionally.userAgentData.brands[2].brand }}
                    </td>
                  </tr>
                  <tr v-if="item.additionally.userAgentData">
                    <td>Мобильный телефон</td>
                    <td>{{ item.additionally.userAgentData.mobile }}</td>
                  </tr>
                  <tr v-if="item.additionally.userAgentData">
                    <td>OS</td>
                    <td>{{ item.additionally.userAgentData.platform }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-divider class="mt-4" color="#fff" thickness="15"></v-divider>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/main.js";

export default {
  data() {
    return {
      coords: [],
      loading: true,
    };
  },
  computed: mapGetters(["getUser"]),
  methods: {
    async loadCoords() {
      try {
        const querySnapshot = await getDocs(collection(db, "coords"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          this.coords.push(doc.data());
        });
        this.loading = false;
      } catch (error) {
        console.error("Ошибка сервера: ", error);
        this.$router.push("/");
      }
    },
  },
  mounted() {
    if (!this.getUser) {
      this.$router.push("/auth");
    }
    this.loadCoords();
  },
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.coords-wrapper {
  width: 900px;
}

@media only screen and (max-width: 770px) {
  .coords-wrapper {
    width: 100%;
  }
}
</style>
