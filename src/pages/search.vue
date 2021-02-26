<template>
    <div>
        <div v-if="q">
            <span class="md-headline center">Menampilkan Hasil Pencarian:</span>
            <span class="md-headline center">"{{ q }}"</span>

            <!-- PAGE IS LOADING -->
            <div v-if="loading" class="center">
                <div class="md-layout md-gutter md-alignment-center card-box">
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                        <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                        <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                        <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                    </div>
                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                        <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                    </div>
                </div> 
            </div>
            <div v-else>
                <!-- ERROR GETTING DATA -->
                <div v-if="error">
                    <md-empty-state class="md-accent center"
                        md-icon="error_outline"
                        md-label="Error"
                        md-description="Kendala Menampilkan Hasil">

                        <p>Silahkan coba lagi atau hubungi Admin atas masalah ini</p>
                    </md-empty-state>
                </div>

                <!-- SUCCESSFULLY GETING DATA -->
                <div v-if="success">
                    <!-- NO RESULTS -->
                    <div v-if="responseArr.length == 0">
                        <md-empty-state class="center"
                            md-icon="search"
                            md-label="Tidak Ada Hasil Untuk Ditampilkan">

                            <p style="margin-top: 1.5em">
                                <span class="md-title">Hal ini bisa terjadi karena:</span>
                            </p>
                            <p>1. Kata pencarian Anda terlalu spesifik. Gunakan kata pencarian lainnya</p>
                            <p>2. Anda salah mengetik kata pencarian. Periksalah kembali ejaan kata pencarian Anda</p>
                            <p>3. Tidak ada Merchant (pedagang), barang atau jasa dengan nama tersebut. Mohon <nuxt-link to="/add/"><span class="yellow-text"><b>tambahkan</b></span></nuxt-link> supaya tidak ada orang yang melihat pesan seperti ini lagi <md-icon>mood</md-icon> </p>
                        </md-empty-state>
                    </div>

                    <!-- RESULTS ARE FOUND -->
                    <div v-else>
                        <div class="md-layout md-gutter md-alignment-center card-box">
                            <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                                v-for="obj in responseArr"
                                :key=obj.id
                                style="margin-bottom: 1em;">
                                <nuxt-link :to="`/${obj._type}/${obj._id}`" 
                                    style="text-decoration:none;">
                                    <md-card md-with-hover 
                                        class="md-elevation-4">
                                        <md-ripple>
                                            <md-card-header>
                                                <div class="md-title">{{ obj._source.name }}</div>
                                                <div class="md-subhead">
                                                    {{ obj._source.category }}
                                                    <span v-if="obj._type == 'merchant'"> (Pedagang)</span>
                                                </div>
                                                <div class="body-2" style="margin-top: .2em">
                                                    <div v-if="obj._type == 'item'">
                                                        <span class="md-body-1" style="color: #F5F5F5;">
                                                            Rp. {{ obj._source.price | thousandsSeparator }}
                                                        </span>
                                                    </div>
                                                    <div v-else-if="obj._type == 'merchant'">
                                                        <span class="md-body-1" style="color: #F5F5F5;">
                                                            {{ obj._source.location.address }}
                                                        </span>
                                                        <br>
                                                        <span class="md-caption">
                                                            {{ obj._source.location.note }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </md-card-header>

                                            <md-card-media>
                                                <img :src="obj._source.icon">
                                            </md-card-media>

                                            <md-card-content class="justify">
                                                {{ obj._source.description | truncate300 }}
                                            </md-card-content>
                                        </md-ripple>
                                    </md-card>
                                </nuxt-link>
                            </div>

                            <!-- BUTTON FOR SHOWING MORE SEARCH RESULTS -->
                            <md-button class="md-primary center"
                                v-if="showMoreResultsButton"
                                @click="searchMoreResults">
                                Tampilkan Lagi
                            </md-button>

                            <!-- SPINNER FOR SHOWING MORE SEARCH RESULTS -->
                            <md-progress-spinner 
                                v-if="showSpinnerMoreResults"
                                md-mode="indeterminate" 
                                class="center" 
                                style="margin-top: 1em;"
                            ></md-progress-spinner>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
             <md-empty-state class="center"
                md-icon="keyboard"
                md-label="Kata Pencarian Belum Dimasukkan"
                md-description='Anda bisa mencoba kata pencarian populer: "Soto", "Bakso", atau "Sate"'>
            </md-empty-state>
        </div>
       
        <div style="height: 250px;"></div>
    </div>
</template>

<script>
import thousandsSeparator from '~/plugins/mixins/thousandsSeparator'
import truncate300 from '~/plugins/mixins/truncate300'

export default {
    watchQuery: true,
    // React when search param changed
    watch:{
        $route (to, from) { 
            this.responseArr = [];
            this.search(0, this.size); 
        }
    }, 
    async asyncData ({query}) {
        return {
            q: query.q
        }
    },
    mixins: [thousandsSeparator, truncate300],
    data() {
        return {
            // q: 'asd', // Query text from the user
            responseArr: [], // Save the response from function url
            
            from: 0, // index position (start at 0)
            size: 10, // limit the number of results returned

            // Initial state
            loading: true,
            success: false,
            error: false,

            showMoreResultsButton: true, // flag variable to determine whether to show more results button
            showSpinnerMoreResults: false, // flag variable to determine whether to show more results spinner
        }
    },
    mounted() {
        this.responseArr = [];
        this.search(0, this.size); 
    },
    methods: {
        searchMoreResults() {
            this.showMoreResultsButton = false;
            this.showSpinnerMoreResults = true;
            this.from += this.size;
            this.search(this.from, this.size);
        },
        search(from, size) {
            var vm = this;

            // Set data to query
            // Replate space seperator with + operator
            // Remove + operator and capitalize the string
            vm.q = _.startCase(_.toLower(_.replace(vm.$route.query.q, '+', '_'))); // Capitalize each word in description
            
            var functionUrl = `https://us-central1-stonary8.cloudfunctions.net/getSearchResultsFromElasticsearch?q=${vm.q}&from=${from}&size=${size}`
            return vm.$axios.get(functionUrl)
                .then(response => {
                    // Success callback
                    vm.loading = false;
                    vm.success = true;
                    vm.error = false;

                    this.showMoreResultsButton = true;
                    vm.showSpinnerMoreResults = false;

                    // response array
                    // console.log(response.data.hits.hits);

                    _.forEach(response.data.hits.hits, function(obj) {
                        // Populate response array (responseArr)
                        vm.responseArr.push(obj);
                    });

                    if(response.data.hits.total <= vm.size || 
                        vm.responseArr.length == response.data.hits.total) {
                        vm.showMoreResultsButton = false;
                    }
                })
                .catch(error => {
                    // Error callback
                    vm.loading = false;
                    vm.success = false;
                    vm.error = true;

                    console.error(error);
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    .skeleton-loader { margin: 0 auto; }
</style>