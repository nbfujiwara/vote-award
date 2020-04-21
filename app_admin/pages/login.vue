<template>
  <div class="myContainer">
    <div id="firebase-ui-container"></div>
    <div v-if="isAuthorized && isSuccessCallback && !hasRole">
      <v-alert class="warning ma-10"
        >認証されたアカウントは権限を持ちません。コンソールから権限付与してください</v-alert
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppUtil from '~/plugins/AppUtil'
import { generalStateModule } from '~/store/modules/general'

@Component({
  layout: 'plane'
})
export default class LoginPage extends Vue {
  isSuccessCallback: boolean = false

  get isAuthorized() {
    return generalStateModule.isAuthorized
  }

  get hasRole() {
    return generalStateModule.hasRole
  }

  beforeMount() {}
  mounted() {
    this.isSuccessCallback = false
    AppUtil.startAuthUI(
      '#firebase-ui-container',
      () => {
        this.isSuccessCallback = true
        if (generalStateModule.isAuthorized && generalStateModule.hasRole) {
          this.$router.push({ path: '/home' })
        }
      },
      () => {}
    )
  }
}
</script>

<style scoped lang="scss">
.myContainer {
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
