<template>
     <div style="margin-top: .5em;">
        <!-- 6 Objects As Preview -->
        <div class="md-layout md-gutter md-alignment-center">
            <div class="category-box md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-50"
                v-for="(c, index) in data"
                :key="c">
                <nuxt-link :to="`explore/category?q=${c.name}`"
                    class="link">
                    <div v-show="index < 6 || show"
                        class="card" :style="{ 'background' : c.background }">
                        <span class="title">{{ c.name }}</span>
                    </div>
                </nuxt-link>
            </div>

            <md-button @click="showMore"
                style="margin-left:auto; margin-right:0; margin-bottom: 0"
                :style="{ 'marginTop': marginTop}"> 
                    {{ show == true ? 'Tutup' : 'Tampilkan Lagi' }}
            </md-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            show: false,
            marginTop: '-28.5px'
        }
    },
    methods: {
        showMore() {
            if(this.show) { this.marginTop = '-28.5px'; this.show = false; }
            else { this.marginTop = '0px'; this.show = true;  }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~/assets/styles/breakpoint.scss';

    .category-box {
        padding: .5em;
        
        .card {
            max-width: 300px;
            border-radius: .5em;
            height: 75px;
            display: flex;
            justify-content: center;
            align-items: center;

            .title {
                text-align: center;
                font-size: 5vw; 
                @include layout-small-and-up { font-size: 1em; }
            }
        }

        .link {
            color: white;

            &:hover {
                color: #cdcdcd;
                font-weight: bold;
                text-decoration: none; 

                div {
                    opacity: .75;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                } 
            }
        }
    }
</style>
