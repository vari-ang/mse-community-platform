<template>
    <div id="modal-review-full" class="uk-modal-full" uk-modal>
        <div class="uk-modal-dialog" :style="{ background: popupColor }">
            <span class="md-headline">Ulasan</span>
            <button class="uk-modal-close-full uk-close-large" type="button" uk-close
                    style="color: white"
                    :style="{ background: popupColor }"
            ></button>
            <div class="uk-grid-collapse uk-child-width-1-1@s uk-flex-middle" uk-grid>
                <div class="review-box"
                    v-for="review in reviewBox.reviews"
                    :key=review.id>
                    <md-card :style="{ background: boxColor }">
                        <md-card-header slot="header">
                            <h3>
                                {{ review.title }}
                            </h3>
                        </md-card-header>
                        <md-card-content>
                            <div v-if="review.date">
                                <p><span class="md-caption">{{ review.date.seconds | dateFormat }}</span></p>
                            </div>

                            <!-- Review Description -->
                            <div>
                                <p class="justify">
                                    {{ review.description }}
                                </p>
                            </div>
                            <span class="md-caption">{{ review.author.email }}</span>
                        </md-card-content>
                    </md-card>
                </div>

                <!-- BUTTON FOR SHOWING MORE REVIEWS -->
                <div class="center">
                    <div v-if="reviewBox.showSpinnerMoreReviews">
                        <md-progress-spinner md-mode="indeterminate" class="center" style="margin-top: 1em;"></md-progress-spinner>
                    </div>
                    <div v-else>
                        <md-button class="md-primary center" style="text-transform: capitalize"
                            v-show="reviewBox.showMoreReviewsButton"
                            @click="clickShowMoreReviews">
                            Tampilkan Lagi
                        </md-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dateFormat from '~/plugins/mixins/dateFormat'

export default {
    mixins: [dateFormat],
    data() {
        return {
            popupColor: '#4a5153',
            boxColor: '#767D92' // Slay Gray
        }
    },
    props: ['reviewBox'],
    methods: {
        clickShowMoreReviews() {
            this.$emit('load-more-reviews');
        }
    }
}
</script>

<style lang="scss" scoped>
    .uk-modal-dialog {
        padding: 1em;

        .review-box { margin-top: 1em; }
    }
</style>