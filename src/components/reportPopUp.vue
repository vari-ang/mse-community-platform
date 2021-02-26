<template>
    <md-dialog :md-active.sync="reportPopUp.active" style="padding: 15px; width: 100%">
        <md-button class="md-icon-button md-raised" 
                @click="reportPopUp.active = false"
                style="position: absolute; right: 0; top: 5px;">
            <md-icon>close</md-icon>
        </md-button>

        <md-dialog-title class="center">
            Laporkan Merchant, Produk, atau Jasa Ini
        </md-dialog-title>

        <div class="md-layout md-gutter">
            <div class="md-layout-item">
                <md-field>
                    <label for="reasons">Pilih Alasan</label>
                    <md-select v-model="reportPopUp.select" name="reasons" multiple md-dense>
                        <md-option v-for="(item,index) in reportPopUp.options" 
                            :key="index" 
                            :value="item.value">
                            {{ item.text }}
                        </md-option>
                    </md-select>
                </md-field>
            </div>
        </div>

        <md-field>
            <label>Keterangan (Opsional)</label>
            <md-textarea maxlength="500"
                     v-model="reportPopUp.note"
            ></md-textarea>
        </md-field>

        <md-dialog-actions>
            <md-button class="md-accent center" 
                        @click="report"
                        :disabled="reportPopUp.disabled">
                        Lapor
            </md-button>
        </md-dialog-actions>

        <div v-if="reportPopUp.showSpinner">
            <md-progress-bar md-mode="indeterminate" style="margin-top: 1em;"></md-progress-bar>
        </div>

        <!-- Report Success Message -->
        <md-dialog-confirm style="z-index: 99999999"
            :md-active.sync="success"
            md-title="Berhasil Melaporkan"
            md-content="Terimakasih sudah melaporkan! Kami akan segera menanggapi laporan Anda"
            md-confirm-text="OK!"
            md-cancel-text=""
            @md-confirm="onConfirm" />
    </md-dialog>
</template>

<script>
var firebase = require('firebase')
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'

export default {
    data() {
        return {
            success: false
        }
    },
    props: ['reportPopUp'],
    methods: {
        report() {
            var vm = this;
            var FieldValue = firebase.firestore.FieldValue; // to access server timestamp

            auth.onAuthStateChanged(function(user) {
                if(user) {
                    // If the user has not selected any options
                    if(vm.reportPopUp.select.length != 0) {
                        // If the user selected 'Lainnya' option & doesnt add note
                        if(_.includes(vm.reportPopUp.select, 5) && !vm.reportPopUp.note) {
                            UIkit.notification({
                                status: 'danger',
                                message: 'Gagal Melapor. Mohon isikan keterangan agar kami mengerti masalah yang ada', 
                                pos: 'top-right'
                            });
                        }
                        else {
                            vm.reportPopUp.disabled = true;
                            vm.reportPopUp.showSpinner = true;

                            var reasonsArr = [], reasons = '';
                            _.forEach(vm.reportPopUp.select, function(value) {
                                reasonsArr.push(vm.reportPopUp.options[value].text);
                            });

                            reasons = _.join(reasonsArr, ',');

                            // Set random ID
                            db.collection("reports").doc().set({
                                    date: FieldValue.serverTimestamp(),
                                    reporter: {
                                        id: user.uid,
                                        email: user.email
                                    },
                                    path: $nuxt.$route.path,
                                    reasons: reasons,
                                    note: vm.reportPopUp.note
                                })
                                .then(function() {
                                    // Success :)

                                    vm.success = true;
                                    vm.reportPopUp.disabled = false;
                                    vm.reportPopUp.showSpinner = false;
                                    vm.reportPopUp.note = '';
                                })
                                .catch(function(error) {
                                    console.error("Error writing document: ", error);
                                    UIkit.notification({
                                        status: 'danger',
                                        message: 'Gagal Melapor. Mohon isikan keterangan agar kami mengerti masalah yang ada', 
                                        pos: 'top-right'
                                    });
                                });
                        }
                    }
                    else {
                        UIkit.notification({
                            status: 'danger',
                            message: 'Gagal Melapor. Anda harus memilih setidaknya satu alasan', 
                            pos: 'top-right'
                        });
                    }
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: 'Gagal Melapor. Anda harus Log In terlebih dahulu', 
                        pos: 'top-right'
                    });
                }
            });
        },

        // When user click the OK button on confirmation dialog
        onConfirm() { this.reportPopUp.active = false; }
    }
}
</script>

<style lang="scss" scoped>

</style>