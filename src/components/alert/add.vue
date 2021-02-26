<template>
    <div class="uk-alert-warning alert" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p class="center">
            <md-icon>warning</md-icon>
            Dengan menekan tombol tambah di atas, maka Anda setuju bahwa segala informasi mengenai 
            produk, jasa, atau merchant yang ingin Anda ditambahkan layak untuk diogranisir oleh komunitas.
        </p>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .alert {
        padding: 0.5em;
        border-radius: 1em;
        .md-icon { color: #ffc107; }
    }
</style>

