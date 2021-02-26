<template>
  <div>
      <form v-on:submit.prevent="search" autocomplete="off">
          <!-- NON AUTOCOMPLETE SEARCH -->
          <!-- For autocomplete search, add @md-changed="getData" to <md-autocomplete> -->
          <md-autocomplete
                id="searchBox"
                ref="searchBox"
                v-model="q"
                :md-options.sync="autocompleteData"
                md-layout="box"
                md-dense>
            <label>
              <md-icon>search</md-icon>
              Cari produk, jasa atau Usaha Kecil
            </label>

            <template slot="md-autocomplete-item" slot-scope="{ item }">
              <nuxt-link :to="`/${item._type}/${item._id}`">
                <div>
                  <md-list-item>
                    <md-avatar>
                      <img :src="item._source.icon" alt="Image">
                    </md-avatar>

                    <div class="md-list-item-text">
                      <span><b>{{ item._source.name }}</b></span>
                      <span>{{ item._source.type }}</span>
                      <p class="md-caption">{{ item._source.description }}</p>
                    </div>
                  </md-list-item>
                </div>
              </nuxt-link>
            </template>

            <!-- No Matching Items or Merchants is found -->
            <template slot="md-autocomplete-empty" slot-scope="{ term }">
              <div>
                Coba Kata Pencarian Populer: "<b>Soto</b>", "<b>Bakso</b>", "<b>Sate</b>"
                <input type="hidden" name="term" :value="term">
              </div>
            </template>
        </md-autocomplete>
      </form>
  </div>
</template>

<script>
  export default {
    name: 'AutocompleteBox',
    data: () => ({
      q: null, // Search query
      autocompleteData: [] // Autocomplete result
    }),
    methods: {
      // Search will be triggered when the user hit 'Enter' button
      search() {
          var vm = this;

          // Move to Search page
          vm.$router.push({ path: '/search', query: { 'q': vm.q }});
      },
      getData (query) {
        var vm = this;
        vm.q = query;
        
        vm.autocompleteData = new Promise(resolve => {
            // Replace any non-alphanumeric characters
            var editedQuery = _.toLower(_.replace(query, '/[^0-9a-z]/gi', ' ')); 

            // Replace any non-alphanumeric characters
            var functionUrl = `https://us-central1-stonary8.cloudfunctions.net/getSearchResultsFromElasticsearch?q=${editedQuery}&from=0&size=15`;

            return vm.$axios.get(functionUrl)
                            .then(response => {
                                // Populate autocomplete data (autocomplete results)
                                resolve(response.data.hits.hits);

                                // console.log(response.data.hits.hits);
                            })
                            .catch(error => {
                                console.error(error);
                            });
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~/assets/styles/theme.scss';

  #searchBox {
    background: #353C51;
  }
</style>