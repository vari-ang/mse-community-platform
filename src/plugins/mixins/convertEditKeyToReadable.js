export default {
    filters: {
        convertEditKeyToReadable(key) {
            switch(key) {
                case 'icon':
                    return 'Logo';
                case 'name':
                    return 'Nama';
                case 'category':
                    return 'Kategori';
                case 'description':
                    return 'Deskripsi';
                case 'price':
                    return 'Harga';
                case 'location':
                    return 'Lokasi';
                case 'location':
                    return 'Lokasi';
                case 'operatingHours':
                    return 'Jam Operasional';
                case 'phoneNumber':
                    return 'No Telepon'
                default: 
                    return;
            }
        }
    }
}