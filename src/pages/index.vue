<template>
  <div>
    <!-- App Introduction -->
    <div class="card-container">
      <p class="headline-text">
        <span class="md-headline">Pengantar</span>
      </p>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-image-on-top :data="intro.about">
            <div slot="dialog-content" class="justify">
              <div>
                <p>
                  <span class="yellow-text">Stonary</span> merupakan sebuah platform layanan yang didirikan dengan tujuan untuk mengembangkan usaha mikro dan kecil di Indonesia melalui bantuan <span class="yellow-text">komunitas</span>.
                </p>
                <p>
                  <strong>Visi kami adalah memberikan dampak sosial kepada para pelaku usaha mikro dan kecil di Indonesia untuk menjangkau lebih banyak konsumen potensial.</strong> 
                  Hal ini kami lakukan melalui penyediaan platform sebagai media penyediaan informasi produk dan usaha kecil lokal yang dikelola bersama oleh komunitas secara bebas.
                </p>
                <p>
                  Sejak dahulu, konsumen dan para pelaku usaha berskala kecil tidak terhubungkan secara efektif. 
                  Banyak barang dan jasa lokal yang bermanfaat untuk memenuhi kebutuhan namun terlewatkan karena tidak diketahui keberadaannya.
                  Hal ini dikarenakan minimnya informasi akan barang, jasa, dan usaha kecil yang tersedia untuk diakses oleh publik. 
                </p>
                <p>
                  Platform ini pun dibentuk sehingga seluruh masyarakat dapat secara mudah melihat, menambahkan, dan mengubah informasi terkait barang, jasa, dan Usaha Mikro dan Kecil.
                </p>
                <p>
                  Semakin banyak informasi yang dikelola pada platform ini, maka:
                  <ul style="padding: 0 25px;">
                    <li style="margin: 5px 0;">Semakin banyak konsumen yang berhasil menemukan solusi yang pas untuk kebutuhan mereka.</li>
                    <li>Banyak pahala yang kita kumpulkan karena telah membantu puluhan juta pedagang kecil lokal untuk berkembang.</li>
                  </ul>
                </p>

                <p>
                  <span class="md-headline grey-text">Bergabunglah ke Dalam Komunitas Besar Stonary</span>
                </p>
                <p>Kami sudah tidak sabar menyambut kamu ke dalam keluarga besar Stonary &#128513;</p>
                <p>Kita akan bersama - sama mengelola informasi mengenai barang, jasa dan pedagang kecil di Indonesia yang tidak memiliki sumber daya yang baik.</p>
                <p>Percayalah, pada akhirnya ekonomi Indonesia akan sangat kuat jika kita terus berjuang untuk mengelola informasi yang ada di Stonary.</p>
              </div>
              
              <div class="center" style="margin-top: 5em;">
                <p>
                  Hubungi Kami: 
                  <a href="mailto:stonaryapp@gmail.com" class="uk-link-reset">
                      <strong class="grey-text">stonaryapp@gmail.com</strong>
                  </a>
                </p>
                <p>
                  <span style="margin-right: 1.5em;">
                    <nuxt-link to="/about" class="uk-link-reset">
                      <span class="grey-text">• Tentang Kami</span>
                    </nuxt-link>
                  </span>
                  <span style="margin-right: 1.5em;">
                    <nuxt-link to="/about/privacy" class="uk-link-reset">
                      <span class="grey-text">• Privasi</span>
                    </nuxt-link>
                  </span>
                  <span>
                    <nuxt-link to="/about/terms" class="uk-link-reset">
                      <span class="grey-text">• Kebijakan Pengguna</span>
                    </nuxt-link>
                  </span>
                </p>
                <p>
                  <span class="md-caption">
                    Copyright &copy; 2020 Stonary. All rights reserved
                  </span>
                </p>
              </div>
            </div>
          </app-card-image-on-top>
        </div>
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-image-on-top :data="intro.howToContribute">
            <div slot="dialog-content" class="justify">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
              <p>Saepe, quos? Distinctio, ut! Earum provident quis, sit animi repellat ex similique quam illum hic obcaecati quae.</p> 
              <p>In cum totam ipsum excepturi non natus facilis, quisquam accusamus eaque nemo reiciendis, a nulla iste architecto consequatur explicabo error, iure dignissimos dicta consectetur maxime.</p> 
              <p>Placeat iure dolorem quibusdam ipsam quam asperiores voluptas aliquid.</p> 
              <p>Quas consectetur, atque natus, asperiores commodi facilis cupiditate ex doloribus, saepe sit dicta quia corrupti similique? Nesciunt alias et veniam. Ut veritatis voluptas consequatur libero fuga rem necessitatibus! Nulla aperiam ad aliquam sunt perferendis?</p> 
              <p>Inventore pariatur dolorum harum eligendi nulla quidem?</p>
            </div>
          </app-card-image-on-top>
        </div>
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-image-on-top :data="intro.impact">
            <div slot="dialog-content" class="justify">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
              <p>Saepe, quos? Distinctio, ut! Earum provident quis, sit animi repellat ex similique quam illum hic obcaecati quae.</p> 
              <p>In cum totam ipsum excepturi non natus facilis, quisquam accusamus eaque nemo reiciendis, a nulla iste architecto consequatur explicabo error, iure dignissimos dicta consectetur maxime.</p> 
              <p>Placeat iure dolorem quibusdam ipsam quam asperiores voluptas aliquid.</p> 
              <p>Quas consectetur, atque natus, asperiores commodi facilis cupiditate ex doloribus, saepe sit dicta quia corrupti similique? Nesciunt alias et veniam. Ut veritatis voluptas consequatur libero fuga rem necessitatibus! Nulla aperiam ad aliquam sunt perferendis?</p> 
              <p>Inventore pariatur dolorum harum eligendi nulla quidem?</p>
            </div>
          </app-card-image-on-top>
        </div>
      </div>
    </div>

    <!-- This Week Favorite -->
    <div class="card-container">
      <p class="headline-text">
        <span class="md-headline">Terfavorit Minggu Ini</span>
      </p>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-image-on-top :data="fav1">
            <div slot="dialog-content" class="justify">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
              <p>Saepe, quos? Distinctio, ut! Earum provident quis, sit animi repellat ex similique quam illum hic obcaecati quae.</p> 
              <p>In cum totam ipsum excepturi non natus facilis, quisquam accusamus eaque nemo reiciendis, a nulla iste architecto consequatur explicabo error, iure dignissimos dicta consectetur maxime.</p> 
              <p>Placeat iure dolorem quibusdam ipsam quam asperiores voluptas aliquid.</p> 
              <p>Quas consectetur, atque natus, asperiores commodi facilis cupiditate ex doloribus, saepe sit dicta quia corrupti similique? Nesciunt alias et veniam. Ut veritatis voluptas consequatur libero fuga rem necessitatibus! Nulla aperiam ad aliquam sunt perferendis?</p> 
              <p>Inventore pariatur dolorum harum eligendi nulla quidem?</p>
            </div>
          </app-card-image-on-top>
        </div>
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-image-only :data="fav2">
            <div slot="dialog-content" class="justify">
              <p>hey</p>
              <p>hello</p>
            </div>
          </app-card-image-only>
        </div>
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-media-big-size :data="fav3">
            <div slot="dialog-content" class="justify">
              <p>hey</p>
              <p>hello</p>
            </div>
          </app-card-media-big-size>
        </div>
        <div class="md-layout-item md-large-size-33 md-small-size-50 md-xsmall-size-100">
          <app-card-image-with-text :data="fav4">
            <div slot="dialog-content" class="justify">
              <p>hey</p>
              <p>hello</p>
            </div>
          </app-card-image-with-text>
        </div>
      </div>
    </div>

    <div class="card-container">
      <p class="headline-text">
        <span class="md-headline">Tren Hot Terkini</span>
      </p>
    </div>

    <div class="card-container">
      <p class="headline-text">
        <span class="md-headline">Pilihan Penulis</span>
      </p>
    </div>

    <div style="height: 125px;"></div>
  </div>
