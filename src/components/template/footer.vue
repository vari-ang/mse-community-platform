<template>
    <div class="footer-box justify">
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-100" style="margin-bottom: 1.5em;">
                <span class="md-display-1">Stonary</span>
            </div>
            <div class="md-layout-item md-medium-size-66 md-small-size-66 md-xsmall-size-100">
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
                        <!-- About -->
                        <section>
                            <p>
                                <nuxt-link to="/about" class="uk-link-reset">
                                    <span class="white-text">Tentang Kami</span>
                                </nuxt-link>
                            </p>
                            <p>
                                <nuxt-link to="/about/privacy" class="uk-link-reset">
                                    <span class="white-text">Privasi</span>
                                </nuxt-link>
                            </p>
                            <p>
                                <nuxt-link to="/about/terms" class="uk-link-reset">
                                    <span class="white-text">Kebijakan Pengguna</span>
                                </nuxt-link>
                            </p>
                        </section>
                    </div>
                    <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
                        <!-- Contact Information -->
                        <div class="height-spacing" style="height: 25px;"></div>

                        <section>
                            <p>
                                <span class="fa fa-envelope"></span> &nbsp;
                                <a href="mailto:stonaryapp@gmail.com" class="uk-link-reset"><strong>stonaryapp@gmail.com</strong></a>
                            </p>
                            <p>
                                <span class="fa fa-instagram"></span> &nbsp;
                                <a href="https://www.instagram.com/stonaryofficial/" class="uk-link-reset" target="_blank"><strong>stonaryofficial</strong></a>
                            </p>
                            <p>
                                <span class="fa fa-map-marker"></span> &nbsp;
                                Surabaya, Jawa Timur, Indonesia
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <div class="md-layout-item md-medium-size-100 md-small-size-100 md-xsmall-size-100">
                <div class="center copyright">
                    <hr>
                    <p class="grey-text" style="margin-top: 1em;">
                        Copyright © 2020 Stonary. All rights reserved
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    @import '~/assets/styles/breakpoint.scss';

    .footer-box {
        background: black;
        padding: 35px;
        display: block;
        width: 100%;
        height: auto;

        .height-spacing { 
            @include layout-medium-and-up { display: none; }
        }

        .copyright { height: 75px; }
    }
</style>