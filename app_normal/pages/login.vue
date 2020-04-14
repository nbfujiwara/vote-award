<template>
  <div class="myContainer">
    <div id="firebase-ui-container"></div>
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
  showCaption: boolean = false

  beforeMount() {}
  mounted() {
    this.showCaption = false
    AppUtil.startAuthUI(
      '#firebase-ui-container',
      () => {
        if (generalStateModule.isAuthorized) {
          this.$router.push({ path: '/main' })
        }
      },
      () => {
        this.showCaption = true
      }
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
