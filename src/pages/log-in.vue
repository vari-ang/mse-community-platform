<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="validateUser">
            <md-card class="md-layout-item md-size-50 md-small-size-100" style="border-radius: 1em;">
                <md-card-header>
                    <div class="md-title">Log In untuk menemukan pedagang, produk, dan jasa menarik</div>
                </md-card-header>

                <md-card-content>
                    <md-field :class="getValidationClass('email')">
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="form.sending" />
                        <span class="md-error" v-if="!$v.form.email.required">Email wajib diisi</span>
                        <span class="md-error" v-else-if="!$v.form.email.email">Format Email tidak valid</span>
                    </md-field>

                    <md-field :class="getValidationClass('password')">
                        <label for="password">Password</label>
                        <md-input type="password" name="email" maxlength="16" v-model="form.password" :disabled="form.sending" />
                        <span class="md-error" v-if="!$v.form.password.required">Password wajib diisi</span>
                        <span class="md-error" v-else-if="!$v.form.password.minLength">Panjang password minimum 6 kata</span>
                        <span class="md-error" v-else-if="!$v.form.password.maxLength">Panjang password maximum 6 kata</span>
                    </md-field>
                </md-card-content>

                <div class="center">
                    <md-button type="submit" class="md-primary md-raised"
                               :disabled="form.sending || disabled">Log In
                    </md-button>
                    <md-button class="md-raised"
                               style="background: white; color: #3b5998;"
                               @click="googleLogIn"
                               :disabled="disabled">
                        <i class="fa fa-google" aria-hidden="true"></i> Log In dengan Google
                    </md-button>
                    <md-button class="md-raised md-accent fb-btn"
                               style="background: #3b5998; color: white;"
                               @click="fbLogIn"
                               :disabled="disabled">
                        <i class="fa fa-facebook" aria-hidden="true"></i> Log In dengan Facebook
                    </md-button>
                </div>

                <p class="center" style="margin-top: 2em;">
                    Lupa Password?
                    <span class="red-text reset-password-link"
                          @click="prompt.active = true">Ubah Password</span>
                </p>

                <!-- Email Address Prompt -->
                <md-dialog :md-active.sync="prompt.active" style="padding: 15px; width: 100%">
                    <form novalidate class="md-layout" @submit.prevent="validateUserPrompt">
                        <md-button class="md-icon-button md-raised"
                                @click="prompt.active = false"
                                style="position: absolute; right: 0; top: 5px; border-radius: 50%;">
                            <md-icon>close</md-icon>
                        </md-button>
                        
                        <md-dialog-title class="center">
                            Ubah Password
                        </md-dialog-title>
                        
                        <p class="center" style="margin-top: 1.5em;">
                            <span class="md-body-1">
                                Tuliskan Email Anda Saat Ini Untuk Mengatur Ulang Password
                            </span>
                        </p>

                        <md-field style="width:80%; margin: 0 auto;" :class="getValidationClassPrompt('email')">
                            <md-input type="email" name="email" autocomplete="email"
                                    placeholder="example@example.com"
                                    v-model="prompt.email" :disabled="prompt.sending" />

                            <p class="red-text" v-if="!$v.prompt.email.required">
                                <span class="md-body-1">*Email wajib diisi</span>
                            </p>
                            <p class="red-text" v-else-if="!$v.prompt.email.email">
                                <span class="md-body-1">*Format Email tidak valid</span>
                            </p>
                        </md-field>
                        
                        <md-progress-bar md-mode="indeterminate" v-if="prompt.sending" />

                        <md-card-actions class="center">
                            <md-button type="submit" class="md-accent" :disabled="prompt.sending">
                                Ubah
                            </md-button>
                        </md-card-actions>
                        <div style="height: 1em;"></div>
                    </form>
                </md-dialog>
               
                <p class="center" style="margin-top: 1em;">
                    Pengguna Baru? 
                    <nuxt-link to="/sign-up" class="uk-link-reset">
                        <b class="yellow-text">Buat Akun</b>
                    </nuxt-link>
                </p>

                <div style="height: 25px;"></div>

                <md-progress-bar md-mode="indeterminate" v-if="form.sending" />
            </md-card>
        </form>
    </div>
</template>

<script>
import { auth } from '~/plugins/fireinit.js'
import { GoogleProvider } from '~/plugins/fireinit.js'
import { FbProvider } from '~/plugins/fireinit.js'

