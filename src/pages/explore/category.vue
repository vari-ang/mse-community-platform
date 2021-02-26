<template>
    <div>
        <!-- Category is found -->
        <div v-if="categories[q]">
            <!-- Button for going back to explore page -->
            <nuxt-link to="/explore">
                <md-button style="margin-top: 3.5em;">
                    <md-icon>chevron_left</md-icon>
                    Kembali ke Penelusuran
                </md-button>
            </nuxt-link>

            <!-- Category Title -->
            <span class="md-display-1 center"
                  style="margin-top: .5em;">
                {{ q }}
            </span>

            <div v-for="carousel in categories[q].carousels"
                :key="carousel.id">
                <p class="title">
                    <span class="md-headline">{{ carousel.title }}</span>
                </p>
                <app-carousel-header v-if="carousel.type == 'header'"
                                    :type="categories[q].type"
                                    :data="carousel.data"
                ></app-carousel-header>

                <div v-else-if="carousel.type == 'horizontal-scrolling'"
                    class="horizontal-scrolling">

                    <div v-if="showSpinnerNeaby">
                        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                    </div>
                    <div v-else>
                        <!-- Location Access Is Enabled -->
                        <div v-if="isPositionAllowed">

                            <!-- Data Is Found -->
                            <div v-if="carousel.data.length != 0">
                                <div v-for="obj in carousel.data"
                                    :key="obj.id"
                                    class="card">
                                    <nuxt-link :to="`/${obj.type}/${obj.id}`" 
                                        style="text-decoration:none;">
                                        <md-card md-with-hover 
                                            class="md-elevation-4">
                                            <md-ripple>
                                                <md-card-header>
                                                    <div class="md-title">{{ obj.name }}</div>
                                                    
                                                    <div class="body-2" style="margin-top: .2em">
                                                        <span v-if="obj.type == 'item'"
                                                            class="md-body-1" style="color: #F5F5F5;">
                                                            Rp. {{ obj.price | thousandsSeparator }}
                                                        </span>
                                                        <span v-if="obj.type == 'merchant'"
                                                            class="md-body-1" style="color: #F5F5F5;">
                                                            {{ obj.location.address }}
                                                            <br>
                                                            {{ obj.location.note }}
                                                        </span> <br><br>

                                                        <!-- Distance -->
                                                        <span>
                                                            <md-icon>pin_drop</md-icon>
                                                            {{ obj.dist }} km 
                                                        </span>
                                                    </div>
                                                </md-card-header>

                                                <md-card-media>
                                                    <img :src="obj.icon">
                                                </md-card-media>

                                                <md-card-content class="justify">
                                                    {{ obj.description | truncate300 }}
                                                </md-card-content>
                                            </md-ripple>
                                        </md-card>
                                    </nuxt-link>
                                </div>
                            </div>

                            <!-- No Data Is Found -->
                            <div v-else>
                                <span class="md-caption">
                                    Belum ada {{ q }} di daerah Anda (dalam radius {{geoqueryRadius}}km)
                                </span>
                            </div>
                        </div>

                        <!-- Location Access Is Disabled -->
                        <div v-else>
                            <span class="md-caption">
                                Ijinkan akses lokasi agar Anda dapat menemukan {{ q }} di daerah Anda (dalam radius {{geoqueryRadius}}km)
                            </span>
                        </div>
                    </div>
                </div>

                <app-carousel-list v-else-if="carousel.type == 'list'"
                                :type="categories[q].type"
                                :data="carousel.data"
                ></app-carousel-list>

                <app-carousel-horizontal v-else-if="carousel.type == 'horizontal'"
                                        :type="categories[q].type"
                                        :data="carousel.data"
                ></app-carousel-horizontal>
            </div>

            <div style="height: 125px;"></div>
        </div>

        <!-- Category is not found -->
        <div v-else>
            <md-empty-state class="center"
                md-icon="youtube_searched_for"
                md-label="Tidak Dapat Menampilkan Kategori Penelusuran"
                md-description="Periksa kembali link yang Anda inputkan, atau cari kategori melalui menu penelusuran">

                <nuxt-link to="/explore">
                    <md-button class="md-primary md-raised" style="border-radius: 1em">
                        <md-icon>explore</md-icon>
                        Telusuri
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

            <div style="height: 100px;"></div>
        </div>
    </div>
</template>

<script>
var firebase = require('firebase');
import { db } from '~/plugins/fireinit.js'
import { geo } from '~/plugins/fireinit.js'
import { get } from 'geofirex';
import thousandsSeparator from '~/plugins/mixins/thousandsSeparator'
import truncate300 from '~/plugins/mixins/truncate300'

import AppCarouselHeader from '@/components/carousels/header'
import AppCarouselList from '@/components/carousels/list'
import AppCarouselHorizontal from '@/components/carousels/horizontal'

