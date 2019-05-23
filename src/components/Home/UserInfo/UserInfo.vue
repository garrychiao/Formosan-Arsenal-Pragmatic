<template>
  <div>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <div style="font-weight: bold;">基本資料</div>
      </div>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            姓名
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ user.name }}
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            電子郵件
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ user.email }}
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            推薦人
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ introducer.name }} ( {{ introducer.email }} )
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            當前地址
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ trimmedUserAddress }} <el-button size="mini" style="float: right;" @click="copyAddress" round>複製</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            會員等級
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ userLevel }}
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            會員權限
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ userAuth }}
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            ETH Balance
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content" v-if="user.ETHBalance">
            {{ user.ETHBalance }}
          </div>
          <div class="grid-content" v-if="!user.ETHBalance">
            <i class="el-icon-loading"></i>
          </div>
        </el-col>
      </el-row>
      <!-- an item -->
      <el-row class="text--left info-row">
        <el-col :span="6">
          <div class="grid-content">
            Token Balance
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            {{ user.name }}
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import clipboard from '../../../mixins/clipboard.js'

export default {
  data() {
    return {
      userLevel: '',
      userAuth:'',
    };
  },
  props: [
    'user',
    'introducer',
    'affiliate'
  ],
  mixins: [clipboard],
  methods: {
    copyAddress() {
      this.copyStrToClipboard(this.user.address);
      this.$notify({
        title: '複製成功',
        type: 'success'
      });
    },
  },
  watch: {
    user: function () {
      if (!this.user.affiliateLevel) {
        this.userLevel = '一般會員';
      } else {
        this.userLevel = this.affiliate.affiliateLabel[this.user.affiliateLevel];
      }
      // affiliate level
      if (!this.user.introActive) {
        this.userLevel = '一般會員';
      } else {
        this.userLevel = this.affiliate.affiliateLabel[this.user.affiliateLevel];
      }
      // user authority
      if (!this.user.admin) {
        this.userAuth = '一般會員';
      } else {
        this.userAuth = '管理員';
      }
    }
  },
  created () {
    // affiliate level
    if (!this.user.introActive) {
      this.userLevel = '一般會員';
    } else {
      this.userLevel = this.affiliate.affiliateLabel[this.user.affiliateLevel];
    }
    // user authority
    if (!this.user.admin) {
      this.userAuth = '一般會員';
    } else {
      this.userAuth = '管理員';
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
    trimmedUserAddress() {
      let addressLen = 42;
      return this.user.address.slice(0, 8) + '...' + this.user.address.slice(38, addressLen);
    },
  },
};

</script>
<style>
.text--warning {
  color: #e65100;

}
.text--left {
  text-align: left;
}
.info-row {
  padding: 10px 10px;
}
.info-row:nth-child(odd) {
  background-color: #f2f7f3;
  
}
.bg-info {
  background-color: #e1f5fe;
  padding: 0px 20px;
}
.grid-content {
  font-size: 1rem;
}
</style>
