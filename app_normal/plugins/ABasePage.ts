import { Component, Vue } from 'vue-property-decorator'
import { generalStateModule } from '~/store/modules/general'
import AppUtil from '~/plugins/AppUtil'

export default class ABasePage extends Vue {
  protected commonBeforeMount() {
    if (!generalStateModule.isAuthorized) {
      return this.$router.push({ path: '/login' })
    } else {
      return Promise.resolve(true)
    }
  }

}
