export const actions = {
  async saveNote (ctx, payload) {
    try {
      const { data } = await this.$axios.post('/manuals/note', payload)
      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
