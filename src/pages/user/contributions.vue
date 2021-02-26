<template>
    <div>
        <!-- User is logged in -->
        <app-profile></app-profile>

        <!-- Poin Anda penting demi kemajuan Usaha Mikro dan Kecil (UMK) di Indonesia -->
        
        <!-- Tab Tambah, Ubah, dan Review -->
        <md-tabs md-alignment="centered" style="margin-top: 0.5em;"> 
            <!-- Posts -->
            <md-tab md-label="Penambahan" md-icon="add_circle" style="">
                <p class="center">
                    <span class="md-title">{{ user.user.total_posts }} Penambahan</span>
                    <br>
                    <span class="md-caption">@10 poin</span>
                    <br>
                    <span class="md-body-2">{{ user.user.total_posts * 10 }} poin</span>
                </p>

                <div v-if="showPostsSpinner" class="center">
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
                    <div v-if="contributions.posts.length == 0">
                        <md-empty-state class="center"
                            md-icon="add_circle"
                            md-label="Anda Belum Memiliki Daftar Penambahan">
                            <p>
                                Kunjungi <md-icon>add_circle</md-icon> pada menu bawah untuk menambahkan pedagang. <br>
                                Tambahkan barang atau jasa melalui halaman pedagang pemilik.
                            </p>
                        </md-empty-state>
                    </div>
                    <div v-else class="md-layout md-gutter md-alignment-center card-box">
                        <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                            v-for="obj in contributions.posts"
                            :key=obj.id
                            style="margin-bottom: 1em;">
                            <nuxt-link :to="`/${obj.type}/${obj.id}`" 
                                style="text-decoration:none;">
                                <md-card md-with-hover 
                                    class="md-elevation-4">
                                    <md-ripple>
                                        <md-card-header>
                                            <div class="md-title">{{ obj.name }}</div>
                                            <div class="md-subhead">
                                                <span v-if="obj.type == 'merchant'">Pedagang<br></span>
                                                {{ obj.category }}
                                            </div>
                                            <div class="body-2" style="margin-top: .2em">
                                                <div v-if="obj.type == 'item'">
                                                    <span class="md-body-1" style="color: #F5F5F5;">
                                                        Rp. {{ obj.price | thousandsSeparator }}
                                                    </span>
                                                </div>
                                                <div v-else-if="obj.type == 'merchant'">
                                                    <span class="md-body-1" style="color: #F5F5F5;">
                                                        {{ obj.location.address }}
                                                    </span>
                                                    <br>
                                                    <span class="md-caption">{{ obj.location.note }}</span>
                                                </div>
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

                    <div v-show="contributions.posts.length != 0">
                        <!-- BUTTON FOR SHOWING MORE POSTS -->
                        <md-button class="md-primary center"
                            v-if="showMorePostsButton"
                            @click="showMore('posts')">
                            Tampilkan Lagi
                        </md-button>

                        <!-- SPINNER FOR SHOWING MORE POSTS -->
                        <md-progress-spinner 
                            v-if="showSpinnerMorePosts"
                            md-mode="indeterminate" 
                            class="center" 
                            style="margin-top: 1em;"
                        ></md-progress-spinner> 
                    </div>
                </div>
            </md-tab> 

            <!-- Edits -->
            <md-tab md-label="Pengubahan" md-icon="edit">
                <p class="center">
                    <span class="md-title">{{ user.user.total_edits }} Pengubahan</span>
                    <br>
                    <span class="md-caption">
                        @5 poin jika pengubahan berhasil
                            <md-icon>
                                info
                                <md-tooltip md-direction="bottom">Pengubahan berhasil jika disetujui oleh minimal 3 orang</md-tooltip>
                            </md-icon>
                    </span>
                    <br>
                    <span class="md-body-2">{{ user.user.total_edits * 5 }} poin</span>
                </p>

                <div v-if="showEditsSpinner" class="center">
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
                    <div v-if="contributions.edits.length == 0">
                        <md-empty-state class="center"
                            md-icon="edit"
                            md-label="Anda Belum Memiliki Daftar Pengubahan">
                            <p>
                                Kunjungi halaman barang, jasa atau pedagang dan ajukan pengubahan informasi yang Anda rasa kurang tepat
                            </p>
                        </md-empty-state>
                    </div>
                    <div v-else class="md-layout md-gutter md-alignment-center card-box">
                        <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                            v-for="obj in contributions.edits"
                            :key=obj.id
                            style="margin-bottom: 1em;">
                            <nuxt-link :to="`/${obj.type}/${obj.id}`" 
                                style="text-decoration:none;">
                                <md-card md-with-hover 
                                    class="md-elevation-4">
                                    <md-ripple>
                                        <md-card-header>
                                            <md-chip v-show="obj.status.approved" style="background: #4caf50; float: right;">Disetujui</md-chip>
                                            <md-chip v-show="obj.status.denied" style="background: #e53935; float: right;">Ditolak</md-chip>
                                            <md-chip v-show="obj.status.waiting" style="background: #ff8f00; float: right;">Menunggu</md-chip>

                                            <div class="md-title">{{ obj.name }}</div>
                                            <div class="md-subhead">
                                                <span v-if="obj.type == 'merchant'">Pedagang<br></span>
                                                {{ obj.category }}
                                            </div>
                                            <div class="body-2" style="margin-top: .2em">
                                                <div v-if="obj.type == 'item'">
                                                    <span class="md-body-1" style="color: #F5F5F5;">
                                                        Rp. {{ obj.price | thousandsSeparator }}
                                                    </span>
                                                </div>
                                                <div v-else-if="obj.type == 'merchant'">
                                                    <span class="md-body-1" style="color: #F5F5F5;">
                                                        {{ obj.location.address }}
                                                    </span>
                                                    <br>
                                                    <span class="md-caption">{{ obj.location.note }}</span>
                                                </div>
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

                    <div v-show="contributions.edits.length != 0">
                        <!-- BUTTON FOR SHOWING MORE EDITS -->
                        <md-button class="md-primary center"
                            v-if="showMoreEditsButton"
                            @click="showMore('edits')">
                            Tampilkan Lagi
                        </md-button>

                        <!-- SPINNER FOR SHOWING MORE EDITS -->
                        <md-progress-spinner 
                            v-if="showSpinnerMoreEdits"
                            md-mode="indeterminate" 
                            class="center" 
                            style="margin-top: 1em;"
                        ></md-progress-spinner> 
                    </div>
                </div>
            </md-tab> 

            <!-- Reviews -->
            <md-tab md-label="Ulasan" md-icon="rate_review">
                <p class="center">
                    <span class="md-title">{{ user.user.total_reviews }} Pengubahan</span>
                    <br>
                    <span class="md-caption">@2 poin</span>
                    <br>
                    <span class="md-body-2">{{ user.user.total_reviews * 2 }} poin</span>
                </p>

                <div v-if="showReviewsSpinner" class="center">
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
                    <div v-if="contributions.reviews.length == 0">
                        <md-empty-state class="center"
                            md-icon="rate_review"
                            md-label="Anda Belum Memiliki Daftar Ulasan">
                            <p>
                                Kunjungi halaman barang, jasa atau pedagang yang Anda ketahui dan berikan pendapat anda
                            </p>
                        </md-empty-state>
                    </div>
                    <div v-else class="md-layout md-gutter md-alignment-center card-box">
                        <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                            v-for="obj in contributions.reviews"
                            :key=obj.id
                            style="margin-bottom: 1em;">
                            <nuxt-link :to="`/${obj.type}/${obj.id}`" 
                                style="text-decoration:none;">
                                <md-card md-with-hover 
                                    class="md-elevation-4">
                                    <md-ripple>
                                        <md-card-header>
                                            <div class="md-title">{{ obj.name }}</div>
                                            <div class="md-subhead">
                                                <span v-if="obj.type == 'merchant'"> Pedagang <br></span>
                                                {{ obj.category }}
                                            </div>
                                            <div class="body-2" style="margin-top: .2em">
                                                <div v-if="obj.type == 'item'">
                                                    <span class="md-body-1" style="color: #F5F5F5;">
                                                        Rp. {{ obj.price | thousandsSeparator }}
                                                    </span>
                                                </div>
                                                <div v-else-if="obj.type == 'merchant'">
                                                    <span class="md-body-1" style="color: #F5F5F5;">
                                                        {{ obj.location.address }}
                                                    </span>
                                                    <br>
                                                    <span class="md-caption">{{ obj.location.note }}</span>
                                                </div>
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

                    <div v-show="contributions.reviews.length != 0">
                        <!-- BUTTON FOR SHOWING MORE REVIEWS -->
                        <md-button class="md-primary center"
                            v-if="showMoreReviewsButton"
                            @click="showMore('reviews')">
                            Tampilkan Lagi
                        </md-button>

                        <!-- SPINNER FOR SHOWING MORE REVIEWS -->
                        <md-progress-spinner 
                            v-if="showSpinnerMoreReviews"
                            md-mode="indeterminate" 
                            class="center" 
                            style="margin-top: 1em;"
                        ></md-progress-spinner> 
                    </div>
                </div>
            </md-tab> 
        </md-tabs>
        
        <div style="height: 125px;"></div>
    </div>
