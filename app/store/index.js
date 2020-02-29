export const state = () => ({
  user: null,
  favorites: null
})

export const mutations = {
  logInMutation(state, user) {
    state.user = user
  },
  setFavoritesMutation(state, favorites) {
    state.favorites = favorites
  }
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const token = this.$cookies.get('token')
    if (token) {
      await this.$axios
        .post(`${process.env.URL_SERVER}/api/auth/token`, { token })
        .then(({ data }) => {
          this.$cookies.set('token', data.data.user.token)
          commit('logInMutation', data.data.user)
          commit('setFavoritesMutation', data.data.favorites)
        })
    }
  },
  logInAction({ commit }, payload) {
    commit('logInMutation', payload)
  },
  setFavoritesAction({ commit }, payload) {
    commit('setFavoritesMutation', payload)
  }
}
