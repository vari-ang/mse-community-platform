<template>
    <div class="container">
         <div v-if="!isExists">
            <md-empty-state class="center"
                md-icon="shopping_basket"
                :md-label="`${(item.type == 'product' ? 'Barang' : 'Jasa')} Yang Anda Cari Tidak Ada`"
                :md-description="`Mungkin Anda salah menginputkan ID atau ${(item.type == 'product' ? 'Barang' : 'Jasa')} ini sudah dihapus :(`">
            </md-empty-state>
        </div>
        <div v-else>
            <!-- User is logged out -->
            <div v-if="!user.user.id" class="center">
                <app-log-in-alert></app-log-in-alert>
            </div>

            <!-- NON EDIT MODE -->
            <md-list v-if="!editMode"
                     class="md-triple-line" style="height: auto;">
                <!-- Item's Icon -->
                <div class="uk-child-width-1@s" uk-grid>
                    <div>
                        <div class="uk-height-medium uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle" style="background: #263238;">
                            <img :src="item.icon" class="icon" alt="Logo Produk">
                        </div>
                    </div>
                </div>

                
                <md-list-item style="margin-top: 1em;">
                    <div class="md-list-item-text icon">
                        <!-- Nama Item -->
                        <span class="md-headline">
                            {{ item.name }}
                            <md-tooltip md-direction="top">{{ item.name }}</md-tooltip>
                        </span>
                        <span v-if="item.type == 'product'"
                            class="md-caption">Barang</span>
                        <span v-else>Jasa</span>
                        <br>
                        
                        <!-- POWERED BY COMMUNITY -->
                        <app-community-chip></app-community-chip>
                    </div>

                    <!-- Action Button -->
                    <div>
                        <div class="action-btn">
                            <md-button class="md-icon-button"
                                :class="{'md-primary': bookmarked}"
                                @click="bookmark">
                                <md-icon>bookmark</md-icon>
                                <md-tooltip md-direction="top" v-if="!bookmarked">Simpan {{ item.type == 'product' ? 'Barang' : 'Jasa' }} Ini</md-tooltip>
                                <md-tooltip md-direction="top" v-else>Batalkan Penyimpanan {{ item.type == 'product' ? 'Barang' : 'Jasa' }} Ini</md-tooltip>
                            </md-button>
                            <md-menu md-direction="bottom-end">
                                <md-button class="md-icon-button" md-menu-trigger>
                                    <md-icon>share</md-icon>
                                    <md-tooltip md-direction="top">Sebarkan {{ item.type == 'product' ? 'Barang' : 'Jasa' }} Ini</md-tooltip>
                                </md-button>
                                <md-menu-content>
                                    <app-social-sharing type="item"
                                                        :data="item"
                                    ></app-social-sharing>
                                </md-menu-content>
                            </md-menu>
                        </div>
                    </div>
                </md-list-item>

                <!-- Horizontal Bar -->
                <div class="md-layout horizontal-bar">
                    <div class="md-layout-item center">
                        <p><span class="md-title">Kategori</span></p>
                        <p>{{ item.category }}</p>
                    </div>
                    <div class="md-layout-item center">
                        <p>
                            <span class="md-title">Harga</span><br>
                            <span class="md-body-1">(Rupiah)</span>
                        </p>
                        <p>{{ item.price | thousandsSeparator }}</p>
                    </div>
                    <div class="md-layout-item center">
                        <p><span class="md-title">Rating</span></p>
                        <p>
                            <span class="md-title">{{ item.rating }}</span> ({{ item.ratingCount }})
                        </p>
                    </div>
                </div>
            </md-list>

            <!-- EDIT MODE -->
            <md-list v-else-if="editMode"
                     class="md-triple-line" style="height: auto;">
                <!-- Item's Icon -->
                <!-- Use CSS Shake plugin -->
                <input id="img-upload-edit" type="file" accept="image/*" ref="files"
                        v-on:change="changeImage" /> 

                <!-- Item's Icon -->
                <div class="uk-child-width-1@s" uk-grid>
                    <div class="uk-height-medium uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle" style="background: #263238;">
                        <div class="shake shake-constant shake-constant--hover">
                            <md-avatar class="icon">
                                <img class="clickable-icon"
                                    alt="Logo Produk"
                                    v-bind:src="edit.icon"
                                    v-on:click="triggerImgUpload">
                            </md-avatar>
                        </div>
                    </div>
                </div>
                
                <md-list-item style="margin-top: 1.5em;">
                    <div class="md-list-item-text icon">
                        <!-- Nama Item -->
                        <md-field :class="getEditValidationClass('name')">
                            <label>Nama Barang atau Jasa</label>
                            <md-input maxlength="50" v-model="edit.name" :disabled="sendingEdit" />
                            <span class="md-error" v-if="!$v.edit.name.required">Nama barang atau jasa wajib diisi</span>
                        </md-field>
                        <br>
                        
                        <!-- POWERED BY COMMUNITY -->
                        <app-community-chip></app-community-chip>
                    </div>

                    <!-- Action Button -->
                    <div>
                        <div class="action-btn">
                            <md-button class="md-icon-button"
                                :class="{'md-primary': bookmarked}"
                                @click="bookmark">
                                <md-icon>bookmark</md-icon>
                                <md-tooltip md-direction="top" v-if="!bookmarked">Simpan {{ item.type == 'product' ? 'Barang' : 'Jasa' }} Ini</md-tooltip>
                                <md-tooltip md-direction="top" v-else>Batalkan Penyimpanan {{ item.type == 'product' ? 'Barang' : 'Jasa' }} Ini</md-tooltip>
                            </md-button>
                        </div>
                    </div>
                </md-list-item>

                <!-- Horizontal Bar -->
                <div class="md-layout horizontal-bar">
                    <div class="md-layout-item center">
                        <p><span class="md-title">Kategori</span></p>
                        <p>
                            <md-field :class="getEditValidationClass('type')">
                                <label>Jenis</label>
                                <md-select v-model="edit.type" placeholder="Jenis: barang atau jasa">
                                    <md-option value="product">Produk</md-option>
                                    <md-option value="service">Jasa</md-option>
                                </md-select>
                                <span class="md-error" v-if="!$v.edit.type.required">Jenis barang atau jasa wajib dipilih</span>
                            </md-field>

                            <md-field :class="getEditValidationClass('category')">
                                <label>Kategori</label>
                                <md-select v-if="edit.type == 'product'" 
                                            v-model="edit.category" 
                                            placeholder="Kategori">
                                    <md-option v-for="c in productCategories"
                                                :key=c.id
                                                :value="c.name">
                                            {{ c.name }}
                                    </md-option>
                                </md-select>
                                <md-select v-else-if="edit.type == 'service'" 
                                            v-model="edit.category" 
                                            placeholder="Kategori">
                                    <md-option v-for="c in serviceCategories"
                                                :key=c.id
                                                :value="c">
                                            {{ c }}
                                    </md-option>
                                </md-select>

                                <span class="md-error" v-if="!$v.edit.category.required">Kategori wajib dipilih</span>
                            </md-field>
                        </p>
                    </div>
                    <div class="md-layout-item center">
                        <p>
                            <span class="md-title">Harga</span><br>
                            <span class="md-body-1">(Rupiah)</span>
                        </p>
                        <p>
                            <md-field :class="getEditValidationClass('price')"
                                :md-counter="false">
                                <label>Harga*</label>
                                <span class="md-prefix">Rp.</span>
                                <md-input type="number"
                                        step="1000"
                                        maxlength="8"
                                        v-model="edit.price"></md-input>
                                <span class="md-error" v-if="!$v.edit.price.required">Harga wajib diisi</span>
                                <span class="md-error" v-if="!$v.edit.price.between">Harga harus bernilai antara seratus hingga seratus juta Rupiah</span>
                            </md-field>
                        </p>
                    </div>
                    <div class="md-layout-item center">
                        <p><span class="md-title">Rating</span></p>
                        <p>
                            <span class="md-title">{{ item.rating }}</span> ({{ item.ratingCount }})
                        </p>
                    </div>
                </div>
            </md-list>

            <!-- REPORT BUTTON -->
            <div class="center">
                <md-button class="md-accent report-btn center" style="text-transform: capitalize;"
                    @click="reportPopUp.active=true"
                    :disabled="!user.user.id">
                    Laporkan
                </md-button>
            </div>

            <!-- REPORT POP UP -->
            <app-report-pop-up :reportPopUp="reportPopUp"></app-report-pop-up>

            <md-tabs md-alignment="centered">
                <!-- Information -->
                <md-tab id="tab-info" md-icon="info">
                    <md-list>
                        <!-- Edit Suggestion Toolbar -->
                        <div v-show="item.editCount != 0" 
                             href="#modal-edit-suggestion-full" uk-toggle
                             class="md-elevation-5 edit-suggestion-box"
                             :class="{ 'disabled': !user.user.id }">
                            <span class="md-subheading center">
                                <md-icon>remove_red_eye</md-icon>
                                Lihat {{ item.editCount }} Sugesti Perubahan Informasi
                            </span>
                        </div>

                        <app-edit-suggestion :id="id"
                            :type="'item'"
                            :editCount="item.editCount"
                        ></app-edit-suggestion>

                        <!-- NON EDIT MODE -->
                        <md-card v-if="!editMode"
                                 class="md-card-example md-elevation-7">
                            <!-- Description -->
                            <md-card-area md-inset>
                                <md-card-header>
                                    <h2 class="md-title">Deskripsi</h2>
                                </md-card-header>

                                <md-card-content>
                                    <p class="justify">
                                        {{ item.description }}
                                    </p>
                                </md-card-content>
                            </md-card-area>

                            <md-card-area md-inset>
                                <md-card-content class="center">
                                    <p style="margin-top: 1em;">
                                        <span class="md-body-2">Barang atau jasa ini dimiliki oleh:</span>
                                        <br>
                                        <nuxt-link :to="`/merchant/${item.merchant.id}`" class="uk-link-reset">
                                            <span class="merchant-name"><b>{{ item.merchant.name }}</b></span>
                                        </nuxt-link>
                                    </p>
                                </md-card-content>
                            </md-card-area>

                            <!-- Edit Button -->
                            <md-card-actions class="center">
                                <md-button class="md-accent" style="margin: 0 auto; text-transform: capitalize;"
                                           @click="editMode = true"
                                           :disabled="!user.user.id">
                                    <md-icon>edit</md-icon>
                                    Ubah Informasi
                                </md-button>

                                <!-- Edit Success Message -->
                                <md-dialog-alert style="z-index: 99999999"
                                    :md-active.sync="editSuccess"
                                    :md-content="`<h3 style='text-align:center'>Berhasil Mengubah Informasi</h3> <br>
                                        <p style='text-align:center'>Perubahan informasi ini akan ditinjau oleh orang-orang sekomunitas.</p> 
                                        <p style='text-align:center'>Jika pengubahan informasi ini disetujui, maka Anda akan mendapatkan 5 poin</p>
                                        <p style='text-align:center'>Terimakasih atas kontribusi Anda!</p>`"
                                    md-confirm-text="OK!"
                                    @md-confirm="editSuccess = false" />
                            </md-card-actions>
                        </md-card>

                        <!-- EDIT MODE -->
                        <md-card v-else-if="editMode"
                                 class="md-card-example md-elevation-7">
                            <form novalidate class="md-layout" @submit.prevent="validateUserEdit" style="display: block; width: 100%;">
                                <!-- Description -->
                                <md-card-area md-inset>
                                    <md-card-header>
                                        <span class="md-title">Deskripsi</span>
                                    </md-card-header>

                                    <md-card-content>
                                        <md-field :class="getEditValidationClass('description')">
                                            <label>Deskripsi</label>
                                            <md-textarea maxlength="1000" style="resize:none;"
                                                v-model="edit.description" :disabled="sendingEdit"></md-textarea>
                                            <span class="md-error" v-if="!$v.edit.description.required">Deskripsi barang atau jasa wajib diisi</span>
                                            <span class="md-error" v-if="!$v.edit.description.minLength">Deskripsi minimal 20 kata</span>
                                        </md-field>
                                    </md-card-content>
                                </md-card-area>

                                <md-card-area md-inset>
                                    <md-card-content class="center">
                                        <p style="margin-top: 1em;">
                                            <span class="md-body-2">Barang atau jasa ini dimiliki oleh:</span>
                                            <br>
                                            <nuxt-link :to="`/merchant/${item.merchant.id}`" class="uk-link-reset">
                                                <span class="merchant-name"><b>{{ item.merchant.name }}</b></span>
                                            </nuxt-link>
                                        </p>
                                    </md-card-content>
                                </md-card-area>

                                <!-- Edit Button -->
                                <md-card-actions class="center">
                                    <md-button class="md-primary"
                                            type="submit"
                                            :disabled="sendingEdit || !user.user.id">
                                        <md-icon>check</md-icon>
                                        Simpan
                                    </md-button>
                                    <md-button class="md-accent"
                                            @click="editMode = false"
                                            :disabled="sendingEdit">
                                        <md-icon>close</md-icon>
                                        Batal
                                    </md-button>

                                    <md-progress-bar md-mode="indeterminate" v-if="sendingEdit" />
                                </md-card-actions>

                                <app-edit-alert style="margin-bottom: 1em;"></app-edit-alert>
                            </form>
                        </md-card>

                        <!-- Review -->
                        <span class="md-headline" style="margin-top: 1em;">Ulasan (Review)</span>

                        <!-- SCROLLABLE REVIEWS -->
                        <div v-if="reviewBox.reviews.length == 0">
                            <md-empty-state
                                md-icon="rate_review"
                                md-label=""
                                md-description="Belum Ada Ulasan Untuk Ditampilkan">
                            </md-empty-state>
                        </div>
                        <div v-else>
                            <app-review-box :reviewBox.sync="reviewBox"></app-review-box>

                            <!-- More reviews button -->
                            <div v-show="item.ratingCount > 5" class="center">
                                <md-button class="md-primary"
                                    style="text-decoration: none; text-transform: capitalize;"
                                    href="#modal-review-full" uk-toggle>
                                    Lihat lebih banyak Ulasan
                                </md-button>

                                <app-review-box-full-screen 
                                    :reviewBox.sync="reviewBox"
                                    v-on:load-more-reviews="loadMoreReviews"
                                ></app-review-box-full-screen>
                            </div>
                        </div>
                    
                        <!-- GIVE REVIEW BOX -->
                        <app-give-review-box 
                            :type="'item'"
                            :data.sync="item">
                        </app-give-review-box>

                        <!-- SIMILAR ITEM -->
                        <span class="md-headline" style="margin-top: 1em;">
                            {{ item.type == 'product' ? 'Barang' : 'Jasa' }} Serupa
                        </span>

                        <div v-if="carousel.similarItems.length == 0">
                            <md-empty-state
                                md-icon="shopping_basket"
                                md-label=""
                                :md-description="`Belum Ada ${item.type == 'product' ? 'Barang' : 'Jasa'} Sejenis`">
                            </md-empty-state>
                        </div>
                        <div v-else>
                            <app-carousel-horizontal :type="'item'"
                                :data="carousel.similarItems"
                            ></app-carousel-horizontal>
                        </div>

                        <!-- OTHER ITEMS BY THE SAME MERCHANT -->
                        <span class="md-headline">
                            Barang & Jasa Lainnya Dari {{ item.merchant.name }}
                        </span>
                        
                        <div v-if="carousel.otherItemsByTheSameMerchant.length == 0">
                            <md-empty-state
                                md-icon="shopping_basket"
                                md-label=""
                                :md-description="`Belum Ada ${item.type == 'product' ? 'Barang' : 'Jasa'} Sejenis dari ${item.merchant.name }`">
                            </md-empty-state>
                        </div>
                        <div v-else>
                            <app-carousel-horizontal :type="'item'"
                                :data="carousel.otherItemsByTheSameMerchant"
                            ></app-carousel-horizontal>
                        </div>

                        <div style="height: 50px;"></div>
                    </md-list>
                </md-tab>

                <!-- Images -->
                <md-tab id="tab-image" md-icon="image">
                    <md-list>
                        <app-image-tab
                            :id="id"
                            :type="'item'"
                        ></app-image-tab>
                    </md-list>
                </md-tab>
            </md-tabs>
        </div>

        <div style="height:125px;"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

var firebase = require('firebase')
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'
import thousandsSeparator from '~/plugins/mixins/thousandsSeparator'
import { validationMixin } from 'vuelidate'
import {
    required,
    between,
    minLength,
    maxLength,
} from 'vuelidate/lib/validators'

import AppLogInAlert from '@/components/alert/logIn'
import AppCommunityChip from '@/components/communityChip'
import AppEditAlert from '@/components/alert/edit'
import AppEditSuggestion from '@/components/editSuggestion'
import AppReportPopUp from '@/components/reportPopUp'
import AppReviewBox from '@/components/reviewBox'
import AppReviewBoxFullScreen from '@/components/reviewBoxFullScreen'
import AppGiveReviewBox from '@/components/giveReviewBox'
import AppCarouselHorizontal from '@/components/carousels/horizontal'
import AppSocialSharing from '@/components/socialSharing'
import AppImageTab from '@/components/imageTab'

var newIconFile = null; // To save current icon image

// Firestore --> Reviews query with cursor
var getReviewsQuery;
var lastReviewDoc;

export default {
    mixins: [thousandsSeparator, validationMixin],
    components: { 
        AppLogInAlert,
        AppCommunityChip,
        AppEditAlert,
        AppEditSuggestion,
        AppReportPopUp, 
        AppReviewBox, 
        AppReviewBoxFullScreen,
        AppGiveReviewBox,
        AppCarouselHorizontal,
        AppSocialSharing,
        AppImageTab
    },
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        var vm = this;

        // Get all information for this merchant from Firestore 
        db.collection('items').doc(vm.id).get().then(function(doc) {
            if(doc.exists) {
                // Set item data
                vm.item = doc.data(); 
                vm.item.description = _.startCase(_.toLower(vm.item.description)); // Capitalize each word in description
                vm.item.rating = _.round(vm.item.rating, 1); // Round rating to one decimal place

                // Clone item data to edit object
                vm.edit = {
                    icon: vm.item.icon,
                    name: vm.item.name,
                    type: vm.item.type,
                    category: vm.item.category,
                    price: vm.item.price,
                    description: vm.item.description
                }

                // Set to empty arrray
                vm.reviews = [];
                vm.carousel.otherItemsByTheSameMerchant = [];
                vm.carousel.similarItems = [];

                // Check whether the user has bookmarked this item
                // Only check if the user is signed in
                if(vm.user.user.id) {
                    db.collection('users').doc(vm.user.user.id).collection('bookmarks')
                        .where('id', '==', vm.id)
                        .limit(1)
                        .get()
                        .then(function(querySnapshot) {
                            if (!querySnapshot.empty) {
                                // Show bookmarked color
                                vm.bookmarked = true;
                            }
                        })
                        .catch(function(error) {
                            vm.bookmarked = false;

                            // Alert error message
                            console.error(error.message);
                            UIkit.notification({
                                status: 'danger',
                                message: 'Terjadi Kendala Menampilkan Daftar Tersimpan. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                pos: 'top-right'
                            });
                        });
                }

                // Set reviews query for cursor purpose
                getReviewsQuery = db.collection('items').doc(vm.id).collection('reviews')
                    .orderBy('date', 'desc')
                    .limit(5);

                // Get reviews sub collection
                getReviewsQuery.get()
                    .then(function(documentSnapshots) {
                        // Get last review document
                        lastReviewDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        documentSnapshots.forEach(function(doc) {
                            // Set to item's reviews data
                            vm.reviewBox.reviews.push(doc.data());
                        });
                    }, 
                    function(error) {
                        // Alert error message
                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: 'Terjadi Kendala Menampilkan Ulasan. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                            pos: 'top-right'
                        });
                    });

                // Get other items with the same category
                db.collection('items')
                    .where('category', '==', vm.item.category)
                    .limit(6) // 5 + (1) <-- In case the doc returned include this merchant 
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            var data = doc.data();
                                data.id = doc.id;
                            
                            // Only push data whose ID not the same with this item
                            // And limit to 5 results only
                            if(doc.id != vm.id && vm.carousel.similarItems.length < 5) { 
                                vm.carousel.similarItems.push(data); 
                            }  
                        });
                    })
                    .catch(function(error) {
                        // Alert error message
                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: `Tidak Dapat Menampilkan Rekomendasi ${(vm.item.type == 'product' ? 'Barang' : 'Jasa')} Sejenis. Silahkan coba lagi atau hubungi Admin atas masalah ini`, 
                            pos: 'top-right'
                        });
                    });
                
                // Get other items from this merchant
                db.collection('items')
                    .where('merchant.id', '==', vm.item.merchant.id)
                    .limit(6) // 5 + (1) <-- In case the doc returned include this merchant 
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            var data = doc.data();
                                data.id = doc.id;
                            
                            // Only push data whose ID not the same with this item
                            // And limit to 5 results only
                            if(doc.id != vm.id && vm.carousel.otherItemsByTheSameMerchant.length < 5) { 
                                vm.carousel.otherItemsByTheSameMerchant.push(data); 
                            }  
                        });
                    })
                    .catch(function(error) {
                        // Alert error message
                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: `Tidak Dapat Menampilkan ${(vm.item.type == 'product' ? 'Barang' : 'Jasa')} Lainnya. Silahkan coba lagi atau hubungi Admin atas masalah ini`, 
                            pos: 'top-right'
                        });
                    });
            }
            else {
                // Alert requested merchant is not exists
                vm.isExists = false;
            }
        })
        .catch(function(error) {
            // Alert error message
            console.error(error.message);
            UIkit.notification({
                status: 'danger',
                message: `Tidak Dapat Menampilkan Informasi ${(vm.item.type == 'product' ? 'Barang' : 'Jasa')}`, 
                pos: 'top-right'
            });
        });
    },
    data() {
        return {
            newPosts: 4,
            id: this.$route.params.id,
            images: null,

            isExists: true, // FLag variable to check if merchant is exists in firestore
            bookmarked: false,

            /* REPORT POPUP */
            reportPopUp: {
                active: false,
                color: '#ef5350',
                select: [],
                options:[
                    {text:'Barang atau jasa ini tidak ada', value:0},
                    {text:'Materi (konten) bersifat ilegal', value:1},
                    {text:'Melanggar hak cipta', value:2},
                    {text:'Kata-kata tidak pantas', value:3},
                    {text:'Gambar tidak sesuai', value:4},
                    {text:'Lainnya',value:5},
                ],
                note: '',
                showSpinner: false,
                disabled: false
            },

            carousel: {
                /* Other Items By The Same Merchant */
                otherItemsByTheSameMerchant:    
                [ 
                    {
                        id: 'otherItemsByTheSameMerchant1',
                        icon: 'https://i.gifer.com/8p7m.gif',
                        name: 'Loading ...',
                        category: 'Loading ...',
                        price: '0'
                    },
                    {
                        id: 'otherItemsByTheSameMerchant2',
                        icon: 'https://i.gifer.com/8p7m.gif',
                        name: 'Loading ...',
                        category: 'Loading ...',
                        price: '0'
                    },
                    {
                        id: 'otherItemsByTheSameMerchant3',
                        icon: 'https://i.gifer.com/8p7m.gif',
                        name: 'Loading ...',
                        category: 'Loading ...',
                        price: '0'
                    }
                ],

                /* Similar Items */
                similarItems:    
                [ 
                    {
                        id: 'similarItems1',
                        icon: 'https://i.gifer.com/8p7m.gif',
                        name: 'Loading ...',
                        category: 'Loading ...',
                        price: '0'
                    },
                    {
                        id: 'similarItems2',
                        icon: 'https://i.gifer.com/8p7m.gif',
                        name: 'Loading ...',
                        category: 'Loading ...',
                        price: '0'
                    },
                    {
                        id: 'similarItems3',
                        icon: 'https://i.gifer.com/8p7m.gif',
                        name: 'Loading ...',
                        category: 'Loading ...',
                        price: '0'
                    }
                ]
            },
            
            /* Data from server */
            item: {
                icon: 'https://i.gifer.com/8p7m.gif',
                name: 'Loading ...',
                type: 'product',
                merchant: {
                    id: '',
                    name: 'Loading ...'
                },
                category: 'Loading ...',
                price: 'Loading ...',
                rating: 5,
                ratingCount: 0,
                editCount: 0,
                description: 'Loading ...',
            },

            /* EDIT INFO */
            edit: {},
            editMode: false,
            sendingEdit: false,
            showEditSuggestion: false,
            editSuccess: false,

            /* REVIEWS */
            reviewBox: {
                showMoreReviewsButton: true,
                showSpinnerMoreReviews: false,
                reviews: []
            },
        }
    },
    validations: {
      edit: {
        name: {
          required,
          maxLength: maxLength(50)
        },
        type: {
          required
        },
        category: {
          required
        },
        price: {
            required,
            between: between(100, 100000000)
        },
        description: {
            required,
            minLength: minLength(20),
            maxLength: maxLength(1000)
        }
      }
    },
    methods: {
        bookmark() {
            var vm = this;
            
            auth.onAuthStateChanged(function(user) {
                if(user) {
                    var userRef = db.collection('users').doc(user.uid);
                    var bookmarkRef = db.collection('users').doc(user.uid).collection('bookmarks').doc(vm.id);
                    var newTotalBookmarks = 0; // user's new total bookmarks will be added by 1
                    var FieldValue = firebase.firestore.FieldValue; // to access server timestamp

                    var batch = db.batch();

                    userRef.get().then(function(doc) {
                        if (doc.exists) {
                            // User has already bookmarked
                            if(vm.bookmarked) {
                                // Remove from bookmarks collection
                                vm.bookmarked = false;

                                newTotalBookmarks = doc.data().total_bookmarks - 1; 
                                batch.update(userRef, { total_bookmarks: newTotalBookmarks });

                                batch.delete(bookmarkRef);
                            }
                            else {
                                // Add to bookmarks collection
                                vm.bookmarked = true;

                                if(doc.data().total_bookmarks != undefined) newTotalBookmarks = doc.data().total_bookmarks + 1; 
                                
                                // Add 1 to user's total bookmarks
                                if(newTotalBookmarks == 0) {
                                    batch.update(userRef, { total_bookmarks: 1 });
                                }
                                else {
                                    batch.update(userRef, { total_bookmarks: newTotalBookmarks });
                                }

                                batch.set(bookmarkRef, {
                                    type: 'item',
                                    id: vm.id,
                                    date: FieldValue.serverTimestamp()
                                });
                            }
                        }
                        // First bookmarks for this user
                        else {
                            vm.bookmarked = true;
                            
                            batch.set(userRef, { total_bookmarks: 1 });
                            batch.set(bookmarkRef, {
                                type: 'merchant',
                                id: vm.id,
                                date: FieldValue.serverTimestamp()
                            });
                        }

                        // COMMIT THE BATCH
                        batch.commit().catch(function(error) {
                            console.error(error);
                            UIkit.notification({
                                status: 'danger',
                                message: 'Tidak Dapat Menyimpan atau Menghapus Merchant. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                pos: 'top-right'
                            });
                        });
                    });
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: `Tidak Dapat Menyimpan ${(vm.item.type == 'product' ? 'Barang' : 'Jasa')}. Anda harus Log In terlebih dahulu untuk menyimpan ${(vm.item.type == 'product' ? 'barang' : 'jasa')} ini`, 
                        pos: 'top-right'
                    });
                }
            });
        },

        loadMoreReviews() {
            var vm = this;

            vm.reviewBox.showSpinnerMoreReviews = true;

            getReviewsQuery
                .startAfter(lastReviewDoc)
                .get()
                .then(function(documentSnapshots) {
                    // Get last review document
                    lastReviewDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                    documentSnapshots.forEach(function(doc) {
                        // Set to item's reviews data
                        vm.reviewBox.reviews.push(doc.data());
                    });

                    // Hide button if the reviews is more than 35 OR 
                    // the are no more reviews to be shown
                    if(vm.reviewBox.reviews.length > 35 || vm.reviewBox.reviews.length == vm.item.ratingCount) { 
                        vm.reviewBox.showMoreReviewsButton = false;
                    }

                    vm.reviewBox.showSpinnerMoreReviews = false;
                }, 
                function(error) {
                    // Alert error message
                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Tidak Dapat Menampilkan Ulasan. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });
                });  
        },

        /* EDIT */
        getEditValidationClass(fieldName) {
            const field = this.$v.edit[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },

        clearEditForm() {
            var vm = this;

            this.$v.$reset();            
            vm.edit = {
                icon: vm.item.icon,
                name: vm.item.name,
                type: vm.item.type,
                category: vm.item.category,
                price: vm.item.price,
                description: vm.item.description
            }

            $('.clickable-icon').attr('src', vm.item.icon);
            newIconFile = null;
        },

        validateUserEdit () {
            this.$v.$touch()

            if (!this.$v.$invalid) {
                this.editItem()
            }
        },

        triggerImgUpload() {
            var vm = this;

            // Trigger hidden file input
            $('#img-upload-edit').trigger('click');
        },
        changeImage(e) {
            var vm = this;
            var img = $('.clickable-icon');

            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                UIkit.notification({
                    status: 'danger',
                    message: 'Browser Anda tidak mendukung fitur pemilihan file. Mohon gunakan browser modern seperti Chrome, Firefox, dan Safari', 
                    pos: 'top-right'
                });
                return;
            }
            
            var file  = e.target.files[0];
            var reader = new FileReader();

            if (file && file.type.match('image.*')) {
                reader.readAsDataURL(file);

                // Set user's selected icon image 
                newIconFile = vm.$refs.files.files[0];
            }
            
            reader.onloadend = function (e) {
                img.attr('src', reader.result);
                img.css('display', 'block');
            }
        },

        editItem() {
            var vm = this;
            vm.sendingEdit = true;

            auth.onAuthStateChanged(function(user) {
                if(user) {
                    // Only proceed if the user saved some changes
                    if(newIconFile ||
                       vm.edit.name != vm.item.name || 
                       vm.edit.category != vm.item.category ||
                       vm.edit.description != vm.item.description ||
                       vm.edit.price != vm.item.price) {

                        // Proceed
                        // Replace any unwanted characters
                        vm.edit.name = _.replace(vm.edit.name, '-', '');
                        vm.edit.price = _.replace(vm.edit.price, /[^\w\s]/gi, '');

                        /* UPLOAD IMAGE TO FIREBASE STORAGE */

                        // If the user did not change the icon
                        if(!newIconFile) {
                            vm.uploadToFirestore();
                        }
                        else {
                            // Reduce file (image) size
                            const width = 300;
                            const height = 300;
                            const fileName = _.uniqueId(newIconFile.name + '_' + Date.now() + '_');
                            const reader = new FileReader();
                            const imgResized = new Image();

                            reader.readAsDataURL(newIconFile);
                            reader.onload = event => {
                                imgResized.src = event.target.result;
                                imgResized.onload = () => {
                                        const elem = document.createElement('canvas');
                                        elem.width = width;
                                        elem.height = height;
                                        const ctx = elem.getContext('2d');

                                        // img.width and img.height will give the original dimensions
                                        ctx.drawImage(imgResized, 0, 0, width, height);

                                        const data = ctx.canvas.toDataURL(imgResized, 'image/jpeg', 1);
                                        ctx.canvas.toBlob((blob) => {
                                            const file = new File([blob], fileName, {
                                                type: 'image/jpeg',
                                                lastModified: Date.now()
                                            });

                                            /* UPLOAD IMAGE TO FIREBASE STORAGE */

                                            // Handle waiting to upload each file using promise
                                            return new Promise(function (resolve, reject) {
                                                var storageRef = storage.ref();

                                                // Place the file inside 'images/merchant/[ID]/edits' 
                                                var dir = storageRef.child(`items/${vm.id}/edits/${file.name}`);
                                                var task = dir.put(file);

                                                //Update progress bar
                                                task.on('state_changed',
                                                    function progress(snapshot){
                                                        // Observe state change events such as progress, pause, and resume
                                                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                                        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                                        console.log('Upload is ' + percentage + '% done');

                                                        switch (snapshot.state) {
                                                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                                                console.log('Upload is paused');
                                                                break;
                                                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                                                console.log('Upload is running');
                                                                break;
                                                        }
                                                    },
                                                    function error(err) {
                                                        // Handle unsuccessful uploads
                                                        // Output error
                                                        console.error(err.message);
                                                        UIkit.notification({
                                                            status: 'danger',
                                                            message: 'Gagal Menambahkan Gambar ke Database. Silahkan mencoba kembali atau hubungi Admin atas masalah ini', 
                                                            pos: 'top-right'
                                                        });

                                                        vm.sendingEdit = false;
                                                    },
                                                    function complete() {
                                                        /* Successfully uploaded image to storage */
                                                        var downloadURL = task.snapshot.downloadURL;

                                                        task.snapshot.ref.getDownloadURL()
                                                            .then(function(downloadURL) {
                                                                vm.edit.icon = downloadURL;

                                                                /* Upload data to Firestore */
                                                                vm.uploadToFirestore();

                                                                // Update Metadata
                                                                var myCustomMetadata = {
                                                                    customMetadata : {
                                                                        "Author's UID": user.uid
                                                                    }
                                                                }
    
                                                                dir.updateMetadata(myCustomMetadata)
                                                                    .then(function(metadata) {
                                                                        console.log('Successfully adding custom metadata: ' + metadata);
                                                                    })
                                                                    .catch(function(err) {
                                                                        console.error(err.message);
                                                                    });
                                                            })
                                                            .catch(function(error) {
                                                                // Handle unsuccessful uploads
                                                                // Output error
                                                                console.error(err.message);

                                                                UIkit.notification({
                                                                    status: 'danger',
                                                                    message: 'Gagal Menambahkan Gambar ke Database. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                                                                    pos: 'top-right'
                                                                });

                                                                vm.sendingEdit = false;
                                                            });
                                                    });
                                            });

                                        }, 'image/jpeg', 1);
                                    },
                                reader.onerror = error => console.log(error);
                            }
                        }
                    }
                    else {
                        UIkit.notification({
                            status: 'danger',
                            message: 'Anda tidak melakukan perubahan informasi sama sekali', 
                            pos: 'top-right'
                        });

                        vm.sendingEdit = false;
                    }
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Anda harus Log In terlebih dahulu untuk merubah informasi', 
                        pos: 'top-right'
                    });

                    vm.sendingEdit = false;
                }
            });
        },
        uploadToFirestore() {
            var vm = this;
            var FieldValue = firebase.firestore.FieldValue; // to access server timestamp
            var editCount = vm.item.editCount;

            /* ADD DATA TO FIRESTORE */
            
            // Declare batch
            var batch = db.batch();

            // Loop through edit object to seek for edit changes
            // One change = One edit doc
            for (var key in vm.edit) {
                if(key != 'type' && !_.isEqual(vm.edit[key], vm.item[key])) {
                    // Plus one to item's editCount
                    editCount++;

                    var itemRef = db.collection('items').doc(vm.id);
                    batch.update(itemRef, { editCount: editCount });

                    // Store a reference to the item that will be sent
                    var editRef = db.collection('items').doc(vm.id).collection('edits').doc(),    
                        editId = editRef.id;
                    
                    // Add to item's edits collection
                    batch.set(editRef, {
                        id: editId,
                        editor: {
                            id: vm.user.user.id,
                            email: vm.user.user.email
                        },
                        date: FieldValue.serverTimestamp(),
                        approved: 0,
                        denied: 0,
                        infoChanged: key,
                        value: vm.edit[key],
                        contributors: []
                    });

                    // Add edit suggestion to user contribution edtis collection
                    var contributionEditsRef = db.collection('users').doc(vm.user.user.id).collection('edits').doc(editId);
                    batch.set(contributionEditsRef, {
                        // Item's info
                        id: vm.id,
                        icon: vm.item.icon,
                        name: vm.item.name,
                        description: vm.item.description,
                        type: 'item',
                        date: FieldValue.serverTimestamp(),
                        infoChanged: key,
                        value: vm.edit[key],
                        status: {
                            approved: false,
                            denied: false,
                            waiting: true
                        }
                    });
                }
            }

            batch.commit()
                .then(function() {
                    // Success :)
                    vm.editSuccess = true;

                    // Enable submit button
                    vm.sendingEdit = false;

                    /* Reset All Data */
                    vm.clearEditForm();
                    vm.editMode = false;
                })
                .catch(function(error) {
                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Mengubah Informasi. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });

                    vm.sendingEdit = false;
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    .icon {
        width: 100%;
        max-width: 375px;
        min-height: 150px;
        max-height: 225px;
        margin: 0 auto;
        border-radius: 1em;
    }

    .horizontal-bar { margin-top: -1.5em; }

    .edit-suggestion-box {
        padding: 1em; 
        border-radius: 1em; 
        background: #1e88e5; 
        margin-bottom: 1em; 
        cursor: pointer
    }

    .merchant-name { color: #9e9e9e; }

    // Input for image file
    #img-upload-edit { display: none; }

    img.clickable-icon { cursor: pointer; }

    .report-btn { margin-left: auto; margin-right: 0; }

    // Review Box
    .review-container {
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        margin-top: 1em;

        .review-box {
            white-space:normal;
            width: 350px;
            display: inline-block;
            word-wrap: break-word;
            margin-right: 25px;
            vertical-align: top;
        }
    }
</style>