</template>

<script>
import { db } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'
import thousandsSeparator from '~/plugins/mixins/thousandsSeparator'
import truncate300 from '~/plugins/mixins/truncate300'

import { mapState } from 'vuex'

import AppProfile from '@/components/user/profile';

// Firestore --> Posts contribution query with cursor
var getPostsQuery;
var lastPostDoc;

// Firestore --> Edits contribution query with cursor
var getEditsQuery;
var lastEditDoc;

// Firestore --> Reviews contribution query with cursor
var getReviewsQuery;
var lastReviewDoc;

export default {
    mixins: [thousandsSeparator, truncate300],
    components: { AppProfile },
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        var vm = this;

         // If user is already logged in, then redirect him to home page
        auth.onAuthStateChanged(function(user) {
            // Set posts query for cursor purpose
            getPostsQuery = db.collection('users').doc(user.uid).collection('posts')
                .orderBy('date', 'desc')
                .limit(5);

            // Get this user's posts collection
            getPostsQuery.get()
                .then(function(documentSnapshots) {
                    if(!documentSnapshots.empty) {
                        // Get last bookmark document
                        lastPostDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        documentSnapshots.forEach(function(doc) {
                            var type = doc.data().type,
                                id = doc.data().id;
                            
                            // Get the real item or merchant
                            db.collection(`${type}s`).doc(id).get()
                                .then(function(doc) {
                                    if (doc.exists) {
                                        vm.showPostsSpinner = false;

                                        var obj = doc.data();
                                        obj.type = type;
                                        vm.contributions.posts.push(obj);

                                        if(vm.contributions.posts.length >= vm.user.user.total_posts) {
                                            vm.showMorePostsButton = false;
                                            vm.showSpinnerMorePosts = false;
                                        }
                                    }
                                })
                                .catch(function(error) {
                                    console.error("Error getting document:", error);
                                    UIkit.notification({
                                        status: 'danger',
                                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                                        pos: 'top-right'
                                    });
                                });
                        });
                    }
                    else { vm.showPostsSpinner = false }
                })
                .catch(function(error) {
                    console.error("Error getting documents: ", error);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });

            // Set edits query for cursor purpose
            getEditsQuery = db.collection('users').doc(user.uid).collection('edits')
                .orderBy('date', 'desc')
                .limit(5);

            // Get this user's edits collection
            getEditsQuery.get()
                .then(function(documentSnapshots) {
                    if(!documentSnapshots.empty) {
                        // Get last bookmark document
                        lastEditDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        documentSnapshots.forEach(function(doc) {
                            var type = doc.data().type,
                                id = doc.data().id,
                                status = doc.data().status;
                            
                            // Get the real item or merchant
                            db.collection(`${type}s`).doc(id).get()
                                .then(function(doc) {
                                    if (doc.exists) {
                                        vm.showEditsSpinner = false;

                                        var obj = doc.data();
                                        obj.type = type;
                                        obj.status = status;
                                        vm.contributions.edits.push(obj);

                                        if(vm.contributions.edits.length >= vm.user.user.total_edits) {
                                            vm.showMoreEditsButton = false;
                                            vm.showSpinnerMoreEdits = false;
                                        }
                                    }
                                })
                                .catch(function(error) {
                                    console.error("Error getting document:", error);
                                    UIkit.notification({
                                        status: 'danger',
                                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                                        pos: 'top-right'
                                    });
                                });
                        });
                    }
                    else { vm.showEditsSpinner = false }
                })
                .catch(function(error) {
                    console.error("Error getting documents: ", error);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });
            
            // Set reviews query for cursor purpose
            getReviewsQuery = db.collection('users').doc(user.uid).collection('reviews')
                .orderBy('date', 'desc')
                .limit(5);

            // Get this user's posts collection
            getReviewsQuery.get()
                .then(function(documentSnapshots) {
                    if(!documentSnapshots.empty) {
                        // Get last bookmark document
                        lastReviewDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        documentSnapshots.forEach(function(doc) {
                            var type = doc.data().type,
                                id = doc.data().id;
                            
                            // Get the real item or merchant
                            db.collection(`${type}s`).doc(id).get()
                                .then(function(doc) {
                                    if (doc.exists) {
                                        vm.showReviewsSpinner = false;

                                        var obj = doc.data();
                                        obj.type = type;
                                        vm.contributions.reviews.push(obj);

                                        if(vm.contributions.reviews.length >= vm.user.user.total_reviews) {
                                            vm.showMoreReviewsButton = false;
                                            vm.showSpinnerMoreReviews = false;
                                        }
                                    }
                                })
                                .catch(function(error) {
                                    console.error("Error getting document:", error);
                                    UIkit.notification({
                                        status: 'danger',
                                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                                        pos: 'top-right'
                                    });
                                });
                        });
                    }
                    else { vm.showReviewsSpinner = false }
                })
                .catch(function(error) {
                    console.error("Error getting documents: ", error);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });
        });
    },
    data() {
        return {
            contributions: {
                posts: [],
                reviews: [],
                edits: []
            },

            showPostsSpinner: true,
            showEditsSpinner: true,
            showReviewsSpinner: true,

            showMorePostsButton: true,
            showSpinnerMorePosts: false,

            showMoreEditsButton: true,
            showSpinnerMoreEdits: false,

            showMoreReviewsButton: true,
            showSpinnerMoreReviews: false
        }
    },
    methods: {
        showMore(contributionDoc) {
            var vm = this;

            var query = null;
            if(contributionDoc == 'posts') { 
                query = getPostsQuery; 
                vm.showMorePostsButton = false;
                vm.showSpinnerMorePosts = true;
            }
            else if(contributionDoc == 'edits') { 
                query = getEditsQuery; 
                vm.showMoreEditsButton = false;
                vm.showSpinnerMoreEdits = true;
            }
            else if(contributionDoc == 'reviews') { 
                query = getReviewsQuery; 
                vm.showMoreReviewsButton = false;
                vm.showSpinnerMoreReviews = true;
            }

            query.startAfter(lastDoc)
                .get()
                .then(function(documentSnapshots) {
                    // Get last contribution document
                    lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                    documentSnapshots.forEach(function(doc) {
                        var type = doc.data().type,
                            id = doc.data().id;
                        
                        // Get the real item or merchant
                        db.collection(`${type}s`).doc(id).get()
                            .then(function(doc) {
                                if (doc.exists) {
                                    var obj = doc.data();
                                    obj.type = type;
                                    vm.contributions[contributionDoc].push(obj);

                                    if(vm.contributions[contributionDoc].length != vm.user.user.total_posts) { 
                                        if(contributionDoc == 'posts') { 
                                            vm.showMorePostsButton = true;
                                            vm.showSpinnerMorePosts = false;
                                        }
                                        else if(contributionDoc == 'edits') { 
                                            vm.showMoreEditsButton = true;
                                            vm.showSpinnerMoreEdits = false;
                                        }
                                        else if(contributionDoc == 'reviews') { 
                                            vm.showMoreReviewsButton = true;
                                            vm.showSpinnerMoreReviews = false;
                                        }
                                    }
                                    else {
                                        if(contributionDoc == 'posts') { 
                                            vm.showMorePostsButton = false;
                                            vm.showSpinnerMorePosts = false;
                                        }
                                        else if(contributionDoc == 'edits') { 
                                            vm.showMoreEditsButton = false;
                                            vm.showSpinnerMoreEdits = false;
                                        }
                                        else if(contributionDoc == 'reviews') { 
                                            vm.showMoreReviewsButton = false;
                                            vm.showSpinnerMoreReviews = false;
                                        }
                                    }
                                }
                            })
                            .catch(function(error) {
                                console.error("Error getting document:", error);
                                UIkit.notification({
                                    status: 'danger',
                                    message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                                    pos: 'top-right'
                                });
                            });
                    });    
                }, 
                function(error) {
                    // Alert error message
                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Terjadi Kendala Menampilkan Kontribusi. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });  
       }
    }
}
</script>

<style lang="scss" scoped>
    .profile-picture {
        width: 100%;
        max-width: 7.5em;
        max-height: 7.5em;
        border-radius: 100%;
        margin-top: 1em;
        margin-bottom: 1em;
    }

    .skeleton-loader { margin: 0 auto; }
</style>