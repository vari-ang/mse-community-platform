export const state = () => ({
    // Logged in user
    user: {
        id: null,
        email: null,
        photoUrl: '~/assets/images/anonymous.png',
        total_bookmarks: 0,
        contribution_points: 0,
        total_posts: 0,
        total_reviews: 0,
        total_edits: 0,
    }
})

export const mutations = {
    // Set log in user
    setUser(state, obj) {
      state.user = obj;
    },
    logOutUser(state) {
        state.user.id = null;
        state.user.email = null;
        state.user.photoUrl = null;
        state.user.total_bookmarks = 0;
        state.user.contribution_points = 0;
        state.user.total_posts = 0;
        state.user.total_edits = 0;
        state.user.total_reviews = 0;
    }
  }