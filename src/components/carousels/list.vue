<template>
    <div class="app-carousel">
        <div uk-slider="center: true">
            <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1">
                <ul class="uk-slider-items uk-child-width-1-2@s uk-grid">
                    <li v-for="arr in data"
                        :key=arr.id>
                        <div class="uk-card">
                            <div class="uk-card-body">
                                <dl class="uk-description-list uk-description-list-divider"
                                    v-for="obj in arr"
                                    :key=obj.id>
                                    <nuxt-link :to="`/${type}/${obj.id}`" 
                                               class="uk-link-reset">
                                        <dt>
                                            <md-list-item>
                                                <md-avatar class="icon">
                                                    <img :src="obj.icon" :alt="obj.name">
                                                </md-avatar>

                                                <div class="md-list-item-text icon">
                                                    <!-- Name -->
                                                    <h3 class="uk-card-title uk-text-truncate">{{ obj.name }}</h3>

                                                    <!-- Category -->
                                                    <span class="uk-text-meta uk-text-truncate">{{ obj.category }}</span><br>

                                                    <span v-if="type == 'item'" class="uk-text-light uk-text-truncate">Rp. {{ obj.price | thousandsSeparator }}</span>
                                                    <span v-else class="uk-text-light uk-text-truncate">{{ obj.location.address }}</span>
                                                </div>
                                            </md-list-item>
                                        </dt>
                                    </nuxt-link>
                                </dl>
                            </div>
                        </div>
                    </li>
                </ul>

                <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
                <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
            </div>
        </div>
    </div>
</template>

<script>
import thousandsSeparator from '~/plugins/mixins/thousandsSeparator'

export default {
    // type prop is whether `item` or `merchant`
    props: ['type', 'data'],
    mixins: [thousandsSeparator],
    data() {
        return {
            
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~/assets/styles/breakpoint.scss';

    .uk-card-body { padding: 0px; }
    .uk-text-light { 
        margin-top: -15px; 
        color: #cdcdcd; 
        font-size: .9em; 
    }

    .icon {
        position: absoulte;
        height: auto;
        width: 5.5em;
        margin-left: -1em;

        @include layout-xsmall-and-up { 
            img { border-radius: .65em; width: 75px; height: 75px; } 
        }
        @include layout-medium-and-up { 
            img { border-radius: .85em; width: 100px; height: 100px; } 
        }
    }
</style>