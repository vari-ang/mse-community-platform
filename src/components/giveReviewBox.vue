<template>
    <div style="margin-top: 1em;">
        <md-card class="md-elevation-7">
            <md-card-header>
                <div class="md-title">Berikan Ulasan</div>
            </md-card-header>

            <md-card-content>
                <p v-if="type == 'item'">
                    Pernah menggunakan barang atau jasa ini? Silahkan berikan ulasan.
                </p>
                <p v-if="type == 'merchant'">
                    Pernah datang atau mengetahui seputar Merchant (Pedagang) ini? Silahkan berikan ulasan.
                </p>
            </md-card-content>

            <md-card-expand style="margin-top: -1em;">
                <md-card-actions>
                    <md-card-expand-trigger>
                        <md-button style="text-transform: capitalize;">Tulis Ulasan</md-button>
                    </md-card-expand-trigger>
                </md-card-actions>

                <md-card-expand-content>
                    <md-card-content>
                        <div style="margin-top: -2em;">
                            <form novalidate @submit.prevent="validateUser">
                                <md-card-content>
                                    <span class="md-title">Rating</span>
                                    <md-field :class="getValidationClass('rating')">
                                        <star-rating
                                            v-model="form.rating"
                                            :disabled="form.sending"
                                            :star-size="30"
                                            active-color="#ffea00"
                                        ></star-rating>
                                        <span class="md-error" v-if="!$v.form.rating.required">Tolong berikan rating</span>
                                    </md-field>

                                    <md-field :class="getValidationClass('title')">
                                        <label>Judul</label>
                                        <md-input maxlength="50" 
                                            v-model="form.title" :disabled="form.sending" />
                                        <span class="md-error" v-if="!$v.form.title.required">Judul Review wajib diisi</span>
                                        <span class="md-error" v-else-if="!$v.form.title.maxLength">Panjang judul review maksimum 50 kata</span>
                                    </md-field>

                                    <md-field :class="getValidationClass('description')">
                                        <label>Isi Review</label>
                                        <md-textarea style="resize: none;" maxlength="1000"
                                            v-model="form.description" :disabled="form.sending"></md-textarea>
                                        <span class="md-error" v-if="!$v.form.description.required">Isi review wajib diisi</span>
                                        <span class="md-error" v-else-if="!$v.form.description.minLength">Panjang review maksimal 10 kata</span>
                                        <span class="md-error" v-else-if="!$v.form.description.maxLength">Panjang review maksimal 1000 kata</span>
                                    </md-field>
                                </md-card-content>

                                <md-card-actions class="center">
                                    <md-button type="submit" class="md-primary md-raised"
                                            :disabled="form.sending || !user.user.id">
                                        <md-icon>send</md-icon>
                                        Kirim
                                    </md-button>

                                    <!-- Give Review Success Message -->
                                    <md-dialog-alert style="z-index: 99999999"
                                        :md-active.sync="success"
                                        :md-content="`<h3 style='text-align:center'>Berhasil Menambahkan Ulasan</h3> <br>
                                            <p style='text-align:center'>Terimakasih atas kontribusi Anda untuk memajukan Usaha Mikro dan Kecil (UMK) di Indonesia! <br><br> Anda telah mendapatkan tambahan 2 poin</p>`"
                                        md-confirm-text="OK!" />
                                </md-card-actions>

                                <div style="height: 20px;"></div>

                                <md-progress-bar md-mode="indeterminate" v-if="form.sending" />
                            </form>
                        </div>
                    </md-card-content>
                </md-card-expand-content>
            </md-card-expand>
        </md-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

var firebase = require('firebase');
import { db } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'

import StarRating from 'vue-star-rating'
import { validationMixin } from 'vuelidate'
import {
    required,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    components: { StarRating },
    props: [
        'type', // merchant or item
        'data'
    ],
    data() {
        return {
            id: this.$route.params.id,

            form: {
                rating: 5,
                title: null,
                description: null,
                sending: false,
            },

            success: false
        }
    },
    validations: {
      form: {
        rating: {
          required
        },
        title: {
            required,
            maxLength: maxLength(50)
        },
        description: {
            required,
            minLength: minLength(10),
            maxLength: maxLength(1000)
        }
      }
    },
    computed: {
        ...mapState(['user'])
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
            this.form.rating = 5;
            this.form.title = null;
            this.form.description = null;
        },
        validateUser () {
            this.$v.form.$touch();

            if (!this.$v.form.$invalid) {
                this.submitReview();
            }
        },
        submitReview() { 
            var vm = this;
            var newPoints = 2; // user's new point will be added by 2
            var newTotalReviews = 1;
            var FieldValue = firebase.firestore.FieldValue; // to access server timestamp

            auth.onAuthStateChanged(function(user) {
                if (user) {
                    vm.form.sending = true;

                    db.collection(`${vm.type}s`).doc(vm.id).collection('reviews').where('author', "==", { 
                        id: user.uid,
                        email: user.email
                    })
                    .get()
                    .then(function(querySnapshot) {
                        // Check to see if the user has already submitted a review
                        if(querySnapshot.size > 0) {
                            // User has already submitted a review
                            // So alert the user
                            vm.form.sending = false;

                            UIkit.notification({
                                status: 'danger',
                                message: 'Tidak Dapat Memberikan Ulasan Lagi. Anda sudah pernah memberikan ulasan sebelumnya', 
                                pos: 'top-right'
                            });
                        }
                        else {
                            // Get initial rating (current merchant or item rating)
                            var initRating = vm.data.rating;

                            var reviewsRef = db.collection(`${vm.type}s`).doc(vm.id).collection('reviews').doc(),
                                reviewId = reviewsRef.id,
                                numOfReviews = 0, // Initial number of reviews given
                                newRating = 0, // New average rating after user send review
                                author = { 
                                    id: user.uid,
                                    email: user.email
                                };

                            // First, get user's contribution point
                            var userRef = db.collection('users').doc(author.id);
                            userRef.get().then(function(doc) {
                                if (doc.exists) {
                                    // If the user had points before
                                    if(doc.data().contribution_points != undefined) newPoints = doc.data().contribution_points + 2; 

                                    // If the user had given reviews before
                                    if(doc.data().total_reviews != undefined) newTotalReviews = doc.data().total_reviews + 1; 
                                }

                                /* ADD DATA TO FIRESTORE */

                                var batch = db.batch();
                                batch.update(userRef, { contribution_points: newPoints, total_reviews: newTotalReviews });

                                numOfReviews =  vm.data.ratingCount;

                                /* NEW AVERAGE RATING ALGORITHM */
                                newRating = (((initRating * numOfReviews) + vm.form.rating) / (numOfReviews + 1));

                                // Update new rating & Add one to this merchant or item's rating count
                                var objRef = db.collection(`${vm.type}s`).doc(vm.id);
                                batch.update(objRef, { 
                                    rating: newRating,
                                    ratingCount: numOfReviews + 1 
                                });

                                // Add to merchant or item's reviews collection
                                batch.set(reviewsRef, {
                                    title: vm.form.title,
                                    date: FieldValue.serverTimestamp(),
                                    rating: vm.form.rating,
                                    description: vm.form.description,
                                    author: author
                                });

                                // Add to user's reviews contribution
                                var contributionReviewsRef = db.collection('users').doc(user.uid).collection('reviews').doc(reviewId);
                                
                                if(vm.type == 'merchant') {
                                    batch.set(contributionReviewsRef, {
                                        id: vm.id,
                                        name: vm.data.name,
                                        icon: vm.data.icon,
                                        type: 'merchant',
                                        location: vm.data.location,
                                        category: vm.data.category,
                                        description: vm.data.description,
                                        date: FieldValue.serverTimestamp(),
                                        rating: vm.form.rating,
                                        reviewText: vm.form.description
                                    });
                                }
                                else if(vm.type == 'item') {
                                    batch.set(contributionReviewsRef, {
                                        id: vm.id,
                                        name: vm.data.name,
                                        icon: vm.data.icon,
                                        type: 'item',
                                        price: vm.data.price,
                                        category: vm.data.category,
                                        description: vm.data.description,
                                        date: FieldValue.serverTimestamp(),
                                        rating: vm.form.rating,
                                        reviewText: vm.form.description
                                    });
                                }

                                batch.commit()
                                    .then(function() {
                                        // Success :)
                                        vm.success = true;

                                        // Enable submit button
                                        vm.form.sending = false;

                                        /* Reset All Data */
                                        vm.clearForm();
                                    })
                                    .catch(function(error) {
                                        vm.form.sending = false;

                                        // Handle error
                                        console.error(error.message);
                                        UIkit.notification({
                                            status: 'danger',
                                            message: 'Tidak Dapat Menambahkan Ulasan. Silahkan coba lagi atau hubungi Admin atas kendala ini', 
                                            pos: 'top-right'
                                        });
                                    });
                            });
                        }
                    })
                    .catch(function(error) {
                        vm.form.sending = false;

                        // Handle error
                        console.error("Error getting documents: ", error);
                        UIkit.notification({
                            status: 'danger',
                            message: 'Tidak Kendala. Silahkan coba lagi atau hubungi Admin', 
                            pos: 'top-right'
                        });
                    });   
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Tidak Dapat Menambahkan Ulasan. Anda harus Log In terlebih dahulu', 
                        pos: 'top-right'
                    });
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>