<template>
    <social-sharing :url="`https://stonary.com/${type}/${data.id}`"
                    :title="`${data.name}`"
                    :description="`${data.description}`"
                    quote="Small Is The New Big"
                    hashtags="Stonary,Komunitas,Berkontribusi,UMKM,DampakSosial"
                    twitter-user="stonaryofficial"
                    inline-template>
        <div class="social-sharing-box">
            <dl class="uk-description-list">
                <dt>
                    <a class="uk-link-reset">
                        <network network="whatsapp">
                            <i class="fa fa-whatsapp" style="color: #81c784"></i> 
                            &nbsp;<span style="color: white; text-transform: none">WhatsApp</span>
                        </network>
                    </a>
                </dt> 
                <dt>
                    <a class="uk-link-reset">
                        <network network="line">
                            <!-- <i class="fa fa-line"></i>  -->
                            <img src="https://cdn.worldvectorlogo.com/logos/line-messenger.svg" width="15px" height="15px" />
                            &nbsp;<span style="color: white; text-transform: none">Line</span>
                        </network>
                    </a>
                </dt>
                <dt>
                    <a class="uk-link-reset">
                        <network network="facebook">
                            <i class="fa fa-facebook" style="color: #1565c0;"></i> 
                            &nbsp;<span style="color: white; text-transform: none">Facebook</span>
                        </network>
                    </a>
                </dt>
                <dt>
                    <a class="uk-link-reset">
                        <network network="twitter">
                            <i class="fa fa-twitter" style="color: #1DA1F2"></i> 
                            &nbsp;<span style="color: white; text-transform: none">Twitter</span>
                        </network>
                    </a>
                </dt>
                <dt>
                    <a class="uk-link-reset">
                        <network network="pinterest">
                            <i class="fa fa-pinterest" style="color: #c8232c"></i> 
                            &nbsp;<span style="color: white; text-transform: none">Pinterest</span>
                        </network>
                    </a>
                </dt>
                <dt>
                    <a class="uk-link-reset">
                        <network network="email">
                            <i class="fa fa-envelope"></i> 
                            &nbsp;<span style="color: white; text-transform: none">Email</span>
                        </network>
                    </a>
                </dt>
            </dl>
        </div>
    </social-sharing>
</template>

<script>
import SocialSharing from 'vue-social-sharing'

export default {
    // type prop is whether `item` or `merchant`
    props: ['type', 'data'],
    components: { SocialSharing }
}
</script>

<style lang="scss" scoped>
    .social-sharing-box {
        padding: 1em;
    }
</style>