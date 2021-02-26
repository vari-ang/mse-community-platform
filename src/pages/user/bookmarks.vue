<template>
    <div>
        <!-- User is logged in -->
        <app-profile></app-profile>

        <!-- Saved List -->
        <div v-if="showBookmarksSpinner" class="center">
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
            <div v-if="bookmarks.length == 0">
                <md-empty-state class="center"
                    md-icon="bookmark_border"
                    md-label="Anda Belum Memiliki Daftar Tersimpan">
                    <p>
                        Kunjungi halaman barang, jasa atau usaha dan klik <md-icon>bookmark</md-icon> untuk menyimpan
                    </p>
                </md-empty-state>
            </div>            
            <div v-else class="md-layout md-gutter md-alignment-center card-box">
                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                    v-for="obj in bookmarks"
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
                                        {{ obj.category }}
                                        <span v-if="obj._type == 'merchant'"> (Pedagang)</span>
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

                <!-- BUTTON FOR SHOWING MORE BOOKMARKS -->
                <md-button class="md-primary center"
                    v-if="showMoreBookmarksButton"
                    @click="showMoreBookmarks">
                    Tampilkan Lagi
                </md-button>

                <!-- SPINNER FOR SHOWING MORE BOOKMARKS -->
                <md-progress-spinner 
                    v-if="showSpinnerMoreBookmarks"
                    md-mode="indeterminate" 
                    class="center" 
                    style="margin-top: 1em;"
                ></md-progress-spinner>
            </div>
        </div>
        
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

// Firestore --> Bookmarks query with cursor
var getBookmarksQuery;
var lastBookmarkDoc;

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
            // Set reviews query for cursor purpose
            getBookmarksQuery = db.collection('users').doc(user.uid).collection('bookmarks')
                .orderBy('date', 'desc')
                .limit(5);

            // Get this user's bookmarks collection
            getBookmarksQuery.get()
                .then(function(documentSnapshots) {
                    if(!documentSnapshots.empty) {
                        // Get last bookmark document
                        lastBookmarkDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        documentSnapshots.forEach(function(doc) {
                            var type = doc.data().type,
                                id = doc.data().id;
                            
                            // Get the real item or merchant
                            db.collection(`${type}s`).doc(id).get()
                                .then(function(doc) {
                                    if (doc.exists) {
                                        vm.showBookmarksSpinner = false;

                                        var obj = doc.data();
                                        obj.type = type;
                                        vm.bookmarks.push(obj);

                                        if(vm.bookmarks.length >= vm.user.user.total_bookmarks) {
                                            vm.showMoreBookmarksButton = false;
                                            vm.showSpinnerMoreBookmarks = false;
                                        }
                                    }
                                })
                                .catch(function(error) {
                                    console.error("Error getting document:", error);
                                    UIkit.notification({
                                        status: 'danger',
                                        message: 'Terjadi Kendala Menampilkan Daftar Tersimpan. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                                        pos: 'top-right'
                                    });
                                });
                        });
                    }
                    else { vm.showBookmarksSpinner = false }
                })
                .catch(function(error) {
                    console.error("Error getting documents: ", error);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Terjadi Kendala Menampilkan Daftar Tersimpan. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });
        });
    },
    data() {
        return {
            showBookmarksSpinner: true,
            showMoreBookmarksButton: true,
            showSpinnerMoreBookmarks: false,
            bookmarks: [],
            totalBookmarks: 0
        }
    },
    methods: {
       showMoreBookmarks() {
           var vm = this;

            vm.showMoreBookmarksButton = false;
            vm.showSpinnerMoreBookmarks = true;

            getBookmarksQuery
                .startAfter(lastBookmarkDoc)
                .get()
                .then(function(documentSnapshots) {
                    // Get last review document
                    lastBookmarkDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                    documentSnapshots.forEach(function(doc) {
                        var type = doc.data().type,
                            id = doc.data().id;
                        
                        // Get the real item or merchant
                        db.collection(`${type}s`).doc(id).get()
                            .then(function(doc) {
                                if (doc.exists) {
                                    var obj = doc.data();
                                    obj.type = type;
                                    vm.bookmarks.push(obj);

                                    if(vm.bookmarks.length != vm.user.user.total_bookmarks) { 
                                        vm.showMoreBookmarksButton = true;
                                        vm.showSpinnerMoreBookmarks = false;
                                    }
                                    else {
                                        vm.showMoreBookmarksButton = false;
                                        vm.showSpinnerMoreBookmarks = false;
                                    }
                                }
                            })
                            .catch(function(error) {
                                console.error("Error getting document:", error);
                                UIkit.notification({
                                    status: 'danger',
                                    message: 'Terjadi Kendala Menampilkan Daftar Tersimpan. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
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
                        message: 'Terjadi Kendala Menampilkan Daftar Tersimpan. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });  
       }
    }
}
</script>

<style lang="scss" scoped>
  .skeleton-loader { margin: 0 auto; }  
</style>