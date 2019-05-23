<template>
  <div>
    <el-card shadow="always">
      <el-form ref="form" :model="affiliate">
        <h3>推廣層級設定</h3>
        <el-row>
          <el-col :span="4" :offset="4">
            <p>層級設定</p>
          </el-col>
          <el-col :span="4">
            <el-select v-model="affiliate.affiliateLayer" placeholder="層級設定">
              <el-option
                v-for="item in layerOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-switch
              v-model="affiliate.affiliateByETH"
              active-text="經銷權模式"
              inactive-text="購買額度模式"
              @change="affiliateByETHChanged">
            </el-switch>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
             <div class="block">
              <span class="demonstration">ETH & token 比例</span>
              <el-slider
                v-model="affiliate.ETHTokenRatio"
                show-input>
              </el-slider>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="6" :offset="6">
            <p>名稱</p>
          </el-col>
          <el-col :span="6">
            <p>比例</p>
          </el-col>
          <el-col :span="6">
            <p>{{affiliateTypeLabel}}</p>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-for="n in affiliate.affiliateLayer" :key=n>
          <el-col :span="6">
            <p>第 {{ n }} 層</p>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input type="text" placeholder="層級名稱" v-model="affiliate.affiliateLabel[n - 1]"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input type="number" placeholder="比例" min="0" v-model="affiliate.affiliateRate[n - 1]"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="affiliate.affiliateByETH">
            <el-form-item>
              <el-input type="number" placeholder="升級所需ETH" min="0" v-model="affiliate.affiliateActiveETH[n - 1]"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="!affiliate.affiliateByETH">
            <el-form-item>
              <el-input type="number" placeholder="升級所需Token" min="0" v-model="affiliate.affiliateActiveToken[n - 1]"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="updateAffiliate">更新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      layerOptions: [1, 2, 3, 4, 5],
      affiliateTypeLabel: '升級所需ETH',
    };
  },
  watch: {
    //
  },
  props: ['affiliate'],
  methods: {
    async updateAffiliate () {
      if (!this.checkForm()) {
        return
      }
      const db = firebase.firestore();
      try {
        await db.collection('system').doc('affiliate').update({
          affiliateByETH: this.affiliate.affiliateByETH,
          ETHTokenRatio: this.affiliate.ETHTokenRatio,
          affiliateLayer: parseFloat(this.affiliate.affiliateLayer),
          affiliateLabel: this.affiliate.affiliateLabel,
          affiliateRate: this.affiliate.affiliateRate.map(x => parseFloat(x)),
          affiliateActiveETH: this.affiliate.affiliateActiveETH.map(x => parseFloat(x)),
          affiliateActiveToken: this.affiliate.affiliateActiveToken.map(x => parseFloat(x)),
        });
        this.$notify({
          title: '更新成功',
          type: 'success',
        });
        this.$emit('getAffiliate')
      } catch (e) {
        this.$notify({
          title: '錯誤',
          type: 'error',
        });
        console.log(e);
      }
    },
    affiliateByETHChanged () {
      if (this.affiliate.affiliateByETH) {
        this.affiliateTypeLabel = '升級所需ETH'
      } else {
        this.affiliateTypeLabel = '升級所需Token'
      }
    },
    checkForm () {
      //
      this.affiliate.affiliateLabel = this.affiliate.affiliateLabel.slice(0, this.affiliate.affiliateLayer);
      this.affiliate.affiliateRate = this.affiliate.affiliateRate.slice(0, this.affiliate.affiliateLayer);
      this.affiliate.affiliateActiveETH = this.affiliate.affiliateActiveETH.slice(0, this.affiliate.affiliateLayer);
      this.affiliate.affiliateActiveToken = this.affiliate.affiliateActiveToken.slice(0, this.affiliate.affiliateLayer);
      //
      if (this.affiliate.affiliateLabel.length < this.affiliate.affiliateLayer ||
          this.affiliate.affiliateRate.length < this.affiliate.affiliateLayer ||
          this.affiliate.affiliateActiveETH.length < this.affiliate.affiliateLayer ||
          this.affiliate.affiliateActiveToken.length < this.affiliate.affiliateLayer) {
        this.$notify({
          title: '內容不可空白',
          type: 'error',
        });
        return false
      }
      for (let i = 0; i < this.affiliate.affiliateLayer; i++) {
        if (this.affiliate.affiliateRate[i] < this.affiliate.affiliateRate[i + 1]) {
          this.$notify({
            title: '下一代領取的%比例，不能超越上一代的%比例',
            type: 'error',
          });
          return false
        }
        if (this.affiliate.affiliateByETH && this.affiliate.affiliateActiveETH[i] > this.affiliate.affiliateActiveETH[i + 1]) {
          this.$notify({
            title: '推廣升級所需的ETH不得小於上一代',
            type: 'error',
          });
          return false
        }
        if (!this.affiliate.affiliateByETH && this.affiliate.affiliateActiveToken[i] > this.affiliate.affiliateActiveToken[i + 1]) {
          this.$notify({
            title: '推廣升級所需的Token不得小於上一代',
            type: 'error',
          });
          return false
        }
      }
      return true
    }
  },
};
</script>
<style>

</style>
