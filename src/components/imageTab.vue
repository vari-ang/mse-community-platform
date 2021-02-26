<template>
    <div>
        <div v-if="user.user.id" style="margin-bottom: 1em;">
            <!-- Upload Image -->
            <form id="file-upload-form" class="uploader">
                <input id="file-upload" type="file" name="fileUpload" multiple accept="image/*"
                        v-on:change="selectImgs"
                        ref="images" />

                <label for="file-upload">
                    <div id="start">
                        <i class="fa fa-download" aria-hidden="true"></i>
                        <div>Pilih Gambar</div>
                    </div>

                    <ul id="preview" class="item-image">
                        <li>
                            
                        </li>
                    </ul>
                </label>
            </form>
            <md-button class="md-raised md-primary center" style="width: 100%"
                :disabled="sendingUploadImgs"
                @click="uploadImgs()">
                <md-icon>cloud_upload</md-icon>
                Upload
            </md-button>

            <md-progress-bar v-show="sendingUploadImgs" md-mode="indeterminate" class="center" style="margin-top: 1em;"></md-progress-bar>
        </div>

        <!-- Loading Spinner -->
        <div v-if="showSpinnerImg">
            <md-progress-spinner md-mode="indeterminate" class="center" style="margin-top: 1em;"></md-progress-spinner>
        </div>
        <div v-else>
            <!-- IMAGES -->
            <div v-if="images.length == 0">
                <md-empty-state class="center"
                    md-icon="image"
                    md-label="Tidak Ada Gambar Untuk Ditampilkan"
                    :md-description="`Tambahkan gambar untuk memudahkan orang lain mengetahui lebih lanjut mengenai ${(type == 'item' ? 'barang atau jasa' : 'pedagang')} ini`">
                </md-empty-state>
            </div>
            <div v-else>
                <div class="md-layout md-gutter" uk-lightbox="animation: slide" >
                    <div class="md-layout-item md-size-33"
                        v-for="imgUrl in images"
                        :key="imgUrl.id"
                        style="margin-bottom: 0.5em;">
                        <a class="uk-inline" data-type="image" :href="imgUrl">
                            <img :src="imgUrl" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

var firebase = require('firebase');
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'

var imgList = null; // List of all images that will be uploaded to server

