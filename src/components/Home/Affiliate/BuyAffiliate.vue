<template>
  <div>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">購買經銷權</span>
        <span class="currentAffiliateLevel"><span style="color: black">狀態：</span>{{ (user.affiliateLevel) ? affiliate.affiliateLabel[user.affiliateLevel] : '一般會員' }}</span>
      </div>
      <el-row>
        <el-col :sm="24" class="hidden-xs-only">
          <div style="height: 250px;">
            <el-steps direction="vertical" :active="affiliateLevelStep">
              <el-step title="一般會員" description="未開通經銷權，無子代回饋"></el-step>
              <el-step 
                v-for="n in ETHToUpgrade.length"
                :key=n 
                :title="affiliate.affiliateLabel[n - 1]"
                :description="'支付 ' + ETHToUpgrade[n - 1] + ' ETH 升級，第 ' + n + ' 代回饋：' + affiliate.affiliateRate[n - 1] * 100 + ' %'"></el-step>
            </el-steps>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24">
          <el-row v-for="n in ETHToUpgrade.length" :key="n">
            <el-col>
              <el-button 
                v-if="!buyAffiliatePending && ETHToUpgrade[n - 1] != 0 && !user.userAffiliateLayerActive" 
                @click="buyAffiliate(ETHToUpgrade[n - 1])" 
                type="primary" 
                size="mini" 
                round
                plain>
                  支付 {{ETHToUpgrade[n - 1]}} ETH 升級為 {{ affiliate.affiliateLabel[n - 1]}}
                </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="交易進行中"
      :visible.sync="dialogTrans"
      :show-close="false"
      width="60%">
      <h1><i class="el-icon-loading"></i></h1>
      <span>請勿關閉或重新整理視窗</span>      
    </el-dialog>
  </div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex';
import web3 from '@/utils/Web3';
import moment from 'moment';
import AffiliateModel from '@/model/AffiliateModel';
import 'element-ui/lib/theme-chalk/display.css';

export default {
  data() {
    return {
      buyAffiliatePending: true,
      dialogTrans: false,
      affiliateLevelStep: 0,
      userBoughtAffiliateTotal: 0,
      ETHToUpgrade: [],
    }
  },
  props: [
    'user',
    'system',
    'affiliate',
  ],
  methods: {
    async buyAffiliate(price) {
      this.buyAffiliatePending = true;
      const db = firebase.firestore();
      try {
        // starting transaction
        this.dialogTrans = true;
        const receipt = await web3.sendTransaction(this.user.address, this.system.bankAccount, price)
        // store reciept to db
        await db.collection('userBuyingAffiliate').add({
          receipt: receipt,
          dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          price: price,
          // in conditions admin doesnt need to verify it
          verified: true,
          //
          userEmail: this.user.email,
          userName: this.user.name,
          userAddress: this.user.address,
          introCode: this.user.introCode,
        })
        let total = this.user.affiliateTotalPaid + price
        console.log(total)
        let level = this.affiliate.affiliateActiveETH.indexOf(total)
        console.log('level:' + level)
        // set user's ref in db to pending status
        await db.collection('users').doc(this.user.email).update({
          // buyAffiliatePending: true,
          introActive: true,
          affiliateLevel: parseInt(level),
          affiliateTotalPaid: parseFloat(total),
        })
        // creating user parents affiliate shares
        let res = await AffiliateModel.createAffiliateShares(this.user, price, 'BuyingAffiliate');
        console.log(res);
        this.buyAffiliatePending = true;
        //
        this.dialogTrans = false;
        //
        this.$notify({
          title: '升級成功',
          type: 'success',
        });
        this.$emit('getUser')
        //
      } catch (e) {
        // if user reject transaction
        if (e.toString().includes('User denied transaction signature.')) {
          this.$notify({
            title: '交易取消',
            type: 'error',
          });
        }
        this.dialogTrans = false;
        this.buyAffiliatePending = false;
        console.log(e)
      }
    },
    setBuyingConfigs() {
      if (!this.user.buyAffiliatePending) {
        this.buyAffiliatePending = false;
      }
      if (!this.user.introActive) {
        // 一般會員
        this.affiliateLevelStep = 1;
        this.user.affiliateTotalPaid = 0
      } else {
        // array index needs to plus 1
        this.affiliateLevelStep = this.user.affiliateLevel + 2
      }
      this.ETHToUpgrade = [];
      for (let n in this.affiliate.affiliateActiveETH) {
        if (this.affiliate.affiliateActiveETH[n] < this.user.affiliateTotalPaid) {
          this.ETHToUpgrade.push(0);
        } else {
          this.ETHToUpgrade.push(this.affiliate.affiliateActiveETH[n] - this.user.affiliateTotalPaid);
        }
      }
    },
  },
  created () {
    this.setBuyingConfigs();
  },
  watch: {
    user: function () {
      this.setBuyingConfigs();
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
  },
};

</script>
<style lang="scss" scoped>
@import '../../../setting.scss';

.text--warning {
  color: #e65100;
}
.text-left {
  text-align: left;
}
.currentAffiliateLevel {
  float: right;
  color: $primary-text;
  font-weight: bold;
}
</style>
