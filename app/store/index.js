export const state = () => ({
  user: null
})

export const mutations = {
  logInMutation(state, user) {
    state.user = user
  }
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const token = this.$cookies.get('token')
    if (token) {
      await this.$axios
        .post(`${process.env.URL_SERVER}/api/auth/token`, { token })
        .then(({ data }) => {
          this.$cookies.set('token', data.data.token)
          commit('logInMutation', data.data)
        })
    }
  },
  logInAction({ commit }, payload) {
    commit('logInMutation', payload)
  }
}
