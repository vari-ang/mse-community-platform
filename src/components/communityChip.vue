<template>    
    <div class="community-chip">
        <div class="chip">
            <span class="uk-badge chip-text">
                Didukung Komunitas
            </span>
            <md-tooltip md-direction="top" 
                        class="center"
                        style="height: auto;">
                Informasi diorganisir secara terbuka <br>oleh komunitas (termasuk Anda)
            </md-tooltip>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .community-chip {
        .chip { 
            float: right; 
            .chip-text { 
                padding: 0.75em;
                font-weight: bold;
            }
        }
    }
</style>