export default {
    mixins: [thousandsSeparator, truncate300],
    components: { 
        AppCarouselHeader,
        AppCarouselList,
        AppCarouselHorizontal
    },
    async asyncData ({query}) {
        return {
            q: query.q
        }
    },
    created() {
        var vm = this;

        // // Get user's position
        // vm.$getLocation({
        //     enableHighAccuracy: true, 
        //     timeout: 20000
        // })
        // .then(coordinates => {
        //     vm.isPositionAllowed = true;
        //     vm.getNearbyDocs(coordinates.lat, coordinates.lng);
        // })
        // .catch(function(error) {
        //     // Geolocation is not supported or has been disabled (blocked) by the user
        //     console.error(error);
        //     vm.isPositionAllowed = false;
        //     vm.showSpinnerNeaby = false;
        // });
    },
    data() {
        return {
            isPositionAllowed: false,
            showSpinnerNeaby: true,
            geoqueryRadius: 15, // in kilometers
            categories: {
                /*** PRODUCTS ***/
                'Obat dan Kosmetika': {
                    merchantCategoryRef: 'Kesehatan dan Kecantikan',
                    type: 'item',
                    carousels: [
                        {
                            type: 'header',
                            title: 'Obat Terbaik',
                            data: [
                                {
                                    id: '1',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    price: '1234'
                                },
                                {
                                    id: '2',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    price: '1234'
                                },
                                {
                                    id: '3',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    price: '1234'
                                }
                            ]
                        },

                        // Nearby Object
                        {
                            isNearby: true,
                            type: 'horizontal-scrolling',
                            title: 'Barang Terdekat',
                            data: []
                        },

                        {
                            type: 'list',
                            title: 'Flash Sale',
                            data: [
                                [ 
                                    // MAX 3 ITEMS 
                                    {
                                        id: '1',
                                        name: 'Title 1',
                                        category: 'Caption 1',
                                        icon: 'https://picsum.photos/200/300',
                                        price: '888000'
                                    },
                                    {
                                        id: '2',
                                        name: 'Title 1',
                                        category: 'Caption 1',
                                        icon: 'https://picsum.photos/200/300',
                                        price: '888000'
                                    },
                                    {
                                        id: '3',
                                        name: 'Title 1',
                                        category: 'Caption 1',
                                        icon: 'https://picsum.photos/200/300',
                                        price: '888000'
                                    }
                                ], 
                                [
                                    // MAX 3 ITEMS  
                                    {
                                        id: '4',
                                        name: 'Title 1',
                                        category: 'Caption 1',
                                        icon: 'https://picsum.photos/200/300',
                                        price: '888000'
                                    },
                                    {
                                        id: '5',
                                        name: 'Title 1',
                                        category: 'Caption 1',
                                        icon: 'https://picsum.photos/200/300',
                                        price: '888000'
                                    },
                                    {
                                        id: '6',
                                        name: 'Title 1',
                                        category: 'Caption 1',
                                        icon: 'https://picsum.photos/200/300',
                                        price: '888000'
                                    }
                                ]
                            ]
                        }
                    ]
                },

                /*** SERVICES ***/


                /*** MERCHANTS ***/
            }
        }
    },
    methods: {
        /* Get the closest merchants or items from user's current position  */
        async getNearbyDocs(lat, lng) {
            /*** NOTE ***/
            // In order for this method to work, 
            // an composite index on merchant's position attribute IS REQUIRED

            var vm = this;
            try {
                var ix = -1; // index at categories' nearby carousels 
                for(var i = 0; i < vm.categories[vm.q].carousels.length; i++) {
                    if(vm.categories[vm.q].carousels[i].isNearby) { ix = i; break; }
                }

                // Reset all categories' nearby carousels 
                vm.categories[vm.q].carousels[ix].data = [];

                // If it is product or services
                if(`${vm.categories[vm.q].type}` == 'item') {
                    // First, Create merchant reference from this item
                    var ref = db.collection('merchants')
                        .where('category', '==', vm.categories[vm.q].merchantCategoryRef)
                        .limit(6),
                    geoRef = geo.query(ref);
                    
                    var query = geoRef.within(geo.point(lat, lng), vm.geoqueryRadius, 'position');
                    var hits = await get(query);
                    if(hits.length != 0) {
                        _.forEach(hits, function(obj) {
                            // dist is the distance from user's current position to this item 
                            var dist = Math.round(geo.distance(
                                            geo.point(lat, lng), 
                                            geo.point(obj.position.geopoint.latitude, obj.position.geopoint.longitude)
                                        ) * 10) / 10; // 1 decimal place in km
                                                    
                            // Second, get item where category is `${q}` from this merchant
                            db.collection('items')
                                .where("merchant.id", '==', obj.id)
                                .where("category", '==', vm.q)
                                .get()
                                .then(function(querySnapshot) {
                                    vm.showSpinnerNeaby = false;

                                    querySnapshot.forEach(function(doc) {
                                        var obj = doc.data();
                                        obj.dist = dist;

                                        if(vm.categories[vm.q].carousels[ix].data.length < 10) {
                                            vm.categories[vm.q].carousels[ix].data.push(obj);
                                        }
                                    });
                                })
                                .catch(function(error) {
                                    console.error("Error getting documents: ", error);
                                });
                        });
                    }
                    else { vm.showSpinnerNeaby = false; }
                }
                else if(`${vm.categories[q].type}` == 'merchant') {
                    var ref = db.collection('merchants').limit(10),
                        geoRef = geo.query(ref);
                    
                    var query = geoRef.within(geo.point(lat, lng), vm.geoqueryRadius, 'position');
                    var hits = await get(query);
                    if(hits.length != 0) {
                        _.forEach(hits, function(obj) {
                            // dist is the distance from user's current position to this item 
                            var dist = Math.round(geo.distance(
                                            geo.point(lat, lng), 
                                            geo.point(obj.position.geopoint.latitude, obj.position.geopoint.longitude)
                                        ) * 10) / 10; // 1 decimal place in km
                            obj.dist = dist;

                            if(vm.categories[vm.q].carousels[ix].data.length < 10) {
                                vm.categories[vm.q].carousels[ix].data.push(obj);
                            }
                        });
                    }
                    else { vm.showSpinnerNeaby = false; }
                }
            }
            catch(err) { 
                console.error(err);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .title { margin-top: 2em; }

    .horizontal-scrolling {
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;

        .card {
            max-width: 225px;
            flex: 0 0 auto;
            margin-bottom: 1.5em;

            img { max-height: 175px; }
        }
    }
</style>
