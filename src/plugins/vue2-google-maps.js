import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyBugxrEreELjfqQdq4om2ZqJdaecfqWyxA",
      libraries: "places" // necessary for places input
    }
  });