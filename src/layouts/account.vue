<template>
   <div class="page-container">
     <header class="center">
          <nuxt-link to="/">
            <span class="md-display-2"><span class="yellow-text">Stonary</span></span>
          </nuxt-link>
          
          <h3 class="md-title">"Platform berbasis komunitas untuk membantu usaha mikro dan kecil berkembang."</h3>

          <div style="height: 20px;"></div>
      </header>

    <div class="content">
      <nuxt/>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'AccounttLayout',
    components: {  },
    data() {
      return {
       
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  div.page-container { padding: 25px; }
</style>
