let store = {}
const {get} = require('lodash')

/**
 * - Memory is stored as a set of {role, content} objects
 */
module.exports = {
  store,

  /**
   * Pushes a message to the end of the memory
   * @param {*} val The message to store
   * @param {*} context (optional) The context (eg user or channel id) to store the message under
   * 
   * @returns {*} The message that was stored
   */
  push (val, context = '$') {
    if (!store[context]) {
      store[context] = []
    }
    get(store, context, []).push(val)

    return val
  },

  /**
   * Gets the memory at a given path
   */
  get (path = '$') {
    return get(store, path, [])
  },

  /**
   * Clears all memory
   */
  clear () {
    Object.keys(store).forEach(key => delete store[key])
  }
}