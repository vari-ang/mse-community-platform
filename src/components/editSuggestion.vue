<template>
    <div id="modal-edit-suggestion-full" class="uk-modal-full" uk-modal style="display: none">
        <div class="uk-modal-dialog" :style="{ background: popupColor }">
            <span class="md-headline">Sugesti Perubahan Informasi</span>
            <button class="uk-modal-close-full uk-close-large" type="button" uk-close
                    style="color: white"
                    :style="{ background: popupColor }"
            ></button>
            <div class="uk-grid-collapse uk-child-width-1-1@s uk-flex-middle" uk-grid>
                <md-progress-bar v-if="sending" 
                                md-mode="indeterminate" 
                                style="margin-bottom: 1em;" />

                <div v-if="loading">
                    <md-progress-spinner md-mode="indeterminate" class="center" style="margin-top: 1em;"></md-progress-spinner>
                </div>
                <div v-else
                    v-for="(edit, ix) in edits"
                    :key=edit.id
                    class="edit-suggestion-box">
                    <md-card :style="{ background: boxColor }"
                        v-if="edit.value">
                        <md-card-header slot="header">
                            <h3 id=ix>
                                {{ edit.infoChanged | convertEditKeyToReadable }}
                            </h3>
                            
                            <span class="md-caption">{{ edit.date.seconds | dateFormat }}</span>
                        </md-card-header>
                        <md-card-content>
                        <!-- Icon Changes -->
                            <div v-if="edit.infoChanged == 'icon'"
                                style="margin-top: -1em;">
                                <p><strong>{{ edit.editor.email }} :</strong></p>

                                <img :src="edit.value" 
                                    class="edit-img"
                                    alt="Logo Perubahan">
                                
                                <md-button class="md-raised" style="background: #4caf50;"
                                        @click="dialogActive('approve', ix)"
                                        :disabled="sending">
                                    Setuju ({{ edit.approved }})
                                </md-button>
                                <md-button class="md-raised md-accent"
                                        @click="dialogActive('deny', ix)"
                                        :disabled="sending">
                                    Tolak ({{ edit.denied }})
                                </md-button>
                            </div>

                            <!-- Non Icon Changes -->
                            <div v-else 
                                style="margin-top: -1em;">
                                <p><strong>{{ edit.editor.email }} :</strong></p>

                                <!-- Edit Detail Text -->
                                <p v-if="edit.infoChanged == 'location'"
                                    class="justify">
                                    "{{ edit.value.address }}"
                                    <br>
                                    <span class="md-caption">
                                        "{{ edit.value.note }}"
                                    </span>
                                </p>
                                <div v-else-if="edit.infoChanged == 'operatingHours'"
                                    style="margin-bottom: .5em;">
                                    <div class="md-layout md-gutter">
                                        <div class="md-layout-item md-size-33"><strong>Hari</strong></div>
                                        <div class="md-layout-item md-size-33"><strong>Jam Buka</strong></div>
                                        <div class="md-layout-item md-size-33"><strong>Jam Tutup</strong></div>
                                    </div>
                                    <div v-for="day in edit.value"
                                            :key=day.id
                                            class="md-layout md-gutter"
                                            style="margin-top: .5em;">
                                        <div class="md-layout-item md-size-33">{{ day.day }}</div>
                                        <div class="md-layout-item md-size-33">{{ day.startTime }}</div>
                                        <div class="md-layout-item md-size-33">{{ day.endTime }}</div>
                                    </div>
                                </div>
                                <p v-else
                                    class="justify">
                                    "{{ edit.value }}"
                                </p>

                                <md-button class="md-raised" style="background: #4caf50;"
                                        @click="dialogActive('approve', ix)"
                                        :disabled="sending">
                                    Setuju ({{ edit.approved }})
                                </md-button>
                                <md-button class="md-raised md-accent"
                                        @click="dialogActive('deny', ix)"
                                        :disabled="sending">
                                    Tolak ({{ edit.denied }})
                                </md-button>
                            </div>
                        </md-card-content>

                        <!-- Approval Confirmation Dialog -->
                        <md-dialog-confirm class="dialog-confirm"
                            :md-active.sync="dialogActiveApprove[ix]"
                            md-title="Konfirmasi Penyetujuan Pengubahan Informasi"
                            :md-content="`Apakah Anda yakin ingin menyetujui perubahan ${convertEditKeyToReadable(edit.infoChanged)} yang diusulkan oleh: 
                                    <strong>${edit.editor.email}</strong> ?`"
                            md-confirm-text="Ya"
                            md-cancel-text="Tidak"
                            @md-cancel="onCancel"
                            @md-confirm="onConfirm(ix, 'approve')" />

                        <!-- Denial Confirmation Dialog -->
                        <md-dialog-confirm class="dialog-confirm"
                            :md-active.sync="dialogActiveDeny[ix]"
                            md-title="Konfirmasi Penolakan Pengubahan Informasi"
                            :md-content="`Apakah Anda yakin ingin menolak perubahan ${convertEditKeyToReadable(edit.infoChanged)} yang diusulkan oleh: 
                                    <strong>${edit.editor.email}</strong> ?`"
                            md-confirm-text="Ya"
                            md-cancel-text="Tidak"
                            @md-cancel="onCancel"
                            @md-confirm="onConfirm(ix, 'deny')" />

                        <!-- Approve or Deny Success Message -->
                        <md-dialog-alert style="z-index: 99999999"
                            :md-active.sync="success"
                            :md-content="`<h3 style='text-align:center'>Terimakasih atas kontribusi Anda!</h3> <br>
                                <p style='text-align:center'>Penerapan atau Penolakan perubahan informasi akan terjadi bila sudah dilakukan oleh ${numOfAcceptance} orang</p>`"
                            md-confirm-text="OK!" />
                    </md-card>
                </div>

                <!-- BUTTON FOR SHOWING MORE EDIT SUGGESTIONS -->
                <div v-if="showSpinnerMoreEditSuggestions">
                    <md-progress-spinner md-mode="indeterminate" class="center" style="margin-top: 1em;"></md-progress-spinner>
                </div>
                <div v-else>
                    <md-button class="md-primary center"
                        v-show="showMoreEditSuggestionsButton"
                        @click="loadMoreEditSuggestions">
                        Tampilkan Lagi
                    </md-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '~/plugins/fireinit.js'
import { storage } from '~/plugins/fireinit.js'
import { auth } from '~/plugins/fireinit.js'
import { functions } from '~/plugins/fireinit.js';
import dateFormat from '~/plugins/mixins/dateFormat'
import convertEditKeyToReadable from '~/plugins/mixins/convertEditKeyToReadable'

// Firestore --> Edit suggestions query with cursor
var getEditSuggestionsQuery;
var lastEditSuggestionDoc;

export default {
    mixins: [dateFormat, convertEditKeyToReadable],
    props: ['id', 'type', 'editCount'], 
    // id prop is item's or merchant's ID
    // type prop is either 'merchant' or 'item'
    // editCount prop is the total number of suggestions for this item or merchant
    data() {
        return {
            popupColor: '#4a5153',
            boxColor: '#767D92', // Slay Gray
            loading: true,
            success: false, // flag variable to monitor whether user has successfully approved or denied a suggestion
            edits: [], // list of all edit suggestion for this item/ merchant
            numOfAcceptance: 3, // number of approval or denial acceptance
            dialogActiveApprove: [],
            dialogActiveDeny: [],
            sending: false,
            showMoreEditSuggestionsButton: true,
            showSpinnerMoreEditSuggestions: false,
        }
    },
    created() {
        var vm = this;

        auth.onAuthStateChanged(function(user) {
            if(user) {
                getEditSuggestionsQuery = db.collection(`${vm.type}s`).doc(vm.id).collection('edits')
                                            .orderBy('date', 'desc')
                                            .limit(5);

                getEditSuggestionsQuery.get()
                            .then(function(documentSnapshots) {
                                // Get last review document
                                lastEditSuggestionDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                                documentSnapshots.forEach(function(doc) {
                                    vm.edits.push(doc.data());
                                });

                                if(vm.edits.length <= 5) { vm.showMoreEditSuggestionsButton = false; }
                                vm.loading = false;
                            })
                            .catch(function(error) {
                                // Alert error message
                                console.error(error.message);
                                UIkit.notification({
                                    status: 'danger',
                                    message: 'Terjadi Kendala Menampilkan Sugesti Perubahan Informasi. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                    pos: 'top-right'
                                });
                            });
            }
        });
    },
    methods: {
        convertEditKeyToReadable(key) {
            switch(key) {
                case 'icon':
                    return 'Logo';
                case 'name':
                    return 'Nama';
                case 'category':
                    return 'Kategori';
                case 'description':
                    return 'Deskripsi';
                case 'price':
                    return 'Harga';
                case 'location':
                    return 'Lokasi';
                case 'operatingHours':
                    return 'Jam Operasional';
                case 'phoneNumber':
                    return 'No Telepon'
                default: 
                    return;
            }
        },

        /* EDIT SUGGESTION DIALOG BOX CONFIRMATION */
        dialogActive(status, ix) {
            var vm = this;

            if(status == 'approve') { vm.$set(vm.dialogActiveApprove, ix, true); }
            else if(status == 'deny') { vm.$set(vm.dialogActiveDeny, ix, true); }
        },
        loadMoreEditSuggestions() {
            var vm = this;

            vm.showSpinnerMoreEditSuggestions = true;

            getEditSuggestionsQuery
                .startAfter(lastEditSuggestionDoc)
                .get()
                .then(function(documentSnapshots) {
                    // Get last review document
                    lastEditSuggestionDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                    documentSnapshots.forEach(function(doc) {
                        // Set to item's reviews data
                        vm.edits.push(doc.data());
                    });

                    // Hide button if the no more edit suggestions to be shown
                    if(vm.edits.length == vm.editCount) { 
                        vm.showMoreEditSuggestionsButton = false;
                    }

                    vm.showSpinnerMoreEditSuggestions = false;
                }, 
                function(error) {
                    // Alert error message
                    console.error(error.message);
                    UIkit.notification({
                        status: 'danger',
                        message: 'Tidak Dapat Menampilkan Sugesti Perubahan Informasi. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                        pos: 'top-right'
                    });
                });
        },
        updateMerchantNameOnItems(merchantId, value) {
            var vm = this;

            // Declare batch
            var batch = db.batch();

            // Get all items from this merchant
            db.collection('items')
                .where('merchant.id', '==', merchantId)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if(doc.exists) {
                            batch.update(doc.ref, { 
                                merchant: {
                                    id: merchantId,
                                    name: value
                                } 
                            }); 
                        }
                    });

                    batch.commit()
                        .then(function () {
                            console.log("Batch successfully committed!");
                        })
                        .catch(function(error) {
                            // Output error
                            console.error(error.message);
                        });
                })
                .catch(function(error) {
                    // Alert error message
                    console.error(error.message);
                });
        },
        onConfirm(ix, status) {
            // status param is either 'approve' or 'deny'

            /* Approve  or deny a nedit suggestion */
            // Rules: 1. Only signed user is allow to approve or deny
            //        2. Editor cannot approve or deny.
            //        3. One person (not editor) can approve or deny only once.
            //        4. Edit is fully accepted if the edit received 3 approvals or denials.

            var vm = this,
                editObj = vm.edits[ix];

            auth.onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in
                    vm.sending = true;

                    // Make sure editor not approve his/her own edit
                    if(user.uid != editObj.editor.id) {

                        // Make sure the user has never approved or denied before
                        if(!_.includes(editObj.contributors, user.uid)) {

                            /* UPDATE DATA ON FIRESTORE */

                            // Declare batch
                            var batch = db.batch();

                            // Add one to edit obj approved or denied value
                            if(status == 'approve') { editObj.approved += 1; }
                            else if(status == 'deny') { editObj.denied += 1; }

                            var approved = false; // flag variable to monitor if edit suggestion is approved

                            // Get edit object firestore reference
                            var editObjRef = db.collection(`${vm.type}s`).doc(vm.id).collection('edits').doc(editObj.id);

                            if(editObj.approved < vm.numOfAcceptance && editObj.denied < vm.numOfAcceptance) {
                                // Add this user to edit suggestion object's contributors list
                                editObj.contributors.push(user.uid);

                                // Just update this edit suggestion
                                batch.update(editObjRef, editObj);
                            }

                            if(editObj.approved == vm.numOfAcceptance) {
                                approved = true;

                                // Remove this edit suggestion
                                batch.delete(editObjRef);

                                /* UPDATE RELATED DATA */
                                
                                // Get item reference
                                var itemOrMerchantRef = db.collection(`${vm.type}s`).doc(vm.id);
                                var obj = {};
                                obj[editObj.infoChanged] = editObj.value;
                                if(editObj.infoChanged == 'location') { obj.position = editObj.position }

                                obj['editCount'] = vm.editCount - 1; // Minus one to this item or merchant editCount value

                                batch.update(itemOrMerchantRef, obj);

                                // If this is a merchant's name edit, then update on all item's merchant owner name
                                if(vm.type == 'merchant' && editObj.infoChanged == 'name') {
                                    vm.updateMerchantNameOnItems(vm.id, editObj.value);
                                }

                                // Update editor's contribution point

                                // Get editor's contribution points
                                var newPoints = 5; // editor's new point will be added by 5
                                var newTotalEdits = 1;
                                var editorContributionRef = db.collection('users').doc(editObj.editor.id);

                                editorContributionRef.get().then(function(doc) {
                                    if (doc.exists) {
                                        // If the user had points before
                                        if(doc.data().contribution_points != undefined) newPoints = doc.data().contribution_points + 5;
                                        
                                        // If the user had posted before
                                        if(doc.data().total_edits != undefined) newTotalEdits = doc.data().total_edits + 1; 
                                    }

                                    batch.update(editorContributionRef, { contribution_points: newPoints, total_edits: newTotalEdits });

                                    // Update editor's contribution approved status to `true`
                                    var editorContributionEditRef = db.collection('users').doc(editObj.editor.id).collection('edits').doc(editObj.id);
                                    batch.update(editorContributionEditRef, { 
                                        status: {
                                            approved: true,
                                            denied: false,
                                            waiting: false
                                        }
                                    }); 
                                    
                                    /* UPDATE DATA ON ELASTICSEARCH */
                                    var elasticObj = {
                                        "_index": `${vm.type}s`, 
                                        "_type": `${vm.type}`
                                    };

                                    elasticObj["_id"] = vm.id;
                                    elasticObj["infoChanged"] = editObj.infoChanged;
                                    elasticObj["value"] = editObj.value;
                                    if(elasticObj["infoChanged"] == 'location') { elasticObj["position"] = editObj.position }

                                    var updateDataInElastic = functions.httpsCallable('updateDataInElastic');

                                    // updateDataInElastic({text: JSON.stringify(elasticObj)})
                                    updateDataInElastic({text: elasticObj})
                                        .then(function(result) {

                                            // Read result of the Cloud Function.
                                            console.log(result);
                                        })
                                        .catch(function(error) {
                                            // Getting the Error details.
                                            var code = error.code;
                                            var message = error.message;
                                            var details = error.details;
                                            
                                            console.error(`Code: ${code}, Message: ${message}, Details: ${details}`);
                                        });

                                    // Remove edit suggestions from DOM
                                    vm.edits[ix].value = null;

                                    // Commit the batch
                                    batch.commit()
                                        .then(function () {
                                            // Success :)
                                            vm.sending = false;
                                            vm.success = true;
                                        })
                                        .catch(function(error) {
                                            vm.sending = false;

                                            // Output error
                                            console.error(error.message);
                                            UIkit.notification({
                                                status: 'danger',
                                                message: 'Terjadi Kendala. Silahkan coba lagi atau hubungi Admin atas masalah ini', 
                                                pos: 'top-right'
                                            });
                                        });
                                });
                            }

                            if(editObj.denied == vm.numOfAcceptance) {
                                // Remove this edit suggestion
                                batch.delete(editObjRef);

                                // If this is an icon edit, then remove the image from edits image folder
                                if(editObj.infoChanged == 'icon') {
                                    var httpsReference = storage.refFromURL(editObj.value);
                                    httpsReference.delete().then(function() {
                                        // File deleted successfully
                                        console.log('File deleted successfully');
                                    })
                                    .catch(function(error) {
                                        // Uh-oh, an error occurred!
                                        console.error(error.message);
                                    });
                                }

                                // Minus one to this item or merchant editCount value
                                var itemOrMerchantRef = db.collection(`${vm.type}s`).doc(vm.id);
                                batch.update(itemOrMerchantRef, { editCount: vm.editCount - 1 });

                                // Update editor's contribution denied status to `true`
                                var editorContributionEditRef = db.collection('users').doc(editObj.editor.id).collection('edits').doc(editObj.id);
                                batch.update(editorContributionEditRef, { 
                                    status: {
                                        approved: false,
                                        denied: true,
                                        waiting: false
                                    }
                                }); 
                                
                                // Remove edit suggestions from DOM
                                vm.edits[ix].value = null;
                            }

                            // Commit the batch
                            if(!approved) {
                                batch.commit()
                                    .then(function () {
                                        // Success :)
                                        vm.sending = false;
                                        vm.success = true;
                                    })
                                    .catch(function(error) {
                                        vm.sending = false;

                                        // Output error
                                        console.error(error.message);
                                        UIkit.notification({
                                            status: 'danger',
                                            message: 'Terjadi Kendala. Silahkan coba kembali atau hubungi Admin atas masalah ini', 
                                            pos: 'top-right'
                                        });
                                    });
                            }
                        }
                        // User has contributed in approving or denying this edit suggestion
                        else {
                            vm.sending = false;

                            // Alert error message
                            UIkit.notification({
                                status: 'danger',
                                message: `Anda sudah pernah ${(status == 'approve' ? 'menyetujui' : 'menolak')} perubahan informasi ini sebelumnya`, 
                                pos: 'top-right'
                            });
                        }
                    }
                    else {
                        vm.sending = false;

                        // Alert error message
                        UIkit.notification({
                            status: 'danger',
                            message: `Anda tidak dapat ${(status == 'approve' ? 'menyetujui' : 'menolak')} perubahan informasi yang Anda sugestikan sendiri`, 
                            pos: 'top-right'
                        });
                    }
                }
                else {
                    // User is signed out.
                    UIkit.notification({
                        status: 'danger',
                        message: `Anda harus Log In terlebih dahulu ${(status == 'approve' ? 'menyetujui' : 'menolak')} perubahan informasi ini`, 
                        pos: 'top-right'
                    });
                }
            });
        },
        onCancel() { }
    }
}
</script>

<style lang="scss" scoped>
    .uk-modal-dialog {
        padding: 1em;

         .edit-suggestion-box {
            margin-top: 1em;

            .edit-img {
                margin-bottom: 1em;
                border-radius: 1em;
                width: 15em;
                height: 15em;
            }
        }
    }

    .dialog-confirm { z-index: 9999; }
</style>