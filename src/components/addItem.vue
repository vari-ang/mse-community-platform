<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="validateUser" autocomplete="off">
            <md-card class="md-layout-item md-size-75 md-small-size-100 card md-elevation-0">
                <md-card-header>
                    <div class="md-title center">Tambah Barang atau Jasa Baru</div>
                </md-card-header>

                <input id="img-upload" type="file" accept="image/*" ref="files"
                    v-on:change="changeImage" /> 

                <!-- Default Image Icon -->
                <div class="center icon">
                    <img class="clickable-icon"
                        alt="Item's Logo"
                        v-bind:src="item.icon"
                        v-on:click="triggerImgUpload">
                </div>

                <p class="center">
                    <span class="md-caption">Klik gambar di atas untuk mengganti logo</span>
                </p>

                <md-card-content>
                    <md-field :class="getValidationClass('name')">
                        <label>Nama Barang atau Jasa</label>
                        <md-input maxlength="50" v-model="item.name" :disabled="sending" />
                        <span class="md-error" v-if="!$v.item.name.required">Nama wajib diisi</span>
                    </md-field>

                    <md-field :class="getValidationClass('type')">
                        <label>Jenis</label>
                        <md-select v-model="item.type" placeholder="Jenis: barang atau jasa" @input="resetTypeSelect">
                            <md-option value="product">Barang</md-option>
                            <md-option value="service">Jasa</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.item.type.required">Jenis barang atau jasa wajib dipilih</span>
                    </md-field>

                    <md-field :class="getValidationClass('category')">
                        <label>Kategori</label>
                        <md-select v-if="item.type == 'product'" 
                                    v-model="item.category" 
                                    placeholder="Kategori">
                            <md-option v-for="c in productCategories"
                                        :key=c.id
                                        :value="c.name">
                                    {{ c.name }}
                            </md-option>
                        </md-select>
                        <md-select v-else-if="item.type == 'service'" 
                                    v-model="item.category" 
                                    placeholder="Kategori">
                            <md-option v-for="c in serviceCategories"
                                        :key=c.id
                                        :value="c.name">
                                    {{ c.name }}
                            </md-option>
                        </md-select>

                        <span class="md-error" v-if="!$v.item.category.required">Kategori wajib dipilih</span>
                    </md-field>

                    <md-field :class="getValidationClass('price')"
                        :md-counter="false">
                        <label>Harga*</label>
                        <span class="md-prefix">Rp.</span>
                        <md-input type="number"
                                step="1000"
                                maxlength="8"
                                v-model="item.price"></md-input>
                        <span class="md-error" v-if="!$v.item.price.required">Harga wajib diisi</span>
                        <span class="md-error" v-if="!$v.item.price.numeric">Harga hanya boleh terdiri dari angka (tanpa spasi dan karakter khusus lainnya)</span>
                        <span class="md-error" v-if="!$v.item.price.between">Antara Rp.100 dan Rp.100.000.000</span>
                    </md-field>

                    <md-field :class="getValidationClass('description')">
                        <label>Deskripsi</label>
                        <md-textarea maxlength="1000" style="resize:none;"
                            v-model="item.description" :disabled="sending"></md-textarea>
                        <span class="md-error" v-if="!$v.item.description.required">Isikan deskripsi secara singkat saja tidak masalah</span>
                        <span class="md-error" v-if="!$v.item.description.minLength">Deskripsi minimal 20 kata</span>
                    </md-field>
                </md-card-content>

                <md-card-actions class="center">
                    <md-button type="submit" class="md-primary md-raised" style="margin: 0 auto; border-radius: 1em;"
                            :disabled="sending || !user.user.id">
                        <md-icon>add</md-icon>
                        Tambah
                    </md-button>

                    <md-progress-bar md-mode="indeterminate" v-if="sending" />
                </md-card-actions>

                <app-add-alert></app-add-alert>

                <div style="height: 25px;"></div>
            </md-card>
        </form>

        <div style="height: 25px;"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

var firebase = require('firebase');
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'

import AppAddAlert from '@/components/alert/add'

import itemtCategories from '~/plugins/mixins/item/categories'
import { validationMixin } from 'vuelidate'
import {
    required,
    numeric,
    between,
    minLength,
    maxLength,
} from 'vuelidate/lib/validators'

var newIconFile = null; // To save current icon image

