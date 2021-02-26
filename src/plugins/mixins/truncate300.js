export default {
    filters: {
        truncate300(words) {
            return _.truncate(words, {
                'length': 300,
              });
        }
    }
}