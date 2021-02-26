<template>
    <div class="app-carousel">
        <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1" uk-slider="center: true; autoplay: true; autoplay-interval: 6000">
            <ul class="uk-slider-items uk-grid">
                <li class="uk-width-3-4"
                    v-for="obj in data"
                    :key="obj.id">
                    <nuxt-link :to="`/${type}/${obj.id}`" 
                        class="uk-link-reset">
                        <div class="uk-panel">
                            <!-- Text on header image -->
                            <div>
                                <!-- Name -->
                                <h3 class="uk-card-title uk-text-truncate">{{ obj.name }}</h3>

                                <!-- Category -->
                                <span class="uk-text-meta uk-text-truncate">{{ obj.category }}</span><br>

                                <span v-if="type == 'item'" class="uk-text-light uk-text-truncate">Rp. {{ obj.price | thousandsSeparator }}</span>
                                <span v-else class="uk-text-light uk-text-truncate">{{ obj.location.address }}</span>
                            </div>
                            <div style="margin-top: 1em">
                                <img :src="obj.icon" 
                                    :alt="obj.name">
                            </div>  
                        </div>
                    </nuxt-link>
                </li>
            </ul>

            <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
            <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
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

    .uk-card-title { margin: 0; }

    img { 
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        border-radius: 1em;
    }

    @include layout-xsmall-and-up { img { height: 225px; } }
    @include layout-medium-and-up { img { height: 300px; } }
</style>