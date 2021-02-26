<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="validateUser" autocomplete="off">
            <!-- User is logged out -->
            <div v-if="!user.user.id" class="center">
                <app-log-in-alert></app-log-in-alert>
            </div>

            <md-card class="md-layout-item md-size-75 md-small-size-100 card md-elevation-0">
                <md-card-header>
                    <div class="md-title center">Tambah Merchant Baru</div>
                </md-card-header>

                <input id="img-upload" type="file" accept="image/*" ref="files"
                    v-on:change="changeImage" /> 

                <!-- Default Image Icon -->
                <div class="center icon">
                    <img class="clickable-icon"
                        alt="Merchant's Logo"
                        v-bind:src="merchant.icon"
                        v-on:click="triggerImgUpload">
                </div>

                <p class="center">
                    <span class="md-caption">Klik gambar di atas untuk mengganti logo</span>
                </p>                
                
                <md-card-content>
                    <md-field :class="getValidationClass('name')">
                        <md-icon>business_center</md-icon>
                        <label>Nama Pedagang (Merchant)</label>
                        <md-input maxlength="50" v-model="merchant.name" :disabled="sending" />
                        <span class="md-error" v-if="!$v.merchant.name.required">Nama wajib diisi</span>
                    </md-field>

                    <md-field :class="getValidationClass('category')">
                        <label>Kategori</label>
                        <md-select v-model="merchant.category" placeholder="Kategori">
                            <md-option v-for="c in merchantCategories"
                                        :key=c.id
                                        :value="c.name">
                                {{ c.name }}
                            </md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.merchant.category.required">Kategori wajib dipilih</span>
                    </md-field>

                    <!-- Location -->
                    <md-content class="md-elevation-6 location-box">
                        <span class="md-title"><md-icon>place</md-icon>Lokasi</span>

                        <!-- MAPS (using Leaflet) -->
                        <div>
                            <div id="map-wrap">
                                <no-ssr>
                                    <l-map ref="map" :zoom.sync="map.zoom" :center="map.centerPoint" :options="{zoomControl: false}">
                                        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
                                        <l-marker :lat-lng="map.centerPoint"></l-marker>
                                    </l-map>
                                </no-ssr>
                            </div>
                        </div>

                        <div :class="getValidationClass('address')" v-if="user.user.id"> 
                            <md-autocomplete v-model="merchant.location.address" :disabled="sending"
                                :md-options="placeSearchResults"
                                @md-changed="searchPlace">
                                <label>Alamat</label>

                                <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item }}</template>
                            </md-autocomplete>
                        </div>

                         <md-field v-if="!user.user.id">
                            <label>Alamat</label>
                            <md-input disabled></md-input>
                        </md-field>

                        <md-field>
                            <label>Keterangan atau Note (Opsional)</label>
                            <md-input maxlength="50" v-model="merchant.location.note" :disabled="sending" />
                        </md-field>
                    </md-content>

                    <md-field :class="getValidationClass('description')">
                        <label>Deskripsi Merchant (Pedagang)</label>
                        <md-textarea maxlength="1000" style="resize:none;"
                            v-model="merchant.description" :disabled="sending"></md-textarea>
                        <span class="md-error" v-if="!$v.merchant.description.required">Isikan deskripsi secara singkat saja tidak masalah</span>
                        <span class="md-error" v-if="!$v.merchant.description.minLength">Deskripsi minimal 20 kata</span>
                        <span class="md-error" v-if="!$v.merchant.description.maxLength">Deskripsi maksimal 1000 kata</span>
                    </md-field>

                    <md-field :class="getValidationClass('phoneNumber')">
                        <md-icon>phone</md-icon>
                        <label>Nomor Telepon</label>
                        <md-input v-model="merchant.phoneNumber" :disabled="sending" />
                        <span class="md-error" v-if="!$v.merchant.phoneNumber.maxLength">Digit nomor telepon terlalu panjang</span>
                        <span class="md-error" v-if="!$v.merchant.phoneNumber.numeric">Nomor telepon hanya boleh terdiri dari angka (tanpa spasi dan karakter khusus lainnya)</span>
                    </md-field>

                    <!-- Operating Hours -->
                    <h2>Jam Operasional</h2>
                    <span class="md-caption justify" style="display:block; margin-top: 0.5em;">
                        Jika merchant libur atau Anda tidak mengetahui jam operasional merchant pada suatu hari, biarkan saja
                    </span>

                    <div v-if="showLoadingComponents"
                            class="center"
                            style="width: 33%">
                        <md-progress-spinner :md-diameter="75" 
                                                :md-stroke="10" 
                                                md-mode="indeterminate"
                        ></md-progress-spinner>
                    </div>
                    <div v-else class="md-layout md-gutter md-alignment-center" style="margin-top: 1em;">
                        <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-100">
                            <md-field>
                                <label for="day">Hari</label>
                                <md-select name="day" v-model="selectedDayIx">
                                    <md-option v-for="(day, ix) in merchant.operatingHours"
                                            :key=day.id
                                            :value="ix">
                                        {{ day.day }}
                                    </md-option>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-100">
                            <md-field>
                                <label for="starTime">Jam Buka</label>
                                <md-select name="starTime" v-model="merchant.operatingHours[selectedDayIx].startTime">
                                    <md-option v-for="time in times"
                                            :selected="time"
                                            :key=time.id
                                            :value="time">
                                        {{ time }}
                                    </md-option>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-100">
                            <md-field>
                                <label for="endTime">Jam Tutup</label>
                                <md-select name="endTime" v-model="merchant.operatingHours[selectedDayIx].endTime">
                                    <md-option v-for="time in times"
                                            :key=time.id
                                            :value="time">
                                        {{ time }}
                                    </md-option>
                                </md-select>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>

                <md-card-actions class="center">
                    <md-button type="submit" class="md-primary md-raised" style="border-radius: 1em; margin: 0 auto; text-transform: capitalize"
                            :disabled="sending || !user.user.id">
                        <md-icon>add</md-icon>
                        Tambah
                    </md-button>

                    <!-- Add Success Message -->
                    <md-dialog-alert style="z-index: 99999999"
                        :md-active.sync="success"
                        :md-content="`<h3 style='text-align:center'>Berhasil Menambahkan Pedagang (Merchant) Baru</h3> <br>
                            <p style='text-align:center'>Terimakasih atas kontribusi Anda untuk memajukan Usaha Mikro dan Kecil (UMK) di Indonesia! <br><br>Anda telah mendapatkan tambahan 10 poin</p>`"
                        md-confirm-text="OK!" />

                    <md-progress-bar md-mode="indeterminate" v-if="sending" />
                </md-card-actions>

                <app-add-alert v-if="user.user.id"></app-add-alert>

                <div class="center">
                    <div class="uk-alert-primary" uk-alert style="border-radius: 1em; padding: 0.5em">
                        <a class="uk-alert-close" uk-close></a>
                        <p class="center">
                            Jika Anda ingin menambahkan barang atau jasa, 
                            maka buka halaman merchant pemilik barang atau jasa tersebut. Kemudian pilih <md-icon style="color: #2196f3">shopping_basket</md-icon>, 
                            lalu tekan tombol lingkaran <md-icon style="color: #2196f3">add_circle</md-icon>
                        </p>
                    </div>
                </div>

                <div style="height: 25px;"></div>
            </md-card>
        </form>
        
        <div style="height: 125px;"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

var firebase = require('firebase');
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'
import { geo } from '~/plugins/fireinit.js'
import merchantCategories from '~/plugins/mixins/merchant/categories'
import times from '~/plugins/mixins/merchant/times'
import { validationMixin } from 'vuelidate'
import {
    required,
    numeric,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'

import AppLogInAlert from '@/components/alert/logIn'
import AppAddAlert from '@/components/alert/add'

var newIconFile = null; // To save current icon image

export default {
    mixins: [merchantCategories, times, validationMixin],
    components: { AppLogInAlert, AppAddAlert },
    computed: {
        ...mapState(['user'])
    },
    created() {
        var vm = this;
        setTimeout(function() { vm.showLoadingComponents = false }, 150);
    },
    data() {
        return {
            sending: false,
            success: false,
            showLoadingComponents: true,
            selectedDayIx: 0, // to track what index the user selects the operating hours

             /* Data to be sent to server */
            merchant: {
                id: '',
                icon: 'https://image.flaticon.com/icons/svg/1026/1026885.svg',
                name: '',
                category: '',
                rating: 0,
                ratingCount: 0,
                editCount: 0,
                community: true,
                description: '',
                location: {
                    address: '',
                    note: ''
                },
                position: null, // Will be written by GeoFireX
                phoneNumber: '',
                operatingHours:
                [
                    {
                        day: 'Senin',
                        startTime: '',
                        endTime: '',
                    },
                    {
                        day: 'Selasa',
                        startTime: '',
                        endTime: '',
                    },
                    {
                        day: 'Rabu',
                        startTime: '',
                        endTime: '',
                    },
                    {
                        day: 'Kamis',
                        startTime: '',
                        endTime: '',
                    },
                    {
                        day: 'Jumat',
                        startTime: '',
                        endTime: '',
                    },
                    {
                        day: 'Sabtu',
                        startTime: '',
                        endTime: '',
                    },
                    {
                        day: 'Minggu',
                        startTime: '',
                        endTime: '',
                    },
                ],
                author: {
                    id: '',
                    email: ''
                }
            },

            map: {
                zoom: 12,
                centerPoint: [-7.251821, 112.751913], // Center point for Leaflet (Latitude, Longitude)
                markerPoint: [0, 0], // OL Marker (Longitude, Latitude)
                rotation: 0,
                geolocPosition: undefined,
            },

            locationSearch: '',
            placeSearchResults: []
        }
    },
    validations: {
      merchant: {
        name: {
          required,
          maxLength: maxLength(50)
        },
        category: {
          required
        },
        location: {
            address: {
                required
            }
        },
        description: {
            required,
            minLength: minLength(20),
            maxLength: maxLength(1000)
        },
        phoneNumber: {
            maxLength: maxLength(16),
            numeric
        }
      }
    },
    methods: {
        searchPlace() {
            var vm = this;

            // const proxyurl = "https://cors-anywhere.herokuapp.com/";
            var gmapApi = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=AIzaSyBugxrEreELjfqQdq4om2ZqJdaecfqWyxA&types=address&language=id&input=${vm.merchant.address}`;
            $.ajax({
                url: gmapApi, 
                type: "GET",
                 headers: {
                    'Access-Control-Allow-Credentials' : true,
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'GET',
                    'Access-Control-Allow-Headers':'application/json',
                },
                // dataType: 'jsonp',
                responseType:'application/json',
                cache: false,
                success: function(response){                          
                    alert(response);                   
                }           
            });    

            // fetch(proxyurl + gmapApi) // https://cors-anywhere.herokuapp.com/https://example.com
            //     .then(response => response.json())
            //     .then(contents => console.log(contents))
            //     .catch(() => console.log("Can’t access response. Blocked by browser?"))

            // return vm.$axios.get(gmapApi, { 
            //                     headers: {
            //                         'Access-Control-Allow-Origin': '*',
            //                     },
            //                     proxy: {
            //                     host: '104.236.174.88',
            //                     port: 3128
            //                     }
            //                 })
            //                 .then(response => {
            //                     // Populate autocomplete data (autocomplete results)
            //                     // resolve(response.data.hits.hits);

            //                     console.log(response);
            //                 })
            //                 .catch(error => {
            //                     console.error(error);
            //                 });

            // https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=AIzaSyBugxrEreELjfqQdq4om2ZqJdaecfqWyxA&types=address&language=id&input=rungkut
            // https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=geometry&key=AIzaSyBugxrEreELjfqQdq4om2ZqJdaecfqWyxA
        },
        getValidationClass (fieldName) {
            const field = (fieldName === 'address') ? 
                this.$v.merchant.location.address : 
                this.$v.merchant[fieldName];

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        clearForm () {
            this.$v.$reset();
            
            this.merchant = {
                id: '',
                icon: 'https://image.flaticon.com/icons/svg/1026/1026885.svg',
                name: '',
                category: '',
                rating: 0,
                ratingCount: 0,
                editCount: 0,
                community: true,
                description: '',
                location: {
                    geohash: '',
                    geopoint: '',
                    address: '',
                    note: ''
                },
                phoneNumber: '',
                operatingHours:
                [
                    {
                        day: 'Senin',
                        startTime: "",
                        endTime: ""
                    },
                    {
                        day: 'Selasa',
                        startTime: "",
                        endTime: ""
                    },
                    {
                        day: 'Rabu',
                        startTime: "",
                        endTime: ""
                    },
                    {
                        day: 'Kamis',
                        startTime: "",
                        endTime: ""
                    },
                    {
                        day: 'Jumat',
                        startTime: "",
                        endTime: ""
                    },
                    {
                        day: 'Sabtu',
                        startTime: "",
                        endTime: ""
                    },
                    {
                        day: 'Minggu',
                        startTime: "",
                        endTime: ""
                    },
                ],
                author: {
                    id: '',
                    email: ''
                }
            }

            this.map = {
                zoom: 12,
                centerPoint: [112.751913, -7.251821], // Center point for OL Marker (Longitude, Latitude)
                markerPoint: [0, 0], // OL Marker (Longitude, Latitude)
                rotation: 0,
                geolocPosition: undefined,
            }

            $('.clickable-icon').attr('src', 'https://image.flaticon.com/icons/svg/1026/1026885.svg');
            newIconFile = null;
        },
        validateUser () {
            this.$v.$touch()

            if (!this.$v.$invalid) {
                this.add()
            }
        },
        triggerImgUpload() {
            var vm = this;

            // Trigger hidden file input
            $('#img-upload').trigger('click');
        },
        changeImage(e) {
            var vm = this;
            var img = $('.clickable-icon');

            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                UIkit.notification({
                    status: 'danger',
                    message: 'Browser Anda tidak mendukung fitur pemilihan file. Silahkan gunakan modern browser seperti Chrome, Firefox, dan Safari', 
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
        // receives a place object via the autocomplete component
        setPlace(place) {
            var vm = this;

            if(place) {
                var lat = place.geometry.location.lat(),
                    lng = place.geometry.location.lng();
                vm.merchant.position = geo.point(lat, lng);

                var addressCompsArr = [];
                // Get every address component
                _.forEach(place.address_components, function(comp) {
                    // Add to address
                    addressCompsArr.push(comp.short_name);
                });

                vm.merchant.location.address = _.join(addressCompsArr, ', ');  
                vm.geolocate(lat, lng);
            }
        },
        // Reposition map & marker
        geolocate(lat, lng) {
            var vm = this;

            vm.map.centerPoint = [lng, lat];
            vm.map.markerPoint = [lng, lat];
            vm.map.zoom = 18;
        },
        add() {
            var vm = this;
            vm.sending = true;

            auth.onAuthStateChanged(function(user) {
                if(user) {
                    // If user doesn't set pin location
                    if(!vm.merchant.position.geohash) {
                        UIkit.notification({
                            status: 'danger',
                            message: 'Mohon pilih lokasi alamat paling cocok untuk pedagang ini', 
                            pos: 'top-right'
                        });

                        vm.sending = false;
                    }
                    // Proceed
                    else {
                        // Replace any unwanted characters
                        vm.merchant.name = _.replace(vm.merchant.name, '-', '');
                        vm.merchant.phoneNumber =  _.replace(vm.merchant.phoneNumber, '-', '');

                        vm.merchant.author = {
                            id: user.uid,
                            email: user.email
                        }
                        
                        // Store a reference to the merchant that will be sent
                        var merchantRef = db.collection('merchants').doc();    
                        vm.merchant.id = merchantRef.id;

                        /* UPLOAD IMAGE TO FIREBASE STORAGE */

                        // If the user is using default icon
                        if(!newIconFile) {
                            vm.uploadToFirestore(merchantRef, vm.merchant.icon);
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

                                                // Create a new directory 'images/merchant/[ID]/icon', and place the file inside this directory
                                                var dir = storageRef.child(`merchants/${vm.merchant.id}/icon/${file.name}`);
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
                                                            message: 'Gagal Menambahkan Gambar ke Database. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                                                            pos: 'top-right'
                                                        });

                                                        vm.sending = false;
                                                    },
                                                    function complete() {
                                                        /* Successfully uploaded image to storage */
                                                        var downloadURL = task.snapshot.downloadURL;

                                                        task.snapshot.ref.getDownloadURL()
                                                            .then(function(downloadURL) {
                                                                /* Upload data to Firestore */
                                                                vm.uploadToFirestore(merchantRef, downloadURL);

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

                                                                    vm.sending = false;
                                                                });
                                                    });
                                            });

                                        }, 'image/jpeg', 1);
                                    },
                                reader.onerror = error => console.log(error);
                            }
                        }
                    }
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Anda harus Log In terlebih dahulu untuk menambahkan pedagang', 
                        pos: 'top-right'
                    });

                    vm.sending = false;
                }
            });
        },
        uploadToFirestore(merchantRef, pIconUrl) {
            var vm = this;
            var newPoints = 10; // user's new point will be added by 10
            var newTotalPosts = 1;
            var FieldValue = firebase.firestore.FieldValue; // to access server timestamp

            // FIrst, get user's contribution point
            var userRef = db.collection('users').doc(vm.merchant.author.id);
            userRef.get().then(function(doc) {
                if (doc.exists) {
                    // If the user had points before
                    if(doc.data().contribution_points != undefined) newPoints = doc.data().contribution_points + 10; 

                    // If the user had posted before
                    if(doc.data().total_posts != undefined) newTotalPosts = doc.data().total_posts + 1; 
                }

                /* ADD DATA TO FIRESTORE */

                // Declare batch
                var batch = db.batch();
                batch.update(userRef, { contribution_points: newPoints, total_posts: newTotalPosts });
                
                var position = vm.merchant.position;

                // Add to merchant document
                batch.set(merchantRef, {
                    id: vm.merchant.id,
                    icon: pIconUrl,
                    name: vm.merchant.name,
                    date: FieldValue.serverTimestamp(),
                    location: vm.merchant.location,
                    position,
                    category: vm.merchant.category,
                    description: vm.merchant.description,
                    phoneNumber: vm.merchant.phoneNumber,
                    rating: vm.merchant.rating,
                    ratingCount: vm.merchant.ratingCount,
                    editCount: vm.merchant.editCount,
                    community: vm.merchant.community,
                    operatingHours: vm.merchant.operatingHours,
                    author: vm.merchant.author
                });

                // Add to user's posts contribution
                var contributionPostsRef = db.collection('users').doc(vm.merchant.author.id).collection('posts').doc(vm.merchant.id);
                batch.set(contributionPostsRef, {
                    id: vm.merchant.id,
                    name: vm.merchant.name,
                    icon: pIconUrl,
                    type: 'merchant',
                    category: vm.merchant.category,
                    location: vm.merchant.location,
                    description: vm.merchant.description,
                    date: FieldValue.serverTimestamp()
                });

                batch.commit()
                    .then(function() {
                        // Success :)
                        vm.success = true;

                        // Enable submit button
                        vm.sending = false;

                        /* Reset All Data */
                        vm.clearForm();
                    })
                    .catch(function(error) {
                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: 'Gagal Menambahkan Pedagang. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                            pos: 'top-right'
                        });

                        vm.sending = false;
                    });
            })
            .catch(function(error) {
                // Handle error
                console.error(error);
                UIkit.notification({
                    status: 'danger',
                    message: 'Gagal Menambahkan Pedagang. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                    pos: 'top-right'
                });

                vm.sending = false;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .card { margin: 0 auto; }

    // Input for image file
    #img-upload { display: none; }

    // Merchant's icon
    div.icon {
        margin-top: 1em;
        position: absoulte;
        height: auto;
        width: 7.5em;
        border-radius: 1em;

        &:hover {
            cursor: pointer;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            transition: box-shadow 0.3s ease-in-out;
            transform: scale(1.05, 1.05);

            &::after { opacity: 1; }
        }

        img.clickable-icon { border-radius: 1em; width: 100%; height: 7.5em; }
    }

    .location-box {
        padding: 10px;
        margin-bottom: 2em;

        #map-wrap { margin-top: 1em; height: 325px; }
    }
</style>