</template>

<script>
import AppCardImageOnTop from '@/components/cards/imageOnTop'
import AppCardImageOnly from '@/components/cards/imageOnly'
import AppCardMediaBigSize from '@/components/cards/mediaBigSize'
import AppCardImageWithText from '@/components/cards/imageWithText'

export default {
  components: { 
    AppCardImageOnTop, 
    AppCardImageOnly,
    AppCardMediaBigSize,
    AppCardImageWithText 
  },
  mounted() {
    if($nuxt.$route.hash) UIkit.modal(`${$nuxt.$route.hash}`).show();
  },
  data() {
    return {
      intro: {
        about: {
          id: 'stonary-itu-sebenarnya-apa-sih',
          title: "Stonary Itu Sebenarnya Apa Sih ?",
          subtitle: 'Yuk! Kenalan Lebih Dekat Dengan Kami',
          img: {
            src: 'https://firebasestorage.googleapis.com/v0/b/stonary8.appspot.com/o/assets%2Fimages%2Fhomes%2Ffriends.jpeg?alt=media&token=6b5dc00b-a9fd-41b3-80a0-e495fda5a511',
            alt: 'Komunitas Stonary'
          }
        },
        howToContribute: {
          id: 'cara-berkontribusi-di-stonary',
          title: 'Cara Berkontribusi Di Stonary',
          subtitle: 'Kini Semakin Mudah Membantu Para Pelaku Usaha Kecil',
          img: {
            src: 'https://firebasestorage.googleapis.com/v0/b/stonary8.appspot.com/o/assets%2Fimages%2Fhomes%2Fteam_work.jpeg?alt=media&token=052d3fcc-8a19-4bf2-abf0-bcfadf323cb1',
            alt: 'Berkontribusi'
          }
        },
        impact: {
          id: 'dampak-positif-kontribusimu',
          title: 'Dampak Positif Kontribusimu',
          subtitle: 'Banyak sekali lho manfaat baik untuk kamu sendiri dan sekitarmu',
          img: {
            src: 'https://firebasestorage.googleapis.com/v0/b/stonary8.appspot.com/o/assets%2Fimages%2Fhomes%2Fimpact.jpeg?alt=media&token=a5fee2c1-aa30-4817-895f-eca56336f218',
            alt: 'Berkontribusi'
          }
        }
      },
      fav1: {
        id: 'hello-world',
        title: 'Hello World',
        subtitle: 'Nice To Meet You',
        img: {
          src: 'https://picsum.photos/200/200',
          alt: 'Komunitas'
        }
      },
      fav2: {
        id: 'hahahaha',
        title: 'Hahahaha :)',
        subtitle: 'Whats up Bro?',
        img: {
          src: 'https://picsum.photos/seed/picsum/200/200',
          alt: 'Pemandangan'
        }
      },
      fav3: {
        id: 'cute',
        title: 'Cute >,<',
        subtitle: 'Lucuuuuu Unyuuu',
        img: {
          src: 'https://picsum.photos/id/1084/200/200?grayscale',
          alt: 'Walrus'
        }
      },
      fav4: {
        id: 'coffee-mania',
        title: 'Coffee Mania',
        subtitle: "Never trust anyone who doesn't drink coffee",
        img: {
          src: 'https://picsum.photos/id/1060/200/200',
          alt: 'Kopi'
        }
      }
    }
  },
  methods: {
   
  }
}
</script>

<style lang="scss" scoped>
  .card-container {
    margin-top: 1em;

    .headline-text { margin-left: 1em; }
    .md-layout-item { margin-bottom: 1em; }
  }
</style>