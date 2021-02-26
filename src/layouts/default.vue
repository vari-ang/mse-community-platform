<template>
  <div class="page-container">
    <!-- DESKTOP VIEW -->
    <div class="desktop-view">
      <md-app md-mode="fixed">
        <md-app-toolbar class="md-primary" md-elevation="2">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisibleDesktop">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title"><span class="title">Stonary</span></span>
          
          <!-- SEARCH BOX -->
          <div class="center" style="width: 525px;">
            <app-search-box class="center"
              style="width: 100%"
            ></app-search-box>
          </div>

          <!-- Profile Picture -->
          <app-user-menu></app-user-menu>
        </md-app-toolbar>

        <md-app-drawer :md-active.sync="menuVisibleDesktop" 
                       md-persistent="mini" 
                       style="width: 250px;">
          <md-toolbar class="md-transparent" md-elevation="2">
            <span>Menu</span>

            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button md-dense" @click="toggleMenu">
                <md-icon>keyboard_arrow_left</md-icon>
              </md-button>
            </div>
          </md-toolbar>

          <md-list>
            <nuxt-link to="/">
              <md-list-item>
                <md-icon>home</md-icon>
                <span class="md-list-item-text">Beranda</span>
              </md-list-item>
            </nuxt-link>

            <nuxt-link to="/explore">
              <md-list-item>
                <md-icon>explore</md-icon>
                <span class="md-list-item-text">Telesuri</span>
              </md-list-item>
            </nuxt-link>

            <nuxt-link to="/add">
              <md-list-item>
                <md-icon>add_circle_outline</md-icon>
                <span class="md-list-item-text">Tambah</span>
              </md-list-item>
            </nuxt-link>
          </md-list>
        </md-app-drawer>

        <md-app-content>
           <!-- Banner For Showing Stonary Simple Info In Home Page -->
          <app-banner v-if="$nuxt.$route.path == '/'"></app-banner>
          
          <div>
            <md-content>
              <nuxt/>
            </md-content>
          </div>

          <!-- Footer -->
          <app-footer v-if="$nuxt.$route.path.includes('/about') || 
                            $nuxt.$route.path.includes('/privacy') ||
                            $nuxt.$route.path.includes('/terms')"
          ></app-footer>
        </md-app-content>
      </md-app>
    </div>

    <!-- TABLET & MOBILE VIEW -->
    <div class="tablet-mobile-view">
      <!-- Tab --> 
      <app-tab></app-tab>

      <div style="height: 50px;"></div>

      <div v-if="$nuxt.$route.path == '/explore' || 
                 $nuxt.$route.path == '/explore/' ||
                 $nuxt.$route.path == '/search' ||
                 $nuxt.$route.path == '/search/'"
           style="height: 50px"
      ></div>

      <!-- Banner For Showing Stonary Simple Info In Home Page -->
      <app-banner v-if="$nuxt.$route.path == '/'"></app-banner>

      <!-- CONTENT -->
      <md-app>
        <md-app-content>
          <nuxt/>
        </md-app-content>
      </md-app>

      <!-- Footer -->
      <app-footer v-if="$nuxt.$route.path.includes('/about') || 
                        $nuxt.$route.path.includes('/privacy') ||
                        $nuxt.$route.path.includes('/terms')"
      ></app-footer>

      <!-- Buttom Bar (Like Mobile Apps) For Phone/ Tablet View -->
      <app-buttom-bar></app-buttom-bar>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import { auth } from '~/plugins/fireinit.js'

import AppBanner from '@/components/template/banner'
import AppTab from '@/components/template/tab'
import AppUserMenu from '@/components/user/menu'
import AppSearchBox from '@/components/template/searchBox'
import AppFooter from '@/components/template/footer'
import AppButtomBar from '@/components/template/buttomBar'

export default {
  name: 'DefaultLayout',
  components: { 
    AppBanner,
    AppTab, 
    AppUserMenu, 
    AppSearchBox, 
    AppFooter,
    AppButtomBar 
  },
  created() {
      var vm = this;

      // Check if user authentication on firebase
      if(!vm.user.id) {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                // Set data
                var obj = {};
                obj.id = user.uid;
                obj.email = user.email;
                obj.photoUrl = user.photoURL;

                // Set user to vuex store
                vm.setUser(obj);
            } 
        });
      }
  },
  data() {
    return {
      menuVisible: false,
      menuVisibleDesktop: false,
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapMutations({
      'setUser': 'user/setUser'
    }),
    toggleMenu () {
      this.menuVisibleDesktop = !this.menuVisibleDesktop
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~/assets/styles/theme.scss';
  @import '~/assets/styles/breakpoint.scss';

  // Desktop View
  div.desktop-view {
    @include layout-medium { display: none; }

    span.title { color: $secondaryColor; }
    .md-app { height: 100vh; }
    .md-list {
      a:hover { background: #767D92 }
    }
    .md-app-content {
      height: auto;
      min-height: 650px;
      padding: 0;

      div { 
        width: 100%;
        max-width: 1050px;
        display: block;
        margin: 0 auto;

        .md-content {
          padding: 1em;
          width: 100%;
          height: auto;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  // Tablet & Mobile View
  div.tablet-mobile-view {
    @include layout-large-and-up { display: none; }
  }
</style>
