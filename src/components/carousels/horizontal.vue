<template>
    <div class="app-carousel horizontal-scrolling">
        <div v-for="obj in data"
            :key="obj.id"
            class="card">
            <nuxt-link :to="`/${type}/${obj.id}`" 
                        class="uk-link-reset">
                <div class="uk-card">
                    <div class="uk-card-media-top">
                        <img :src="obj.icon" :alt="obj.name">
                    </div>
                    <div class="uk-card-body">
                        <!-- Name -->
                        <h3 class="uk-card-title">{{ obj.name }}</h3>

                        <!-- Category -->
                        <span class="uk-text-meta">{{ obj.category }}</span><br>

                        <span v-if="type == 'item'" class="uk-text-light uk-text-truncate">Rp. {{ obj.price | thousandsSeparator }}</span>
                        <span v-else class="uk-text-light" style="color: #cdcdcd">
                            {{ obj.location.address }}
                        </span>
                    </div>
                </div>
            </nuxt-link>
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
    .horizontal-scrolling {
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;

        .card {
            max-width: 225px;
            flex: 0 0 auto;
            margin-right: 1em;
            margin-bottom: 1.5em;

            .uk-card-title { margin: -20px 0 0 0; }
            .uk-text-light { color: #cdcdcd; }

            img { 
                border-radius: 1em;
                width: 100%; 
                height: 175px; 
            }
        }
    }
</style>