export default {
    mixins: [itemtCategories, validationMixin],
    components: { AppAddAlert },
    props: ['merchantId', 'merchantName'],
    data() {
        return {
            sending: false,

             /* Data to be sent to server */
            item: {
                community: 1,
                id: '',
                icon: 'https://image.flaticon.com/icons/svg/743/743007.svg',
                name: '',
                type: '',
                category: '',
                price: 0,
                rating: 0,
                ratingCount: 0,
                editCount: 0,
                community: true,
                description: '',
                author: {
                    id: '',
                    email: ''
                }
            },
        }
    },
    validations: {
      item: {
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
            numeric,
            between: between(100, 100000000)
        },
        description: {
            required,
            minLength: minLength(20),
            maxLength: maxLength(1000)
        }
      }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        ...mapMutations({
            'setUser': 'user/setUser'
        }),
        getValidationClass (fieldName) {
            const field = this.$v.item[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        clearForm () {
            this.$v.$reset();
            this.item.name = null;
            this.item.type = null;
            this.item.category = null;
            this.item.price = 0;
            this.item.description = null;

            $('.clickable-icon').attr('src', 'https://image.flaticon.com/icons/svg/743/743007.svg');
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
        add() {
            var vm = this;
            vm.sending = true;

            auth.onAuthStateChanged(function(user) {
                if(user) {
                    // Replace any unwanted characters
                    vm.item.name = _.replace(vm.item.name, '-', '');
                    vm.item.price = _.replace(vm.item.price, /[^\w\s]/gi, '');

                    vm.item.author = {
                        id: user.uid,
                        email: user.email
                    }
                    
                    // Store a reference to the item that will be sent
                    var itemRef = db.collection('items').doc();    
                    vm.item.id = itemRef.id;

                    /* UPLOAD IMAGE TO FIREBASE STORAGE */

                    // If the user is using default icon
                    if(!newIconFile) {
                        vm.uploadToFirestore(itemRef, vm.item.icon);
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
                                            var dir = storageRef.child(`items/${vm.item.id}/icon/${file.name}`);
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
                                                    vm.sending = false;

                                                    // Handle unsuccessful uploads
                                                    // Output error
                                                    console.error(err.message);
                                                    UIkit.notification({
                                                        status: 'danger',
                                                        message: 'Gagal Menambahkan Gambar ke Database. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                                                        pos: 'top-right'
                                                    });
                                                },
                                                function complete() {
                                                    /* Successfully uploaded image to storage */
                                                    var downloadURL = task.snapshot.downloadURL;

                                                    task.snapshot.ref.getDownloadURL()
                                                        .then(function(downloadURL) {
                                                            /* Upload data to Firestore */
                                                            vm.uploadToFirestore(itemRef, downloadURL);

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
                                                            vm.sending = false;

                                                            // Handle unsuccessful uploads
                                                            // Output error
                                                            console.error(err.message);
                                                            UIkit.notification({
                                                                status: 'danger',
                                                                message: 'Gagal Menambahkan Gambar ke Database. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                                                                pos: 'top-right'
                                                            });
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
                    vm.sending = false;

                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Tidak Dapat Menambahkan Barang atau Jasa. Anda harus Log In terlebih dahulu', 
                        pos: 'top-right'
                    });
                }
            });
        },
        uploadToFirestore(itemRef, pIconUrl) {
            var vm = this;
            var newPoints = 10; // user's new point will be added by 10
            var newTotalPosts = 1;
            var FieldValue = firebase.firestore.FieldValue; // to access server timestamp

            // FIrst, get user's contribution point
            var userRef = db.collection('users').doc(vm.item.author.id);
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

                // Add to merchant document
                batch.set(itemRef, {
                    id: vm.item.id,
                    icon: pIconUrl,
                    name: vm.item.name,
                    date: FieldValue.serverTimestamp(),
                    type: vm.item.type,
                    category: vm.item.category,
                    price: vm.item.price,
                    description: vm.item.description,
                    rating: vm.item.rating,
                    ratingCount: vm.item.ratingCount,
                    editCount: vm.item.editCount,
                    community: vm.item.community,
                    merchant: {
                        id: vm.merchantId,
                        name: vm.merchantName
                    },
                    author: vm.item.author
                });

                // Add to user's posts contribution
                var contributionPostsRef = db.collection('users').doc(vm.item.author.id).collection('posts').doc(vm.item.id);
                batch.set(contributionPostsRef, {
                    id: vm.item.id,
                    type: 'item',
                    date: FieldValue.serverTimestamp()
                });

                batch.commit()
                    .then(function() {
                        // send success message by toast
                        UIkit.notification({
                            status: 'success',
                            message: `Berhasil Menambahkan ${(vm.item.type == 'product' ? 'Barang' : 'Jasa')}. Terimakasih atas kontribusi Anda untuk memajukan Usaha Mikro dan Kecil (UMK) di Indonesia. Anda telah mendapatkan tambahan 10 poin`, 
                            pos: 'top-right'
                        });

                        // Enable submit button
                        vm.sending = false;

                        /* Reset All Data */
                        vm.clearForm();
                    })
                    .catch(function(error) {
                        vm.sending = false;

                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: 'Tidak Dapat Menambahkan Barang atau Jasa. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                            pos: 'top-right'
                        });
                    });
            })
            .catch(function(error) {
                vm.sending = false;

                // Handle error
                console.error(error);
                UIkit.notification({
                    status: 'danger',
                    message: 'Tidak Dapat Menambahkan Barang atau Jasa. Silahkan coba kembali atau hubungi Admin atas kendala ini', 
                    pos: 'top-right'
                });
            });
        },
        resetTypeSelect() { this.item.category = ''; }
    }
}
</script>

<style lang="scss" scoped>
    .card { margin: 0 auto; }
    
    // Input for image file
    #img-upload { display: none; }

    // Item's icon
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
    
    // .icon {
    //     margin-top: 1em;
    //     position: absoulte;
    //     height: auto;
    //     width: 7.5em;

    //     .img {
    //         border-radius: 1em;
    //         width: 5em;
    //         height: 5em;
    //     }
    // }
</style>