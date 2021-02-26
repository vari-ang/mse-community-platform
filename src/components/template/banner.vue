<template>
    <div class="hero-image">
        <div class="hero-text">
            <h2>Platform Berbasis <span class="yellow-text">Komunitas</span></h2>
            <p>Membantu Usaha Mikro dan Kecil Indonesia Untuk Berkembang</p>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.hero-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://firebasestorage.googleapis.com/v0/b/stonary8.appspot.com/o/assets%2Fimages%2Fhomes%2Fcommunity.jpg?alt=media&token=ecc5ba86-8468-4476-9129-4a724653c7a4");
  height: 250px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

    .hero-text {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: normal;
        color: white;

        p { margin-top: 1em; }
    }
}
</style>