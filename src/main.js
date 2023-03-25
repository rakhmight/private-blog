import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkr3YgPHMKxUIcI6cjZYRlET6PNF_Ky9Y",
  authDomain: "private-blog-12658.firebaseapp.com",
  projectId: "private-blog-12658",
  storageBucket: "private-blog-12658.appspot.com",
  messagingSenderId: "1075378531610",
  appId: "1:1075378531610:web:81b368e7cb785cb0e610a3",
  databaseURL: "https://private-blog-12658.firebaseio.com",
};
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);

loadFonts();

createApp(App).use(router).use(store).use(vuetify).mount("#app");
