<template>
    <div>
        <!-- Profile Picture -->
        <md-menu md-direction="bottom-end">
            <md-button md-menu-trigger class="md-icon-button">
            <!-- User is logged out -->
            <md-avatar v-if="!user.user.id">
                <img src="~/assets/images/anonymous.png" alt="Anonymous">
            </md-avatar>

            <!-- User is logged in -->
            <md-avatar v-else>
                <!-- If user set profile picture -->
                <div v-if="user.user.photoUrl">
                <img :src="user.user.photoUrl" alt="Foto Profil">
                </div>

                <!-- If user doesn't set profile picture -->
                <div v-else>
                <img src="~/assets/images/user.png" alt="Foto Profil">
                </div>  
            </md-avatar>
            </md-button>
            <md-menu-content>
            <md-menu-item v-if="user.user.id">{{ user.user.email }}</md-menu-item>

            <!-- User is logged out -->
            <div v-if="!user.user.id">
                <nuxt-link to="/log-in">
                <md-menu-item ><span class="blue-text">Masuk (Log In)</span></md-menu-item>
                </nuxt-link>
            </div>

            <!-- User is logged in -->
            <div v-else>
                <md-menu-item to="/user/contributions">Kontribusi</md-menu-item>
                <md-menu-item to="/user/bookmarks">Daftar Tersimpan</md-menu-item>
                <md-menu-item class="log-out">
                    <span class="red-text center"
                        @click="logOut">Keluar (Log Out)</span>
                </md-menu-item>
            </div>
            <div class="center">
                <md-menu-item to="/about">
                    <span class="md-caption center">Tentang Kami</span>   
                </md-menu-item>
                <md-menu-item to="/about/privacy">
                    <span class="md-caption center">Privasi</span>   
                </md-menu-item>
                <md-menu-item to="/about/terms">
                    <span class="md-caption center">Kebijakan Pengguna</span>
                </md-menu-item>
            </div>
            
            </md-menu-content>
        </md-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import { auth } from '~/plugins/fireinit.js'

export default {
    computed: {
    ...mapState(['user'])
    },
    methods: {
        ...mapMutations({
            'logOutUser': 'user/logOutUser'
        }),
        logOut() {
            var vm = this;

            auth.signOut()
                .then(function() {
                    // Sign-out successful.
                    vm.logOutUser();

                    UIkit.notification({
                        status: 'success',
                        message: "Anda telah keluar (Log Out) dari aplikasi", 
                        pos: 'top-right'
                    });
                })
                .catch(function(error) {
                    // An error happened.
                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Log Out. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    .log-out:hover {
        cursor: pointer;
    }
</style>