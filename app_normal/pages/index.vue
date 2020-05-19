<template>
  <div class="myContainer">
    <div>
      <h1 class="title">
        ニジボックス アワード投票
      </h1>
      <h2 class="subtitle">
        Please wait....
      </h2>
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { generalStateModule } from '~/store/modules/general'

@Component({
  layout: 'plane'
})
export default class IndexPage extends Vue {
  mounted() {
    if (generalStateModule.isAuthorized) {
      this.$router.push({ path: '/main' })
    } else {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style scoped lang="scss">
.myContainer {
  margin-top: 260px;
}
</style>
