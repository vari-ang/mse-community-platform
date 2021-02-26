<template>
    <div>
        <div v-if="showUserSpinner" class="center" style="margin-top: 2em;">
            <p><span class="md-headline">Mohon Tunggu Sebentar...</span></p>
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div v-else>
            <span class="md-display-1 center">Profil Anda</span>

            <!-- PROFILE INFO -->
            <!-- If user set profile picture -->
            <div class="center">
                <div v-if="user.user.photoUrl">
                    <img :src="user.user.photoUrl" alt="User's Profile Picture"
                        class="profile-picture">
                    
                </div>
                <!-- If user doesn't set profile picture -->
                <div v-else>
                    <img src="~/assets/images/user.png" alt="User's Profile Picture"
                        class="profile-picture">
                </div>  
                <p><span class="md-body-2">{{ user.user.email }}</span></p>

                <div class="md-layout">
                    <div class="md-layout-item">
                        <nuxt-link to="/user/bookmarks" class="link">
                            <p :class="{'highlighted': ($nuxt.$route.path.includes('/bookmarks'))}">
                                <span class="md-title">{{ user.user.total_bookmarks }}</span> <br>
                                <span class="md-body-1">
                                    Daftar Tersimpan
                                </span>
                            </p>
                        </nuxt-link>
                    </div>
                    <div class="md-layout-item">
                        <nuxt-link to="/user/contributions" class="link">
                            <p :class="{'highlighted': ($nuxt.$route.path.includes('/contributions'))}">
                                <span class="md-title">{{ user.user.contribution_points }} <md-icon>stars</md-icon></span> <br>
                                <span class="md-body-1">
                                    Poin Kontribusi
                                </span>
                            </p>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'

import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

export default {
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        var vm = this;

         // If user is already logged in, then redirect him to home page
        auth.onAuthStateChanged(function(user) {
            if(!user) { vm.$router.push('/log-in'); }
            else { vm.showUserSpinner = false; }

            // Get this user data
            db.collection('users').doc(user.uid).get()
                .then(function(doc) {
                     // Set user data
                    var obj = {};

                    if (doc.exists) { 
                        obj.id = user.uid;
                        obj.email = user.email;
                        obj.photoUrl = user.photoURL;
                        obj.total_bookmarks = doc.data().total_bookmarks ? doc.data().total_bookmarks : 0;
                        obj.contribution_points = doc.data().contribution_points ? doc.data().contribution_points : 0;
                        obj.total_posts = doc.data().total_posts ? doc.data().total_posts : 0;
                        obj.total_reviews = doc.data().total_reviews ? doc.data().total_reviews : 0;
                        obj.total_edits = doc.data().total_edits ? doc.data().total_edits : 0;
                    }
                    else {
                        obj.id = user.uid;
                        obj.email = user.email;
                        obj.photoUrl = user.photoURL;
                        obj.total_bookmarks = 0;
                        obj.contribution_points = 0;
                        obj.total_posts = 0;
                        obj.total_reviews = 0;
                        obj.total_edits = 0;
                    }

                    // Set user to vuex store
                    vm.setUser(obj);
                })
                .catch(function(error) {
                    console.error("Error getting document:", error);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Terjadi Kendala Menampilkan Informasi. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });
                });
        });
    },
    data() {
        return {
            showUserSpinner: true
        }
    },
    methods: {
        ...mapMutations({
            'setUser': 'user/setUser',
            'logOutUser': 'user/logOutUser'
        })
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

    .highlighted { 
        background: #52596E; border-radius: 1em;
        span { font-weight: bold; }
    }

    .link {
        &:hover { 
            text-decoration: none; 
            span { font-weight: bold; }
        }
        span { color: white; }
    }
</style>