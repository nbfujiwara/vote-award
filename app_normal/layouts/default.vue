<template>
  <v-app light>
    <v-content>
      <v-container fluid fill-height pa-0 class="rootContainer text-center">
        <div class="bgTop">
          <div class="headerWrap">
            <img class="logo" src="~static/title.svg" />
          </div>
        </div>
        <div class="pageContainer">
          <nuxt />
        </div>
      </v-container>
    </v-content>
    <page-toast></page-toast>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    PageToast: () => import('~/components/PageToast.vue')
  }
})
export default class DefaultLayout extends Vue {}
</script>

<style scoped lang="scss">
.rootContainer {
  width: 100%;
  background-color: #f4f4f4;
}
.bgTop {
  background-color: #1b1b1b;
  position: absolute;
  width: 100%;
  height: 244px;
  top: 0;
  left: 0;
  z-index: 1;
}
.headerWrap {
  width: 980px;
  text-align: left;
  margin: 24px auto 0 auto;
}

.pageContainer {
  width: 980px;
  text-align: left;
  margin: 80px auto 0 auto;
  z-index: 2;
}
</style>
