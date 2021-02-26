<template>
    <div class="review-container">
        <div type="flex">
            <!-- Max 5 Review -->
            <div class="review-box"
                v-for="(review, ix) in reviewBox.reviews"
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
                        <div v-if="review.description.length > 300">
                            <p class="justify white-text">
                                {{ review.description | truncate300 }} 
                                <a :href="`#modal-center-${ix}`" uk-toggle
                                    style="cursor: pointer; 
                                           color: #b0bec5; 
                                           font-weight: bold; 
                                           text-decoration: underline" 
                                    >Lihat
                                </a>
                            </p>

                            <div :id="`modal-center-${ix}`" class="uk-flex-top" uk-modal>
                                <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"   
                                    :style="{ background: boxColor }">

                                    <button class="uk-modal-close-default" type="button" uk-close style="color: white"></button>

                                    <div v-if="review.date">
                                        <p><span class="md-caption">{{ review.date.seconds | dateFormat }}</span></p>
                                    </div>
                                    <p class="white-text">
                                        {{ review.description }}
                                    </p>
                                    <span class="md-caption">{{ review.author.email }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p class="justify">{{ review.description }}</p>
                        </div>
                        <span class="md-caption">{{ review.author.email }}</span>
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </div>
</template>

<script>
import dateFormat from '~/plugins/mixins/dateFormat'
import truncate300 from '~/plugins/mixins/truncate300'

export default {
    mixins: [dateFormat, truncate300],
    data() {
        return {
            boxColor: '#767D92' // Slay Gray
        }
    },
    props: ['reviewBox'],
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
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
            vertical-align: top;
        }
    }
</style>