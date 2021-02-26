<template>
  <div>
    <md-toolbar class="md-primary" style="position: fixed;">
      <div class="md-toolbar-row">
        
        <h3 class="md-title"><span class="title">Stonary</span></h3>

        <div class="md-toolbar-section-end">
          
          <!-- Profile Picture -->
          <app-user-menu></app-user-menu>
        </div>
      </div>

      <!-- SEARCH BOX -->
      <div v-if="$nuxt.$route.path.includes('/explore') || 
                 $nuxt.$route.path.includes('/search')"
          style="width: 100%;">
        <app-search-box style="width: 95%; margin: 0 auto;"></app-search-box>

        <div style="height: 10px;"></div>
      </div>
    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Stonary</span>
      </md-toolbar>
    </md-drawer>
  </div>
</template>

<script>
import AppUserMenu from '@/components/user/menu';
import AppSearchBox from '@/components/template/searchBox';

export default {
  name: 'Tab',
  components: { AppUserMenu, AppSearchBox },
  data() {
    return {
        showNavigation: false,

        expandSupport: true,
        expandSingle: false,
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~/assets/styles/theme.scss';

  a:hover {
    background: #eeeeee ;
  }

  span.title { color: $secondaryColor; }
  .md-drawer {
    position: fixed;
  }

  .log-out:hover {
    cursor: pointer;
  }
</style>