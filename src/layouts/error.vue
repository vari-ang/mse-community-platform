<template>
  <div class="container">
    <div v-if="error.statusCode === 404">
      <md-empty-state class="md-accent center"
        md-icon="error_outline"
        md-label="404"
        md-description="Halaman Tidak Ditemukan">

        <nuxt-link to="/">
            <md-button class="md-primary md-raised" style="border-radius: 1em;">
                <md-icon>home</md-icon>
                Beranda
            </md-button>
        </nuxt-link>

        <p style="margin-top: 1em;">
            <span class="md-body-2 grey-text">
                Jika Anda merasa hal ini adalah kesalahan, mohon 
                <a href="mailto:stonaryapp@gmail.com">
                    <strong style="color: #e3e3e3">hubungi admin</strong>
                </a>
            </span>
        </p>
      </md-empty-state>
    </div>
    <div v-else>
      <md-empty-state class="md-accent center"
        md-icon="report_problem"
        :md-label="error.statusCode"
        md-description="Terjadi Sebuah Error">

        <span class="md-subheading">Kunjungi Kembali Halaman Ini atau 
          Kembali ke Beranda</span>

        <nuxt-link to="/">
            <md-button class="md-primary md-raised" style="border-radius: 1em">
                <md-icon>home</md-icon>
                Beranda
            </md-button>
        </nuxt-link>

        <p style="margin-top: 1em;">
            <span class="md-body-2 grey-text">
                Jika Anda merasa hal ini adalah kesalahan, mohon 
                <a href="mailto:stonaryapp@gmail.com">
                    <strong style="color: #e3e3e3">hubungi admin</strong>
                </a>
            </span>
        </p>
      </md-empty-state>
    </div>

    <div style="height: 150px;"></div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // you can set a custom layout for the error page
}
</script>

<style lang="scss" scoped>

</style>