import { validationMixin } from 'vuelidate'
import {
    required,
    email,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'

export default {
    head() {
        return {
            title: 'Stonary • Masuk',
            meta: [
                { 
                    hid: 'logIn', name: 'description', 
                    content: 'Masuk ke Stonary sehingga Anda dapat mendukung bisnis lokal mikro dan kecil dengan mengoranisir informasi tentang bisnis kecil apa pun atau menggunakan produk dan jasa yang ada.'
                },
                {
                    name: "keywords",
                    content: "Sign In, Log In, Masuk, Akun"
                },
            ]
        }
    },
    layout: 'account',
    name: 'FormValidation',
    mixins: [validationMixin],
    mounted() {
        var vm = this;

        // If user is already logged in, then redirect him to home page
        auth.onAuthStateChanged(function(user) {
            if(user) { vm.$router.push('/'); }
            else { vm.disabled = false; }
        });
    },
    data() {
        return {   
            // Disable all buttons initially until the user is confirmed to not be logged in yet
            disabled: true,

            form: {
                email: null,
                password: null,
                sending: false,
            },
            prompt: {
                active: false,
                email: null,
                sending: false
            }
        }
    },
    validations: {
      form: {
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(16)
        }
      },
      prompt: {
        email: {
          required,
          email
        }
      }
    },
    methods: {
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        getValidationClassPrompt (fieldName) {
            const field = this.$v.prompt[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        clearForm () {
            this.$v.$reset();
            this.form.email = null;
            this.form.password = null;
        },
        validateUser () {
            this.$v.form.$touch();

            if (!this.$v.form.$invalid) {
                this.logIn();
            }
        },
        validateUserPrompt () { 
            this.$v.prompt.$touch();

            if (!this.$v.prompt.$invalid) {
                this.resetPassword();
            }
        },
        logIn () {
            var vm = this;
            vm.form.sending = true;

            // Sign user In
            auth.signInWithEmailAndPassword(vm.form.email, vm.form.password)
                .then(function() {
                    // Get current user
                    vm.unsubscribe = auth.onAuthStateChanged(function(user) {
                        // Email is verified
                        if(user.emailVerified) {
                            UIkit.notification({
                                status: 'success',
                                message: "Anda telah masuk ke dalam aplikasi Stonary. Selamat Datang!", 
                                pos: 'top-right'
                            });
                        }
                        else {     
                            vm.form.sending = false;
                            UIkit.notification({
                                status: 'danger',
                                message: 'Gagal Log In. Mohon verifikasi email Anda terlebih dulu dengan membuka link verifikasi pada inbox email Anda', 
                                pos: 'top-right'
                            });
                        }
                    });
                    
                    // Stop listening to firebase auth state change
                    vm.unsubscribe();
                })
                .catch(function(error) {
                    vm.form.sending = false;
                    var msg = error.message;
                    console.error(error.message);

                    if(error.code == "auth/wrong-password") {
                        msg = "Password salah atau Anda tidak memiliki password";
                    }

                    UIkit.notification({
                        status: 'danger',
                        message: `Gagal Log In. ${msg}`, 
                        pos: 'top-right'
                    });
                });
        },
        googleLogIn() {
            var vm = this;
            vm.form.sending = true;

            // Specify additional OAuth 2.0 scopes
            // GoogleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

            // localize the provider's OAuth flow to the user's preferred language
            auth.languageCode = 'id';

            // Authenticate with Firebase using the Google provider object
            auth.signInWithPopup(GoogleProvider)
                .then(function(result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    
                    UIkit.notification({
                        status: 'success',
                        message: "Anda telah masuk ke dalam aplikasi Stonary. Selamat Datang!", 
                        pos: 'top-right'
                    });
                })
                .catch(function(error) {
                    vm.form.sending = false;

                    console.error(error.message);
                     UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Log In. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });
        },
        fbLogIn() {
            var vm = this;
            vm.form.sending = true;

            // Specify additional OAuth 2.0 scopes
            // GoogleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

            // localize the provider's OAuth flow to the user's preferred language
            auth.languageCode = 'id';

            // // Specify additional custom OAuth provider parameters that you want to send with the OAuth request
            FbProvider.setCustomParameters({ 'display': 'popup' });

            // Step 1. User tries to sign in to Facebook.
            auth.signInWithPopup(FbProvider)
                .then(function(result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    
                    UIkit.notification({
                        status: 'success',
                        message: "Anda telah masuk ke dalam aplikasi Stonary. Selamat Datang!", 
                        pos: 'top-right'
                    });
                })
                .catch(function(error) {
                    vm.form.sending = false;
                    var msg = error.message;
                    console.error(error.message);

                    // User sudah memiliki akun dengan email ini
                    if (error.code === 'auth/account-exists-with-different-credential') {
                        msg = "Anda sudah pernah menggunakan email ini dengan metode Log In yang berbeda";
                    }

                    UIkit.notification({
                        status: 'danger',
                        message: `Gagal Log In. ${msg}`, 
                        pos: 'top-right'
                    });
                });
        },
        resetPassword() {
            var vm = this;
            vm.prompt.sending = true;
            var email = vm.prompt.email;

            auth.sendPasswordResetEmail(email)
                .then(function() {
                    // Email sent.
                    vm.prompt.email = '';
                    vm.prompt.sending = false;
                    vm.prompt.active = false;

                    UIkit.notification({
                        status: 'success',
                        message: "Anda telah masuk ke dalam aplikasi Stonary. Selamat Datang!", 
                        pos: 'top-right'
                    });
                })
                .catch(function(error) {
                    vm.prompt.sending = false;

                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Mengatur Ulang Password. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                        pos: 'top-right'
                    });
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    form {
        width: 100%;
        margin: 0 auto;

        .md-card { margin: 0 auto; }
        .md-button { 
            width: 95%; 
            margin: 0 auto 1em auto; 
            border-radius: 1em; 
        }

        .reset-password-link {
            &:hover {
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
</style>
