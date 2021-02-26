<template>
    <div class="uk-alert-primary alert center" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p class="center">
            <md-icon>info</md-icon>
            Perubahan informasi akan diterapkan bila sudah disetujui oleh 3 orang lainnya 
        </p>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .alert {
        margin-top: 1em;
        width: 90%;
        padding: 0.5em;
        border-radius: 1em;
        .md-icon { color: #2196f3; }
    }
</style>

