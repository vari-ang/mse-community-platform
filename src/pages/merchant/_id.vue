<template>
    <div class="container">
        <div v-if="!isExists">
            <md-empty-state class="center"
                md-icon="store"
                md-label="Merchant (Pedagang) Yang Anda Cari Tidak Ada"
                md-description="Mungkin Anda salah menginputkan ID Merchant atau Merchant ini sudah dihapus :(">
            </md-empty-state>
        </div>
        <div v-else>
            <!-- User is logged out -->
            <div v-if="!user.user.id" class="center">
                <app-log-in-alert></app-log-in-alert>
            </div>
            <md-list class="md-triple-line">
                <md-list-item v-if="!editMode">
                    <md-avatar class="icon">
                        <img :src="merchant.icon" alt="Logo Merchant">
                    </md-avatar>

                    <div class="md-list-item-text icon">
                        <!-- Nama Item -->
                        <span class="md-headline">
                            {{ merchant.name }}
                            <md-tooltip md-direction="top">{{ merchant.name }}</md-tooltip>
                        </span>
                        <span class="md-caption">Merchant (Pedagang)</span>
                    </div>
                </md-list-item>

                <md-list-item v-if="editMode">
                    <!-- Use CSS Shake plugin -->
                    <input id="img-upload-edit" type="file" accept="image/*" ref="files"
                            v-on:change="changeImage" /> 

                    <div class="shake shake-constant shake-constant--hover">
                        <md-avatar class="icon">
                            <img class="clickable-icon"
                                alt="Logo Merchant"
                                v-bind:src="edit.icon"
                                v-on:click="triggerImgUpload">
                        </md-avatar>
                    </div>

                    <div class="md-list-item-text icon" style="margin-left: 0.5em;">
                        <!-- Nama Merchant -->
                        <md-field :class="getEditValidationClass('name')">
                            <label>Nama Pedagang (Merchant)</label>
                            <md-input maxlength="50" v-model="edit.name" :disabled="sendingEdit" />
                            <span class="md-error" v-if="!$v.edit.name.required">Nama Merchant wajib diisi</span>
                        </md-field>
                    </div>
                </md-list-item>

                <!-- POWERED BY COMMUNITY -->
                <app-community-chip></app-community-chip>
            </md-list>

            <!-- Horizontal Bar -->
            <div class="md-layout horizontal-bar">
                <div v-if="!editMode"
                     class="md-layout-item center">
                    <p><span class="md-title">Kategori</span></p>
                    <p>{{ merchant.category }}</p>
                </div>
                <div v-else-if="editMode"
                    class="md-layout-item center">
                    <md-field :class="getEditValidationClass('category')">
                        <label>Kategori</label>
                        <md-select v-model="edit.category" placeholder="Kategori">
                            <md-option v-for="c in merchantCategories"
                                        :key=c.id
                                        :value="c.name">{{ c.name }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.edit.category.required">Kategori wajib dipilih</span>
                    </md-field>
                </div>
                <div class="md-layout-item center">
                    <p><span class="md-title">Rating</span></p>
                    <p>
                        <span class="md-title">{{ merchant.rating }}</span> ({{ merchant.ratingCount }})
                    </p>
                </div>
                <!-- Save (Bookmark) merchant -->
                <div class="md-layout-item center">
                    <md-button class="md-icon-button"
                        :class="{'md-primary': bookmarked}"
                        @click="bookmark">
                        <md-icon>bookmark</md-icon>
                        <md-tooltip md-direction="top" v-if="!bookmarked">Simpan Pedagang ini</md-tooltip>
                        <md-tooltip md-direction="top" v-else>Batalkan Penyimpanan Pedagang ini</md-tooltip>
                    </md-button>
                    <md-menu md-direction="bottom-end">
                        <md-button class="md-icon-button" md-menu-trigger>
                            <md-icon>share</md-icon>
                            <md-tooltip md-direction="top">Sebarkan Pedagang Ini</md-tooltip>
                        </md-button>
                        <md-menu-content>
                            <app-social-sharing type="merchant"
                                                :data="merchant"
                            ></app-social-sharing>
                        </md-menu-content>
                    </md-menu>
                </div>
            </div>

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
                        <div v-show="merchant.editCount != 0" 
                             href="#modal-edit-suggestion-full" uk-toggle
                             class="md-elevation-5 edit-suggestion-box"
                             :class="{ 'disabled': !user.user.id }">
                            <span class="md-subheading center">
                                <md-icon>remove_red_eye</md-icon>
                                Lihat {{ merchant.editCount }} Sugesti Perubahan Informasi
                            </span>
                        </div>

                        <app-edit-suggestion :id="id"
                            :type="'merchant'"
                            :editCount="merchant.editCount"
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
                                        {{ merchant.description }}
                                    </p>
                                </md-card-content>
                            </md-card-area>

                            <!-- Location -->
                            <md-card-area md-inset>
                                <md-card-header>
                                    <h2 class="md-title">Lokasi</h2>
                                </md-card-header>

                                <!-- Map -->
                                <md-card-content>
                                    <div class="map">
                                        <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" 
                                                data-projection="EPSG:4326" style="width: 100%;">
                                            <vl-view :zoom.sync="map.zoom" :center.sync="map.centerPoint" :rotation.sync="map.rotation"></vl-view>

                                            <vl-geoloc @update:position="map.geolocPosition = $event">
                                                <template>
                                                    <!-- Marker -->
                                                    <vl-feature id="position-feature">
                                                        <vl-geom-point :coordinates="map.markerPoint"></vl-geom-point>
                                                        <vl-style-box>
                                                            <vl-style-icon src="https://img.icons8.com/dusk/64/000000/marker.png"
                                                                            :scale="0.8" :size="[64, 64]"></vl-style-icon>
                                                        </vl-style-box>
                                                    </vl-feature>
                                                </template>
                                            </vl-geoloc>
                                            
                                            <vl-layer-tile id="osm">
                                                <vl-source-osm></vl-source-osm>
                                            </vl-layer-tile>
                                        </vl-map>
                                    </div>
                                </md-card-content>

                                <md-card-content>
                                    <p>{{ merchant.location.address }}</p>
                                    <span class="md-caption">
                                        {{ merchant.location.note }}
                                    </span>
                                </md-card-content>

                                <md-card-actions>
                                    <md-menu md-size="big" md-direction="bottom-end">
                                        <md-button class="md-icon-button" md-menu-trigger>
                                            <md-icon>near_me</md-icon>
                                        </md-button>

                                        <md-menu-content>
                                            <a :href="`https://www.google.com/maps/search/?api=1&query=${merchant.position.geopoint.latitude},${merchant.position.geopoint.longitude}`"
                                                target="_blank">
                                                <md-menu-item>            
                                                        <span>Buka di Google Maps</span>
                                                        <md-icon>near_me</md-icon>                   
                                                </md-menu-item>
                                            </a>
                                        </md-menu-content>
                                    </md-menu>
                                </md-card-actions>
                            </md-card-area>

                            <!-- Phone Number -->
                            <md-card-area md-inset>
                                <md-card-header>
                                    <h2 class="md-title">Kontak</h2>
                                </md-card-header>

                                <md-card-content>
                                    <div v-if="merchant.phoneNumber">
                                        <md-list class="md-double-line">
                                            <a :href="`tel:${merchant.phoneNumber}`">
                                                <md-list-item style="margin-top: -2em;">
                                                    <md-icon class="md-primary">phone</md-icon>

                                                    <div class="md-list-item-text">
                                                        <span>{{ merchant.phoneNumber }}</span>
                                                        <span>Telepon</span>
                                                    </div>
                                                </md-list-item>
                                            </a>
                                        </md-list>
                                    </div>
                                    <div v-else>
                                        <md-list class="md-double-line">
                                            <a :href="`tel:${merchant.phoneNumber}`">
                                                <md-list-item style="margin-top: -2em;">
                                                    <md-icon class="md-primary">phone</md-icon>

                                                    <div class="md-list-item-text">
                                                        <span class="md-body-2">--</span>
                                                    </div>
                                                </md-list-item>
                                            </a>
                                        </md-list>
                                    </div>
                                </md-card-content>
                            </md-card-area>

                            <!-- Operating Hours -->
                            <md-card-area md-inset>
                                <md-card-header>
                                    <h2 class="md-title">Jam Operasional</h2>
                                </md-card-header>

                                <md-card-content>
                                    <md-table>
                                        <md-table-row>
                                            <md-table-head>Hari</md-table-head>
                                            <md-table-head>Jam Buka</md-table-head>
                                            <md-table-head>Jam Tutup</md-table-head>
                                        </md-table-row>

                                        <md-table-row v-for="day in merchant.operatingHours"
                                                      :key=day.id>
                                            <md-table-cell>{{ day.day }}</md-table-cell>
                                            <md-table-cell>
                                                <div v-if="day.startTime">
                                                    {{ day.startTime }}
                                                </div>
                                                <div v-else>
                                                    -
                                                </div>
                                            </md-table-cell>
                                            <md-table-cell>
                                                <div v-if="day.endTime">
                                                    {{ day.endTime }}
                                                </div>
                                                <div v-else>
                                                    -
                                                </div>
                                            </md-table-cell>
                                        </md-table-row>
                                    </md-table>
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
                                        <h2 class="md-title">Deskripsi</h2>
                                    </md-card-header>

                                    <md-card-content>
                                        <md-field :class="getEditValidationClass('description')">
                                            <md-textarea maxlength="1000"
                                                v-model="edit.description"
                                            ></md-textarea>
                                            <span class="md-error" v-if="!$v.edit.description.required">Deskripsi wajib diisi</span>
                                            <span class="md-error" v-if="!$v.edit.description.minLength">Deskripsi minimal 20 kata</span>
                                            <span class="md-error" v-if="!$v.edit.description.maxLength">Deskripsi maksimal 1000 kata</span>
                                        </md-field>
                                    </md-card-content>
                                </md-card-area>

                                <!-- Location -->
                                <md-card-area md-inset>
                                    <md-card-header>
                                        <h2 class="md-title">Lokasi</h2>
                                    </md-card-header>

                                    <!-- Map -->
                                    <md-card-content style="margin-top: -2em;">
                                        <md-field :class="getEditValidationClass('address')" v-if="user.user.id">
                                            <GmapAutocomplete class="gmap-autocomplete"
                                                placeholder="Ketik dan pilih alamat untuk merchant (pedagang) ini"
                                                v-model="edit.location.address"
                                                @place_changed="setEditPlace"
                                                :disabled="!user.user.id">
                                            </GmapAutocomplete>

                                            <span class="md-error" v-if="!$v.edit.location.address.required">Alamat untuk merchant ini wajib dipilih</span>
                                        </md-field>

                                        <div class="map">
                                            <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" 
                                                    data-projection="EPSG:4326" style="width: 100%;">
                                                <vl-view :zoom.sync="mapEdit.zoom" :center.sync="mapEdit.centerPoint" :rotation.sync="mapEdit.rotation"></vl-view>

                                                <vl-geoloc @update:position="mapEdit.geolocPosition = $event">
                                                    <template>
                                                        <!-- Marker -->
                                                        <vl-feature id="position-feature">
                                                            <vl-geom-point :coordinates="mapEdit.markerPoint"></vl-geom-point>
                                                            <vl-style-box>
                                                                <vl-style-icon src="https://img.icons8.com/dusk/64/000000/marker.png"
                                                                                :scale="0.8" :size="[64, 64]"></vl-style-icon>
                                                            </vl-style-box>
                                                        </vl-feature>
                                                    </template>
                                                </vl-geoloc>
                                                
                                                <vl-layer-tile id="osm">
                                                    <vl-source-osm></vl-source-osm>
                                                </vl-layer-tile>
                                            </vl-map>
                                        </div>
                                    </md-card-content>

                                    <md-card-content>
                                        <p v-if="(typeof edit.location.address == 'string')">
                                            {{ edit.location.address }}
                                        </p>

                                        <md-field>
                                            <label>Keterangan atau Note (Opsional)</label>
                                            <md-input maxlength="50" v-model="edit.location.note" :disabled="sendingEdit" />
                                        </md-field>
                                    </md-card-content>
                                </md-card-area>

                                <!-- Phone Number -->
                                <md-card-area md-inset>
                                    <md-card-header>
                                        <h2 class="md-title">Kontak</h2>
                                    </md-card-header>

                                    <md-card-content>
                                        <md-field :class="getEditValidationClass('phoneNumber')">
                                            <md-icon>phone</md-icon>
                                            <label>Nomor Telepon</label>
                                            <md-input v-model="edit.phoneNumber" :disabled="sendingEdit" />
                                            <span class="md-error" v-if="!$v.edit.phoneNumber.maxLength">Digit nomor telepon terlalu panjang</span>
                                            <span class="md-error" v-if="!$v.edit.phoneNumber.numeric">Nomor telepon hanya boleh terdiri dari angka (tanpa spasi dan karakter khusus lainnya)</span>
                                        </md-field>
                                    </md-card-content>
                                </md-card-area>

                                <!-- Operating Hours -->
                                <md-card-area md-inset>
                                    <md-card-header>
                                        <h2 class="md-title">Jam Operasional</h2>
                                    </md-card-header>

                                    <md-card-content>
                                        <div class="md-layout md-gutter md-alignment-center" style="margin-top: 1em;">
                                            <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-100">
                                                <md-field>
                                                    <label for="day">Hari</label>
                                                    <md-select name="day" v-model="selectedDayIx">
                                                        <md-option v-for="(day, ix) in edit.operatingHours"
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
                                                    <md-select name="starTime" v-model="edit.operatingHours[selectedDayIx].startTime">
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
                                                    <md-select name="endTime" v-model="edit.operatingHours[selectedDayIx].endTime">
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
                            <div v-show="merchant.ratingCount > 5">
                                <md-button class="md-primary center"
                                    style="text-decoration: none"
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
                            :type="'merchant'"
                            :data.sync="merchant">
                        </app-give-review-box>

                        <!-- SIMILAR MERCHANTS -->
                        <span class="md-headline" style="margin-top: 1em;">
                            Orang Lain Juga Mencari
                        </span>
                        
                        <div v-if="otherMerchants.length == 0">
                            <p style="margin-top: 1em;">
                                 <md-empty-state
                                    md-icon="store"
                                    md-label=""
                                    md-description="Belum Ada Rekomendasi Pedagang Lain Untuk Ditampilkan">
                                </md-empty-state>
                            </p>
                        </div>
                        <div v-else>
                            <app-carousel-horizontal :type="'merchant'"
                                :data="otherMerchants"
                            ></app-carousel-horizontal>
                        </div>
                    </md-list>
                </md-tab>

                <!-- Images -->
                <md-tab id="tab-image" md-icon="image">
                    <md-list>
                        <app-image-tab
                            :id="id"
                            :type="'merchant'"
                        ></app-image-tab>
                    </md-list>
                </md-tab>

                <!-- Item -->
                <md-tab id="tab-item" md-icon="shopping_basket">
                    <md-list style="height: auto;">
                        <md-card class="md-elevation-0 center">
                            <md-card-expand>
                                <md-card-expand-trigger>
                                   <md-button class="md-fab md-primary center" style="border-radius: 50%">
                                        <md-icon>add</md-icon>
                                    </md-button>
                                </md-card-expand-trigger>

                                <md-card-expand-content>
                                    <app-add-item :merchantId="id"
                                                  :merchantName="merchant.name"
                                    ></app-add-item>
                                </md-card-expand-content>
                            </md-card-expand>
                        </md-card>

                        <!-- Loading Spinner -->
                        <div v-if="showSpinnerItem" class="center" style="width: 100%;">
                            <div class="md-layout md-gutter md-alignment-center card-box">
                                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                                    <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                                </div>
                                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                                    <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                                </div>
                                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                                    <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                                </div>
                                <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100" style="margin-top: 1em;">
                                    <md-card md-with-hover class="skeleton-loader md-elevation-7"></md-card>
                                </div>
                            </div> 
                        </div>
                        <div v-else>
                            <div v-if="items.length == 0">
                                <md-empty-state class="center"
                                    md-icon="shopping_basket"
                                    md-label="Tidak Ada Barang atau Jasa Dari Pedagang Ini"
                                    md-description="Tambahkan barang atau jasa untuk membantu Pedagang ini berkembang">
                                </md-empty-state>
                            </div>
                            <div v-else>
                                <div style="height: 25px;"></div>
                                <div class="md-layout md-gutter md-alignment-center">
                                    <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                                         v-for="obj in items"
                                         :key=obj.id
                                         style="margin-bottom: 1em;">
                                        <nuxt-link :to="`/item/${obj.id}`" style="text-decoration:none;">
                                            <md-card md-with-hover 
                                                     class="md-elevation-4"
                                                     style="border-radius: 1em;">
                                                <md-ripple>
                                                    <md-card-media>
                                                        <img :src="obj.icon" alt="Gambar Barang atau Jasa" style="border-radius: 1em 1em 0 0;">
                                                    </md-card-media>

                                                    <md-card-header>
                                                        <div class="md-title">{{ obj.name }}</div>
                                                        <div class="md-subhead">{{ obj.category }}</div>
                                                    </md-card-header>

                                                    <md-card-content>
                                                        <p>Rp. {{ obj.price | thousandsSeparator }}</p>
                                                    </md-card-content>
                                                </md-ripple>
                                            </md-card>
                                        </nuxt-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </md-list>
                </md-tab>
            </md-tabs>
        </div>

        <div style="height:125px;"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

var firebase = require('firebase')
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'
import { geo } from '~/plugins/fireinit.js'
import thousandsSeparator from '~/plugins/mixins/thousandsSeparator'
import times from '~/plugins/mixins/merchant/times'
import { validationMixin } from 'vuelidate'
import {
    required,
    numeric,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'

import AppLogInAlert from '@/components/alert/logIn'
import AppCommunityChip from '@/components/communityChip'
import AppEditAlert from '@/components/alert/edit'
import AppEditSuggestion from '@/components/editSuggestion'
import AppReportPopUp from '@/components/reportPopUp'
import AppReviewBox from '@/components/reviewBox'
import AppReviewBoxFullScreen from '@/components/reviewBoxFullScreen'
import AppGiveReviewBox from '@/components/giveReviewBox'
import AppAddItem from '@/components/addItem'
import AppCarouselHorizontal from '@/components/carousels/horizontal'
import AppSocialSharing from '@/components/socialSharing'
import AppImageTab from '@/components/imageTab'

var newIconFile = null; // To save current icon image

// Firestore --> Reviews query with cursor
var getReviewsQuery;
var lastReviewDoc;

export default {
    mixins: [thousandsSeparator, times, validationMixin],
    components: { 
        AppLogInAlert,
        AppCommunityChip, 
        AppEditAlert,
        AppEditSuggestion,
        AppReportPopUp,
        AppReviewBox, 
        AppReviewBoxFullScreen,
        AppGiveReviewBox,
        AppAddItem,
        AppCarouselHorizontal,
        AppSocialSharing,
        AppImageTab
    },
    mounted() { 
        var vm = this;

        // Get all information for this merchant from Firestore 
        db.collection('merchants').doc(vm.id).get().then(function(doc) {
            if(doc.exists) {
                // Set merchant data
                vm.merchant = doc.data(); 
                vm.merchant.description = _.startCase(_.toLower(vm.merchant.description)); // Capitalize each word in description
                vm.merchant.rating = _.round(vm.merchant.rating, 1); // Round rating to one decimal place
                
                // Clone merchant data to edit object
                vm.edit = {
                    icon: vm.merchant.icon,
                    name: vm.merchant.name,
                    category: vm.merchant.category,
                    description: vm.merchant.description,
                    location: {
                        address: vm.merchant.location.address,
                        note: vm.merchant.location.note
                    },
                    position: {
                        geohash: vm.merchant.position.geohash,
                        geopoint: vm.merchant.position.geopoint,
                    },
                    phoneNumber: vm.merchant.phoneNumber,
                    operatingHours:
                    [
                        {
                            day: 'Senin',
                            startTime: vm.merchant.operatingHours[0].startTime,
                            endTime: vm.merchant.operatingHours[0].endTime
                        },
                        {
                            day: 'Selasa',
                            startTime: vm.merchant.operatingHours[1].startTime,
                            endTime: vm.merchant.operatingHours[1].endTime
                        },
                        {
                            day: 'Rabu',
                            startTime: vm.merchant.operatingHours[2].startTime,
                            endTime: vm.merchant.operatingHours[2].endTime
                        },
                        {
                            day: 'Kamis',
                            startTime: vm.merchant.operatingHours[3].startTime,
                            endTime: vm.merchant.operatingHours[3].endTime
                        },
                        {
                            day: 'Jumat',
                            startTime: vm.merchant.operatingHours[4].startTime,
                            endTime: vm.merchant.operatingHours[4].endTime
                        },
                        {
                            day: 'Sabtu',
                            startTime: vm.merchant.operatingHours[5].startTime,
                            endTime: vm.merchant.operatingHours[5].endTime
                        },
                        {
                            day: 'Minggu',
                            startTime: vm.merchant.operatingHours[6].startTime,
                            endTime: vm.merchant.operatingHours[6].endTime
                        },
                    ]
                }

                // Set to empty arrray
                vm.reviews = [];
                vm.items = [];
                vm.otherMerchants = [];

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
                                message: 'Terjadi Kendala Menampilkan Bookmark. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                pos: 'top-right'
                            });
                        });
                }

                // Set reviews query for cursor purpose
                getReviewsQuery = db.collection('merchants').doc(vm.id).collection('reviews')
                    .orderBy('date', 'desc')
                    .limit(5);

                // Get reviews sub collection
                getReviewsQuery.get()
                    .then(function(documentSnapshots) {
                        // Get last review document
                        lastReviewDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        documentSnapshots.forEach(function(doc) {
                            // Set to merchant's reviews data
                            vm.reviewBox.reviews.push(doc.data());
                        });
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

                // Get other merchants with the same category
                db.collection('merchants')
                    .where('category', '==', vm.merchant.category)
                    .limit(6) // 5 + (1) <-- In case the doc returned include this merchant 
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            var data = doc.data();
                                data.id = doc.id;
                            
                            // Only push data whose ID not the same with this merchant
                            // And limit to 5 results only
                            if(doc.id != vm.id && vm.otherMerchants.length < 5) { 
                                vm.otherMerchants.push(data); 
                            }  
                        });
                    })
                    .catch(function(error) {
                        // Alert error message
                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: 'Tidak Dapat Menampilkan Rekomendasi Pedagang Sejenis. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                            pos: 'top-right'
                        });
                    });

                // Get items for this merchant
                db.collection('items')
                    .where('merchant.id', '==', vm.id)
                    .limit(5)
                    .get()
                    .then(function(querySnapshot) {
                        vm.showSpinnerItem = false;

                        querySnapshot.forEach(function(doc) {
                            var data = doc.data();
                                data.id = doc.id;
                            
                            vm.items.push(data);
                        });
                    })
                    .catch(function(error) {
                        vm.showSpinnerItem = false;

                        // Alert error message
                        console.error(error.message);
                        UIkit.notification({
                            status: 'danger',
                            message: 'Tidak Dapat Menampilkan Barang dan Jasa dari Pedagang ini. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                            pos: 'top-right'
                        });
                    });
            }
            else {
                // Alert requested merchant is not exists
                vm.isExists = false;
            }
        })
        .then(function() {
            // Re-position marker and re-center maps
            vm.geolocate(vm.merchant.position.geopoint.latitude, vm.merchant.position.geopoint.longitude);

            // Populate mapEdit obj with the same value as map obj
            vm.mapEdit.centerPoint = vm.map.centerPoint;
            vm.mapEdit.markerPoint = vm.map.markerPoint;
            vm.mapEdit.zoom = vm.map.zoom;
        }) 
        .catch(function(error) {
            // Alert error message
            console.error(error.message);
            UIkit.notification({
                status: 'danger',
                message: 'Tidak Dapat Menampilkan Informasi Pedagang. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                pos: 'top-right'
            });
        });
    },
    data() {
        return {
            id: this.$route.params.id,

            isExists: true, // FLag variable to check if merchant is exists in firestore
            bookmarked: false,
            showSpinnerItem: true,
            selectedDayIx: 0, // to track what index the user selects the operating hours
            
            /* Data from server */
            merchant: {
                icon: 'https://i.gifer.com/8p7m.gif',
                name: 'Loading ...',
                category: 'Loading ...',
                rating: 5,
                ratingCount: 0,
                editCount: 0,
                community: true,
                description: 'Loading ...',
                location: {
                    address: 'Loading ...',
                    note: 'Loading ...'
                },
                position: { geohash: '', geopoint: ''}, // Will be written by GeoFireX
                phoneNumber: 'Loading ...',
                operatingHours:
                [
                    {
                        day: 'Senin',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        day: 'Selasa',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        day: 'Rabu',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        day: 'Kamis',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        day: 'Jumat',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        day: 'Sabtu',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        day: 'Minggu',
                        startTime: '',
                        endTime: ''
                    },
                ],
                author: {
                    id: '',
                    email: ''
                }
            },
            
            /* EDIT INFO */
            edit: {},
            editMode: false,
            sendingEdit: false,
            showEditSuggestion: false,
            editSuccess: false,

            /* REPORT POPUP */
            reportPopUp: {
                active: false,
                color: '#ef5350',
                select: [],
                options:[
                    {text:'Pedagang ini tidak ada', value:0},
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

            map: {
                zoom: 12,
                centerPoint: [112.751913, -7.251821], // Center point for OL Marker (Longitude, Latitude)
                markerPoint: [0, 0], // OL Marker (Longitude, Latitude)
                rotation: 0,
                geolocPosition: undefined,
            },

            mapEdit: {},

            /* REVIEWS */
            reviewBox: {
                showMoreReviewsButton: true,
                showSpinnerMoreReviews: false,
                reviews: []
            },

            /* ITEMS */
            items: [],

            /* OTHER MERCHANTS */
            otherMerchants: 
            [ 
                {
                    id: 'otherMerchants1',
                    icon: 'https://i.gifer.com/8p7m.gif',
                    name: 'Loading ...',
                    category: 'Loading ...',
                    rating: '5',
                    ratingCount: '0',
                    location: {
                        address: 'Loading...'
                    }
                },
                {
                    id: 'otherMerchants2',
                    icon: 'https://i.gifer.com/8p7m.gif',
                    name: 'Loading ...',
                    category: 'Loading ...',
                    rating: '5',
                    ratingCount: '0',
                    location: {
                        address: 'Loading...'
                    }
                },
                {
                    id: 'otherMerchants3',
                    icon: 'https://i.gifer.com/8p7m.gif',
                    name: 'Loading ...',
                    category: 'Loading ...',
                    rating: '5',
                    ratingCount: '0',
                    location: {
                        address: 'Loading...'
                    }
                }
            ]   
        }
    },
    validations: {
      edit: {
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
    computed: {
        ...mapState(['user'])
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
                                    type: 'merchant',
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
                                message: 'Tidak Dapat Menyimpan atau Menghapus Merchant. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                                pos: 'top-right'
                            });
                        });
                    });
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Anda harus Log In terlebih dahulu untuk menyimpan pedangang ini', 
                        pos: 'top-right'
                    });
                }
            });
        },

        // Reposition map & marker
        geolocate(lat, lng) {
            var vm = this;

            vm.map.centerPoint = [lng, lat];
            vm.map.markerPoint = [lng, lat];
            vm.map.zoom = 18;
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
                        // Set to merchant's reviews data
                        vm.reviewBox.reviews.push(doc.data());
                    });

                    // Hide button if the reviews is more than 35 OR 
                    // the are no more reviews to be shown
                    if(vm.reviewBox.reviews.length > 35 || vm.reviewBox.reviews.length == vm.merchant.ratingCount) { 
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
            const field = (fieldName === 'address') ? 
                this.$v.edit.location.address : 
                this.$v.edit[fieldName];

            if(field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },

        clearEditForm() {
            var vm = this;

            vm.$v.$reset();    
            vm.edit = {
                icon: vm.merchant.icon,
                name: vm.merchant.name,
                category: vm.merchant.category,
                description: vm.merchant.description,
                location: {
                    address: vm.merchant.location.address,
                    note: vm.merchant.location.note
                },
                position: {
                    geohash: vm.merchant.position.geohash,
                    geopoint: vm.merchant.position.geopoint,
                },
                phoneNumber: vm.merchant.phoneNumber,
                operatingHours:
                [
                    {
                        day: 'Senin',
                        startTime: vm.merchant.operatingHours[0].startTime,
                        endTime: vm.merchant.operatingHours[0].endTime
                    },
                    {
                        day: 'Selasa',
                        startTime: vm.merchant.operatingHours[1].startTime,
                        endTime: vm.merchant.operatingHours[1].endTime
                    },
                    {
                        day: 'Rabu',
                        startTime: vm.merchant.operatingHours[2].startTime,
                        endTime: vm.merchant.operatingHours[2].endTime
                    },
                    {
                        day: 'Kamis',
                        startTime: vm.merchant.operatingHours[3].startTime,
                        endTime: vm.merchant.operatingHours[3].endTime
                    },
                    {
                        day: 'Jumat',
                        startTime: vm.merchant.operatingHours[4].startTime,
                        endTime: vm.merchant.operatingHours[4].endTime
                    },
                    {
                        day: 'Sabtu',
                        startTime: vm.merchant.operatingHours[5].startTime,
                        endTime: vm.merchant.operatingHours[5].endTime
                    },
                    {
                        day: 'Minggu',
                        startTime: vm.merchant.operatingHours[6].startTime,
                        endTime: vm.merchant.operatingHours[6].endTime
                    },
                ]
            }

            // Populate mapEdit obj with the same value as map obj
            vm.mapEdit.centerPoint = vm.map.centerPoint;
            vm.mapEdit.markerPoint = vm.map.markerPoint;
            vm.mapEdit.zoom = vm.map.zoom;

            $('.clickable-icon').attr('src', vm.merchant.icon);
            newIconFile = null;
        },

        validateUserEdit () {
            this.$v.$touch()

            if (!this.$v.$invalid) {
                this.editMerchant()
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

        // receives a place object via the autocomplete component
        setEditPlace(place) {
            var vm = this;

            if(place) {
                var lat = place.geometry.location.lat(),
                    lng = place.geometry.location.lng();
                vm.edit.position = geo.point(lat, lng);

                var addressCompsArr = [];
                // Get every address component
                _.forEach(place.address_components, function(comp) {
                    // Add to address
                    addressCompsArr.push(comp.short_name);
                });

                vm.edit.location.address = _.join(addressCompsArr, ', ');  
                vm.geolocateEdit(lat, lng);
            }
        },

        // Reposition map & marker
        geolocateEdit(lat, lng) {
            var vm = this;

            vm.mapEdit.centerPoint = [lng, lat];
            vm.mapEdit.markerPoint = [lng, lat];
            vm.mapEdit.zoom = 18;
        },
        
        editMerchant() {
            var vm = this;
            vm.sendingEdit = true;

            auth.onAuthStateChanged(function(user) {
                if(user) {
                    // Only proceed if the user saved some changes
                    if(newIconFile ||
                       vm.edit.name != vm.merchant.name || 
                       vm.edit.category != vm.merchant.category ||
                       vm.edit.description != vm.merchant.description ||
                       vm.edit.position.geohash != vm.merchant.position.geohash ||
                       vm.edit.location.note != vm.merchant.location.note ||
                       vm.edit.phoneNumber != vm.merchant.phoneNumber || 
                       (!_.isEqual(vm.edit.operatingHours, vm.merchant.operatingHours))) {

                        // Proceed
                        if(vm.edit.position.geohash) {
                            // Replace any unwanted characters
                            vm.edit.name = _.replace(vm.edit.name, '-', '');
                            vm.edit.phoneNumber =  _.replace(vm.edit.phoneNumber, '-', '');

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
                                                    var dir = storageRef.child(`merchants/${vm.id}/edits/${file.name}`);
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
                                                            vm.sendingEdit = false;

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
                                                                    vm.sendingEdit = false;

                                                                    // Handle unsuccessful uploads
                                                                    // Output error
                                                                    console.error(err.message);
                                                                    UIkit.notification({
                                                                        status: 'danger',
                                                                        message: 'Gagal Menambahkan Gambar ke Database. Silahkan mencoba kembali atau hubungi Admin atas masalah ini', 
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
                        // If user doesn't set pin location
                        else {
                            vm.sendingEdit = false;

                            UIkit.notification({
                                status: 'danger',
                                message: 'Gagal Mengubah Informasi. Mohon pilih lokasi alamat paling cocok untuk merchant ini', 
                                pos: 'top-right'
                            });
                        }
                    }
                    else {
                        vm.sendingEdit = false;

                        UIkit.notification({
                            status: 'danger',
                            message: 'Gagal Mengubah Informasi. Anda tidak melakukan perubahan informasi sama sekali', 
                            pos: 'top-right'
                        });
                    }
                }
                else {
                    vm.sendingEdit = false;

                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Mengubah Informasi. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });
                }
            });
        },
        uploadToFirestore() {
            var vm = this;
            var FieldValue = firebase.firestore.FieldValue; // to access server timestamp
            var editCount = vm.merchant.editCount;

            /* ADD DATA TO FIRESTORE */
            
            // Declare batch
            var batch = db.batch();

            // Loop through edit object to seek for edit changes
            // One change = One edit doc
            for (var key in vm.edit) {
                if(!_.isEqual(vm.edit[key], vm.merchant[key])) {
                    if(key != 'position') {
                        // Plus one to merchant's editCount
                        editCount++;

                        var merchantRef = db.collection('merchants').doc(vm.id);
                        batch.update(merchantRef, { editCount: editCount });

                        // Store a reference to the merchant that will be sent
                        var editRef = db.collection('merchants').doc(vm.id).collection('edits').doc(),    
                            editId = editRef.id;

                        var editObj = { 
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
                        }

                        if(editObj.infoChanged == 'location') { editObj.position = vm.edit.position; }

                        // Add to merchant's edits collection
                        batch.set(editRef, editObj);

                        // Add edit suggestion to user contribution edtis collection
                        var contributionEditsRef = db.collection('users').doc(vm.user.user.id).collection('edits').doc(editId);
                        batch.set(contributionEditsRef, {
                            // Item's info
                            id: vm.id,
                            icon: vm.merchant.icon,
                            name: vm.merchant.name,
                            description: vm.merchant.description,
                            type: 'merchant',
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
                    vm.sendingEdit = false;

                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Mengubah Informasi. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    .icon {
        position: absoulte;
        height: auto;
        width: 5.5em;
        margin-left: -1em;

        img {
            border-radius: 1em;
            width: 4em;
            height: 4em;
        }
    }

    // Other merchants' icon
    .others-icon {
        position: absoulte;
        height: auto;
        width: 4em;
        margin-left: -1em;
        border-radius: 0.5em;

        img {
            border-radius: 0.5em;
            width: 3em;
            height: 3em;
        }
    }

    .horizontal-bar { margin-top: 1em; }

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

    .img-upload {
        width: 100%; 
        max-width: 210px;
        color: #353C51;
        margin: 0 auto;
    }

    .card-box {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        margin-bottom: 1em;

        // Map (Location)
        .map {
            width: 100%;
            max-height: 375px;
        }
    }

    .skeleton-loader { margin: 0 auto; }  

    // Other merchants
    .list-item {
        &:hover { 
            .list-merchant { background: #767D92; }
        }

        .md-inset { margin-left: 105px; }
    }
</style>