<template>
    <div>
        <a :href="`#${data.id}`" class="uk-link-reset" uk-toggle>
            <md-card md-with-hover class="md-elevation-7">
                <md-card-media-cover>
                    <md-ripple>
                        <md-card-media md-ratio="16:9" style="border-radius: 1em;">
                            <img class="img-cover"
                                :src="data.img.src" 
                                :alt="data.img.alt">
                        </md-card-media>

                        <md-card-area>
                            <md-card-header>
                                <span class="md-title">
                                    <strong>{{ data.title }}</strong>
                                </span>
                                <span class="md-subhead">
                                    {{ data.subtitle }}
                                </span>
                            </md-card-header>
                        </md-card-area>
                    </md-ripple>
                </md-card-media-cover>
            </md-card>
        </a>

        <div :id="`${data.id}`" class="uk-modal-full" uk-modal>
            <div class="uk-background-secondary uk-modal-dialog">
                <button class="uk-modal-close-full uk-close-large" type="button" uk-close style="background: transparent;"></button>
                <div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>
                    <div class="uk-background-cover" :style="{'background-image': `url(${data.img.src})`}" uk-height-viewport="offset-bottom: 350px"></div>
                    <div class="uk-padding-large">
                        <h1>{{ data.title }}</h1>
                        <h4 class="uk-text-normal uk-text-muted">{{ data.subtitle }}</h4>
                        <slot name="dialog-content"></slot>

                        <div class="center" style="margin-top: 2em;">
                            <md-menu md-direction="top-start">
                                <md-button md-menu-trigger>
                                    <md-icon>share</md-icon>
                                    Bagikan Cerita
                                </md-button>
                                <md-menu-content style="z-index: 999999">
                                    <app-story-sharing :data="data"
                                    ></app-story-sharing>
                                </md-menu-content>
                            </md-menu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppStorySharing from '@/components/cards/storySharing'

export default {
    props: ['data']
}
</script>

<style lang="scss" scoped>
  .md-card {
    border-radius: 1em;
    margin-bottom: 1em;
    min-height: 250px;

    .md-card-media, .img-cover { 
        border-radius: 1em; 
        height: 300px;
    }
  }

  .md-button {
      margin: 0 auto;
      border-radius: 1em;
      background: #424242;
      text-transform: capitalize;
  }
</style>