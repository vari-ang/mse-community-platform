<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="validateUser">
            <md-card class="md-layout-item md-size-50 md-small-size-100" style="border-radius: 1em;">
                <md-card-header>
                    <div class="md-title">Buat Akun Stonary</div>
                </md-card-header>

                <md-card-content>
                    <md-field :class="getValidationClass('email')">
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
                        <span class="md-error" v-if="!$v.form.email.required">Email wajib diisi</span>
                        <span class="md-error" v-else-if="!$v.form.email.email">Format Email tidak valid</span>
                    </md-field>

                    <md-field :class="getValidationClass('password')">
                        <label for="password">Password</label>
                        <md-input type="password" name="email" maxlength="16" v-model="form.password" :disabled="sending" />
                        <span class="md-error" v-if="!$v.form.password.required">Password wajib diisi</span>
                        <span class="md-error" v-else-if="!$v.form.password.minLength">Panjang password minimum 6 kata</span>
                        <span class="md-error" v-else-if="!$v.form.password.maxLength">Panjang password maximum 6 kata</span>
                    </md-field>

                    <md-field :class="getValidationClass('rePassword')">
                        <label for="password">Ulangi Password</label>
                        <md-input type="password" name="email" maxlength="16" v-model="form.rePassword" :disabled="sending" />
                        <span class="md-error" v-if="!$v.form.rePassword.sameAsPassword">Password tidak sama</span>
                    </md-field>
                </md-card-content>

                <md-card-actions class="center">
                    <md-button type="submit" class="md-primary md-raised" style="width: 100%; border-radius: 1em;"
                               :disabled="sending">Daftar</md-button>
                </md-card-actions>

                 <p class="center" style="margin-top: 1em;">
                    Sudah Memiliki Akun? 
                    <nuxt-link to="/log-in" class="uk-link-reset">
                        <b class="yellow-text">Masuk (Log In)</b>
                    </nuxt-link>
                </p>

                <div style="height: 25px;"></div>

                <md-progress-bar md-mode="indeterminate" v-if="sending" />
            </md-card>
        </form>
    </div>
</template>

<script>
import { auth } from '~/plugins/fireinit.js'

import { validationMixin } from 'vuelidate'
import {
    required,
    email,
    minLength,
    maxLength,
    sameAs
} from 'vuelidate/lib/validators'

export default {
    head() {
        return {
            title: 'Stonary • Buat Akun',
            meta: [
                { 
                    hid: 'signUp', name: 'description', 
                    content: 'Daftarkan akun Anda untuk bergabung dengan Komunitas Stonary. Dan, mari kita bersama-sama membantu usaha mikro dan kecil untuk berkembang.'
                },
                {
                    name: "keywords",
                    content: "Sign Up, Buat Akun, Daftar Akun, Akun"
                },
            ]
        }
    },
    layout: 'account',
    name: 'FormValidation',
    mixins: [validationMixin],
    data() {
        return {      
            form: {
                email: null,
                password: null,
                rePassword: null
            },
            
            sending: false
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
        },
        rePassword: {
          sameAsPassword: sameAs('password')
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
        clearForm () {
            this.$v.$reset();
            this.form.email = null;
            this.form.password = null;
        },
        validateUser () {
            this.$v.$touch()

            if (!this.$v.$invalid) {
                this.signUp()
            }
        },
        signUp () {
            var vm = this;
            vm.sending = true;

            auth.createUserWithEmailAndPassword(vm.form.email, vm.form.password)
                .then(function() {
                    // If user is successfully registered

                    // Get current user
                    auth.onAuthStateChanged(function(user) {
                        if(user) {
                            // Send verification email
                            user.sendEmailVerification().then(function() {
                                // Add new user on firestore
                                vm.success = true;
                                
                                UIkit.notification({
                                    status: 'success',
                                    message: "Berhasil Membuat Akun. Anda akan segera diarahkan ke halaman Log In", 
                                    pos: 'top-right'
                                });

                                window.setTimeout(() => {
                                    vm.sending = false;
                                    vm.clearForm();

                                    // Move to a new location
                                    window.location.replace('/log-in/');
                                }, 2500);
                            })
                            .catch(function(error) {
                                vm.sending = false;

                                console.error(error.message);
                                UIkit.notification({
                                    status: 'danger',
                                    message: 'Gagal Membuat Akun. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                    pos: 'top-right'
                                });
                            });
                        }
                    });

                })
                .catch(function(error) {
                    console.error(error.message);

                    vm.sending = false;
                    var msg = error.message;

                    if(error.code == 'auth/email-already-in-use') {
                        msg = 'Email ini sudah pernah digunakan. Silahkan menggunakan email yang lain'
                    }

                    UIkit.notification({
                        status: 'danger',
                        message: `Gagal Membuat Akun. ${msg}`, 
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
}
</style>
