let store = {}

module.exports = {
  store,
  clear () {
    Object.keys(store).forEach(key => delete store[key])
  }
}