export default {
    props: [
        'id', 
        'type' // merchant or item
    ],
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        var vm = this;

        // Get all images for this merchant from Firebase Storage
        vm.storageImagesToken(vm.id);
    },
    data() {
        return {
            showSpinnerImg: true,
            sendingUploadImgs: false,
            isImgsSelected: false,

            /* IMAGES */
            images: [],
        }
    },
    methods: {
        // Get image for this item in firebase storage
        async storageImagesToken(id) {
            var vm = this;
            var storageRef = storage.ref();

            // Create a reference under which you want to list
            var listRef = storageRef.child(`${vm.type}s/${id}/images`);
            
            // Fetch the first page of 100.
            var firstPage = await listRef.list({maxResults: 100});
            // Use the result.

            // Check to see if this items has images
            if(firstPage.items.length == 0) { vm.showSpinnerImg = false; }
            else {
                _.forEach(firstPage.items, function(img) {
                    storageRef.child(img.fullPath).getDownloadURL()
                        .then(function(url) {
                            vm.showSpinnerImg = false;

                            // `url` is the download URL for 'images/[item's id]/[file name].jpg'
                            vm.images.push(url);
                        })
                        .catch(function(error) {
                            // Handle any errors
                            UIkit.notification({
                                status: 'danger',
                                message: 'Gagal Mendapatkan Gambar. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                pos: 'top-right'
                            });
                        });
                });

                if (firstPage.nextPageToken) {
                    // Fetch the rest page
                    var secondPage = await listRef.list({
                        pageToken: firstPage.nextPageToken
                    });
                    
                    _.forEach(secondPage.items, function (img) {
                        storageRef.child(img.fullPath).getDownloadURL()
                            .then(function(url) {
                                vm.showSpinnerImg = false;

                                // `url` is the download URL for 'images/[item's id]/[file name].jpg'
                                vm.images.push(url);
                            })
                            .catch(function(error) {
                                // Handle any errors
                                UIkit.notification({
                                    status: 'danger',
                                    message: 'Gagal Mendapatkan Gambar. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                    pos: 'top-right'
                                });
                            });
                    });
                }
            }
        },

        selectImgs() {
            var vm = this;
            
            // Set image list
            imgList = Object.assign({}, imgList, vm.$refs.images.files);

            // Clear previous thumbnails
            $('#preview li').empty();

            // Show tumbnails
            for (var key in imgList) {
                var curr = imgList[key]; 
                
                if (!curr.type.startsWith('image/')) {
                    UIkit.notification({
                        status: 'danger',
                        message: 'Anda Mengunggah File Yang Bukan Merupakan Gambar', 
                        pos: 'top-right'
                    });
                    continue; 
                }
            

                var img = document.createElement('img');

                // Style img
                img.width = '300';
                img.height = '250';
                img.style.marginTop = '.25em';
                img.style.marginRight = '1em';
                img.style.marginBottom = '.25em';

                img.file = curr;

                // Append to preview thumbnail div
                $('#preview li').append(img);
                
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
                reader.readAsDataURL(curr);   
            }
        },

        uploadImgs() {
            var vm = this;

            auth.onAuthStateChanged(function(user) {
                if(user) {
                    if(!imgList) {
                        UIkit.notification({
                            status: 'danger',
                            message: 'Anda Belum Memilih Gambar. Silahkan klik kotak di atas untuk memilih gambar', 
                            pos: 'top-right'
                        });
                    }
                    else {
                        vm.sendingUploadImgs = true;

                        _.forEach(imgList, function(obj) {
                            if (obj.type.startsWith('image/')) {                        
                                // Reduce file (image) size
                                const width = 300;
                                const height = 300;
                                const fileName = _.uniqueId(obj.name + '_' + Date.now() + '_');
                                const reader = new FileReader();
                                const imgResized = new Image();

                                reader.readAsDataURL(obj);
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

                                                    // Create a new directory 'images/merchant/[ID]/images', and place the file inside this directory
                                                    var dir = storageRef.child(`${vm.type}s/${vm.id}/images/${file.name}`);
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
                                                                message: `Gagal Menambahkan Gambar ke Database. Silahkan coba lagi atau hubungi Admin atas masalah ini`, 
                                                                pos: 'top-right'
                                                            });
                                                        },
                                                        function complete() {
                                                            /* Successfully uploaded image to storage */
                                                            var downloadURL = task.snapshot.downloadURL;

                                                            task.snapshot.ref.getDownloadURL()
                                                                .then(function(downloadURL) {
                                                                    // Successfully uploaded images
                                                                    
                                                                    // Push to images url
                                                                    vm.images.push(downloadURL);

                                                                    // Update Metadata
                                                                    var myCustomMetadata = {
                                                                        customMetadata : {
                                                                            "Author's UID": user.uid
                                                                        }
                                                                    }
        
                                                                    dir.updateMetadata(myCustomMetadata)
                                                                        .then(function(metadata) {
                                                                            vm.sendingUploadImgs = false;
                                                                            console.log('Successfully adding custom metadata: ' + metadata);

                                                                            // Clear previous thumbnails
                                                                            $('#preview li').empty();

                                                                            imgList = null;
                                                                        })
                                                                        .catch(function(err) {
                                                                            vm.sendingUploadImgs = false;
                                                                            console.error(err.message);
                                                                            UIkit.notification({
                                                                                status: 'danger',
                                                                                message: `Gagal Menambahkan Gambar. Silahkan coba lagi atau hubungi Admin atas masalah ini`, 
                                                                                pos: 'top-right'
                                                                            });
                                                                        });
                                                                })
                                                                .catch(function(error) {
                                                                    // Handle unsuccessful uploads
                                                                    // Output error
                                                                    vm.sendingUploadImgs = false;
                                                                    console.error(err.message);
                                                                    UIkit.notification({
                                                                        status: 'danger',
                                                                        message: `Gagal Menambahkan Gambar. Silahkan coba lagi atau hubungi Admin atas masalah ini`, 
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
                        });
                    }
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Tidak Dapat Menambahkan Gambar. Anda harus Log In terlebih dahulu', 
                        pos: 'top-right'
                    });
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    // Vars and Reset for Image Uploading
    $theme:         #506680;
    $box-background:#353C51;
    $text-color:    #cfd8dc;

    // Upload Images
    .uploader {
        display: block;
        clear: both;
        margin: 0 auto;
        width: 100%;

        label {
            float: left;
            clear: both;
            width: 100%;
            padding: 0.5em 0.5em 0 0.5em;
            text-align: center;
            background: $box-background;
            border-radius: 7px;
            border: 3px solid #eee;
            transition: all .2s ease;
            user-select: none;

            &:hover {
                cursor: pointer;
                border: 3px solid $theme;
                box-shadow: inset 0 0 0 6px #eee;
            
                #start {
                    i.fa {
                        transform: scale(0.8);
                        opacity: 0.3;
                    }
                }
            }
        }

        #start {
            margin-top: .5em;
            float: left;
            clear: both;
            width: 100%;
            i.fa {
                font-size: 50px;
                margin-bottom: 1rem;
                transition: all .2s ease-in-out;
            }
        }
    
        #file-upload { display: none; }

        div {
            margin: 0;
            color: $text-color;
        }

        ul.item-image {
            white-space:nowrap;
            overflow: scroll;
            
            li {
                list-style-type: none;
                display: inline-block;
                margin-right: 2em;
            }
        }
    }
</style>