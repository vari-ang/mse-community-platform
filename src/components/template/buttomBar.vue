<template>
    <!-- ONLY SHOW IN MOBILE & TABLET -->
    <div class="phone-viewport">
      <md-bottom-bar md-sync-route :md-theme="'bottom-bar-dark'">
        <div class="md-layout-item">
          <md-bottom-bar-item to="/" exact md-label="Beranda" md-icon="home"></md-bottom-bar-item>
        </div>
        <div class="md-layout-item">
          <md-bottom-bar-item to="/explore" md-label="Telusuri" md-icon="explore"></md-bottom-bar-item>
        </div>
        <div class="md-layout-item">
          <md-bottom-bar-item to="/add" md-label="Tambah" md-icon="add_circle_outline"></md-bottom-bar-item>
        </div>
      </md-bottom-bar>
    </div>
</template>

<script>
export default {
  name: 'BarRouter'
}
</script>

<style lang="scss" scoped>
  @import '~/assets/styles/theme.scss';

  .phone-viewport {
    width: 100%;
    position: fixed;
    bottom: -1px;
    right: 0px;
    display: inline-flex;
    text-align: center;
    align-items: flex-end;
    overflow: hidden;
    border: 1px solid rgba(#000, .26);
    background: rgba(#000, .06);

    .md-bottom-bar-item { text-decoration: none; }
  }
</style>