<template>
    <div>
        <span class="md-display-1 center">Penelusuran</span>

        <p class="title">
            <span class="md-headline">Hot Trend This Week</span>
        </p>
        <app-carousel-header :type="'item'"
                             :data="carousels.header.hotTrendThisWeek"
        ></app-carousel-header>

        <!-- ITEM CATEGORIES OPTION -->
        <p class="title">
            <span class="md-headline">Barang</span>
        </p>
        <app-categories-option :type="'item'"
                               :data="productCategories"
        ></app-categories-option>

        <p class="title">
            <span class="md-headline">Merchant Terbaik</span>
        </p>
        <app-carousel-list :type="'merchant'"
                           :data="carousels.list.merchant.best"
        ></app-carousel-list>

        <p class="title">
            <span class="md-headline">Top Item</span>
        </p>
        <app-carousel-horizontal :type="'item'"
                                 :data="carousels.horizontal.item.top"
        ></app-carousel-horizontal>

        <div style="height: 125px;"></div>
    </div>
</template>

<script>
import itemtCategories from '~/plugins/mixins/item/categories'

import AppCategoriesOption from '@/components/categoriesOption'
import AppCarouselHeader from '@/components/carousels/header'
import AppCarouselList from '@/components/carousels/list'
import AppCarouselHorizontal from '@/components/carousels/horizontal'

export default {
    mixins: [itemtCategories],
    components: { 
        AppCategoriesOption,
        AppCarouselHeader,
        AppCarouselList,
        AppCarouselHorizontal 
    },
    data() {
        return {
            carousels: {
                header: {
                    hotTrendThisWeek: 
                    [
                        {
                            id: 'RoZn3VQHfPtRHhv8TDHj',
                            name: 'Milky Popcorn',
                            category: 'Makanan & Minuman',
                            icon: 'https://firebasestorage.googleapis.com/v0/b/stonary8.appspot.com/o/items%2FRoZn3VQHfPtRHhv8TDHj%2Ficon%2FScreen%20Shot%202019-12-30%20at%2020.27.19.png_1577778361687_1?alt=media&token=7d2135e7-aa10-4f26-ad6d-bc0394b10513',
                            price: '192000'
                        },
                        {
                            id: '2',
                            name: 'Title 2',
                            category: 'Caption 1',
                            icon: 'https://picsum.photos/200/300',
                            price: '1234'
                        },
                        {
                            id: '3',
                            name: 'Title 3',
                            category: 'Caption 1',
                            icon: 'https://picsum.photos/200/300',
                            price: '1234'
                        }
                    ]
                },
                list: {
                    merchant: {
                        best: 
                        [
                            [ 
                                // MAX 3 ITEMS 
                                {
                                    id: 'Gog4tnCQxLjmp24CbxVo',
                                    name: 'Australian Tea Company',
                                    category: 'Kesehatan & Kecantikan',
                                    icon: 'https://firebasestorage.googleapis.com/v0/b/stonary8.appspot.com/o/merchants%2FGog4tnCQxLjmp24CbxVo%2Ficon%2FScreen%20Shot%202019-12-31%20at%2013.08.40.png_1577773208480_1?alt=media&token=21ce94e4-3688-4c2d-8275-43648bf75c24',
                                    location: {
                                        address: 'No.35-37, Jl. Dharmahusada Indah Timur, Mulyorejo, Kec. Mulyorejo, Kota SBY, Jawa Timur, ID, 60115'
                                    }
                                },
                                {
                                    id: '2',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    location: {
                                        address: 'Kusuma Bangsa'
                                    }
                                },
                                {
                                    id: '3',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    location: {
                                        address: 'Kusuma Bangsa'
                                    }
                                }
                            ], 
                            [
                                // MAX 3 ITEMS  
                                {
                                    id: '4',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    location: {
                                        address: 'Kusuma Bangsa'
                                    }
                                },
                                {
                                    id: '5',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    location: {
                                        address: 'Kusuma Bangsa'
                                    }
                                },
                                {
                                    id: '6',
                                    name: 'Title 1',
                                    category: 'Caption 1',
                                    icon: 'https://picsum.photos/200/300',
                                    location: {
                                        address: 'Kusuma Bangsa'
                                    }
                                }
                            ]
                        ]
                    }
                },
                horizontal: {
                    item: {
                        top: 
                        [
                            {
                                id: '1',
                                name: 'Title 1',
                                category: 'Caption 1',
                                icon: 'https://picsum.photos/200/300',
                                price: '1234'
                            },
                            {
                                id: '1',
                                name: 'Title 2',
                                category: 'Caption 2',
                                icon: 'https://picsum.photos/200/300',
                                price: '1234'
                            },
                            {
                                id: '1',
                                name: 'Title 3',
                                category: 'Caption 3',
                                icon: 'https://picsum.photos/200/300',
                                price: '1234'
                            }
                        ]
                    }
                }
            }
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
    .title { margin-top: 2em; }
</style>
