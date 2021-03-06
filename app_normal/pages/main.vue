<template>
  <div v-show="isReady" class="myContainer">
    <div class="text-right mb-5">
      <v-icon color="#fff" @click="logout">mdi-logout</v-icon>
    </div>

    <template v-if="!isPublished">
      <v-alert type="info">アワードノミネートは未公開中です</v-alert>
    </template>
    <template v-else>
      <div v-if="isClosed" class="statusCaption close">
        投票は締め切りました
      </div>
      <div v-else-if="isPowerVoter && remainPoint" class="statusCaption yet">
        あなたは複数の投票権があります。残り<span class="remainNum">{{ remainPoint }}</span>ポイント
      </div>
      <div v-else-if="(isPowerVoter && !remainPoint) || votedNominateId" class="statusCaption done">
        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
        投票を受け付けました。締め切りまでは変更可能です
      </div>
      <div v-else class="statusCaption yet">
        <v-icon>mdi-information-outline</v-icon>
        投票したい候補をタップしてください
      </div>
      <v-row>
        <v-col v-for="(nominate, idx) in nominates" :key="idx" cols="12" sm="6">
          <v-card tile>
            <div v-if="isPowerVoter" class="nominateBody">
              <div class="captionBg">ENTRY No.{{ idx + 1 }}</div>
              <v-row class="bodyRow">
                <v-col cols="10" align-self="end">
                  <div class="nameBlock">{{ nominate.name }}</div>
                </v-col>
              </v-row>
            </div>
            <div v-else class="nominateBody" @click="executeVote(nominate.id)">
              <div class="captionBg">ENTRY No.{{ idx + 1 }}</div>
              <v-row class="bodyRow">
                <v-col cols="10" align-self="end">
                  <div class="nameBlock">{{ nominate.name }}</div>
                </v-col>
                <v-col cols="2" align-self="end">
                  <div class="heartBlock">
                    <img
                      v-if="isSelected(nominate.id)"
                      src="~static/heart_on.png"
                    />
                    <img v-else src="~static/heart_off.png" />
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-if="isPowerVoter" class="text-center powerVoteBlock">
              <v-btn
                x-small
                fab
                outlined
                @click="decreaseVote(nominate.id)"
              >
                <v-icon size="24">mdi-minus</v-icon>
              </v-btn>
              <div class="powerCountBadge">
                <v-icon dense color="white">mdi-heart</v-icon>
                <span class="white--text">{{ getVotedCount(nominate.id) }}</span>
              </div>
              <v-btn
                x-small
                fab
                outlined
                @click="increaseVote(nominate.id)"
              >
                <v-icon size="24">mdi-plus</v-icon>
              </v-btn>
            </div>
            <div class="nominateBottom">
              <div class="leftCol">
                <img src="~static/arrow.png" />
              </div>
              <div class="rightCol">{{ nominate.winner }}</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="judge" dense>
        <v-col
          cols="2"
          sm="2"
          offset-sm="3"
          align-self="center"
          class="judgeTitle"
          >審査<br />基準</v-col
        >
        <v-col cols="10" sm="7" class="judgeBody">
          <ul>
            <li>役割範囲を大きく超えた取り組み</li>
            <li>
              まじめに期待に応え続けることで創出した、社外・社内への好影響
            </li>
            <li>柔軟に変わり続ける動きによる社外・社内への好影響</li>
            <li>前例のない取り組みによるイノベーション創出</li>
            <li>その他、ニジボックスの一員としての高い事業貢献</li>
          </ul>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { INominate } from '~/../common/interfaces/INominate'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/plugins/AppUtil'
import ABasePage from '~/plugins/ABasePage'
import DataAccess from '~/plugins/DataAccess'
import { generalStateModule } from '~/store/modules/general'

@Component({})
export default class MainPage extends ABasePage {
  private isReady: boolean = false
  beforeMount() {
    this.commonBeforeMount()
  }

  get nominates(): INominate[] {
    return basicStateModule.nominates
  }

  get votedNominateId(): number | null {
    return basicStateModule.votedNominateId
  }

