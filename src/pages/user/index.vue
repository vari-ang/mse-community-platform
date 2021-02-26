<template>
    <div>
        <div v-if="showLoadingSpinner" class="center" style="margin-top: 2em;">
            <p><span class="md-headline">Mohon Tunggu Sebentar ...</span></p>
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div v-else>
            <app-profile></app-profile>

            <!-- Contribution -->
            <nuxt-link to="/user/contributions" class="link">
                <md-card md-with-hover>
                    <md-ripple>
                        <md-card-header>
                            <div class="md-title">Kontribusi</div>
                            <div class="md-subhead">Penambahan, Perubahan Informasi, dan Pemberian Ulasan</div>
                        </md-card-header>

                        <md-card-content>
                            Lihat semua kontribusi Anda dan kumpulkan sebanyak mungkin poin. Semakin banyak poin Anda, semakin baik pertumbuhan Usaha Mikro dan Kecil (UMK) dan bangsa ini <md-icon>mood</md-icon>
                        </md-card-content>
                    </md-ripple>
                </md-card>
            </nuxt-link>
            
            <!-- Saved List -->
            <nuxt-link to="/user/bookmarks" class="link">
                <md-card md-with-hover style="margin-top: 1.5em;" class="link">
                    <md-ripple>
                        <md-card-header>
                            <div class="md-title">Daftar Tersimpan</div>
                            <!-- <div class="md-subhead">It also have a ripple</div> -->
                        </md-card-header>

                        <md-card-content>
                            Cek semua produk, jasa, dan usaha mikro dan kecil yang pernah Anda simpan.
                        </md-card-content>
                    </md-ripple>
                </md-card>
            </nuxt-link>

            <!-- Log Out Button -->
            <div class="center" style="margin-top: 3em;">
                <md-button class="md-raised md-accent center" style="border-radius: 1em;"
                    @click="logOut">
                    Log Out
                </md-button>
            </div>
        </div>

        <div style="height: 125px;"></div>
    </div>
</template>

<script>
import AppProfile from '@/components/user/profile';

import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import { auth } from '~/plugins/fireinit.js'

export default {
    components: { AppProfile },
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        var vm = this;

         // If user is already logged in, then redirect him to home page
        auth.onAuthStateChanged(function(user) {
            if(!user) { vm.$router.push('/log-in'); }
            else { vm.showLoadingSpinner = false; }
        });
    },
    data() {
        return {
            showLoadingSpinner: true
        }
    },
    methods: {
        ...mapMutations({
            'logOutUser': 'user/logOutUser'
        }),
        logOut() {
            var vm = this;

            auth.signOut().
                then(function() {
                    // Sign-out successful.
                    vm.logOutUser();

                    UIkit.notification({
                        status: 'success',
                        message: "Anda telah keluar (Log Out) dari aplikasi", 
                        pos: 'top-right'
                    });

                    // Direct user to home page after some seconds
                    window.setTimeout(function(){
                        // Move to a new location
                        window.location.replace('/')
                    }, 3000);
                })
                .catch(function(error) {
                    // An error happened.
                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Log Out. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    .link {
        text-decoration: none;

        &:hover { text-decoration: none; }
    }

    .profile-picture {
        width: 100%;
        max-width: 7.5em;
        max-height: 7.5em;
        border-radius: 100%;
        margin-top: 1em;
        margin-bottom: 1em;
    }

    .md-card { border-radius: 1em; }
</style>