import vue from 'vue'
import Vuex from 'vuex'

vue.use(Vuex)

var state = {
  url_ip: 'http://192.168.8.14'
}
var muations = {
}

const store = new Vuex.Store(
  {
    state,
    muations
  }
)

export default store