  get isClosed(): boolean {
    return basicStateModule.round.isClosed
  }

  get isPublished(): boolean {
    return basicStateModule.round.isPublished
  }

  get isPowerVoter(): boolean {
    return basicStateModule.isPowerVoter
  }

  get remainPoint(): number {
    let remainPoint: number = basicStateModule.votePoint
    for (const [id, count] of Object.entries(
      basicStateModule.votedMultiNominateIds
    )) {
      remainPoint -= count
    }
    return remainPoint
  }

  isSelected(id: number): boolean {
    return basicStateModule.votedNominateId === id
  }

  getVotedCount(id: number): number {
    if (basicStateModule.isPowerVoter) {
      if (basicStateModule.votedMultiNominateIds) {
        if (basicStateModule.votedMultiNominateIds.hasOwnProperty(id)) {
          return basicStateModule.votedMultiNominateIds[id]
        }
      }
    } else if (id === basicStateModule.votedNominateId) {
      return 1
    }
    return 0
  }

  colorName(id: number): string {
    if (basicStateModule.votedNominateId === id) {
      return 'pink'
    }
    return ''
  }

  mounted() {
    DataAccess.loadNominates()
      .then(DataAccess.watchRoundChanges)
      .then(() => {
        this.isReady = true
      })
  }

  executeVote(nominateId: number) {
    if (this.isPowerVoter) {
      return false
    }
    if (this.isPublished && !this.isClosed) {
      DataAccess.vote(nominateId)
    } else {
      generalStateModule.setToastMessage('受付期間外です')
    }
  }

  get isVoteEnable(): boolean {
    return this.isPublished && !this.isClosed
  }

  increaseVote(nominateId: number) {
    if (!this.isVoteEnable) {
      generalStateModule.setToastMessage('受付期間外です')
      return
    }
    DataAccess.increaseVote(nominateId)
  }

  decreaseVote(nominateId: number) {
    if (!this.isVoteEnable) {
      generalStateModule.setToastMessage('受付期間外です')
      return
    }
    DataAccess.decreaseVote(nominateId)
  }

  protected logout() {
    return AppUtil.logout().then(() => {
      this.$router.push({ path: '/login' })
    })
  }
}
</script>

<style scoped lang="scss">
.myContainer {
}

.statusCaption {
  color: #1b1b1b;
  text-align: center;
  width: 100%;
  font-size: 16px;
  padding: 0.8em 0;
  &.yet {
    background-color: #dad859;
  }
  &.done {
    background-color: #59da9e;
  }
  &.close {
    background-color: #cccccc;
  }

  .remainNum {
    font-size: 150%;
    font-weight: bold;
  }
}

.powerVoteBlock {
  .powerCountBadge {
    background-color: #e91e63;
    display: inline-block;
    width: 54px;
    height: 54px;
    line-height: 54px;
    border-radius: 27px;
    margin: 0 5px;
    font-weight: bold;
  }
  margin-bottom: 10px;
  -webkit-user-select: none;
  user-select: none;
}
.nominateBody {
  .captionBg {
    position: absolute;
    top: 0;
    right: 20px;
    text-align: right;
    color: #ccc;
    font-size: 56px;
    opacity: 0.2;
  }
  .bodyRow {
    min-height: 130px;
    margin-bottom: 0.5em;
  }
  .nameBlock {
    font-size: 20px;
    display: inline-block;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
    padding-left: 2em;
    vertical-align: bottom;
    font-weight: bold;
  }
}
.nominateBottom {
  color: #fff;
  background-color: #1b1b1b;

  font-size: 90%;
  font-weight: bold;
  box-sizing: border-box;
  padding: 1em 0;
  .leftCol {
    width: 15%;
    display: inline-block;
    text-align: right;
  }
  .rightCol {
    width: 80%;
    display: inline-block;
    text-align: right;
  }
}

.judge {
  .judgeTitle {
    padding: 30px 0;
    font-size: 24px;
    line-height: 28px;
    background-color: #ffffff;
    font-weight: bold;
    text-align: center;
    height: 100%;
  }
  .judgeBody {
    font-size: 15px;
  }
}
</style>
