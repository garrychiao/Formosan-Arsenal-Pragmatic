<template>
  <div>
    <el-card shadow="always">
      <el-row>
        <h3>個別用戶推廣層級設定</h3>
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 20, offset: 2}">
          <el-input
            style="width: 100%;"
            v-model="selectedUser"
            @change="adminSelectedUser"
            placeholder="User Address">
          </el-input>
          <h4>{{ adminSelectedUserTitle }}</h4>
        </el-col>
      </el-row>
      <el-row :gutter="4" v-if="selectedUserInfo.address">
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 20, offset: 2}">
          <h4>{{selectedUserInfo.email}}</h4>
          <h4>{{selectedUserInfo.address}}</h4>
          <el-row>
            <el-col>
              <el-switch
                v-model="selectedUserInfo.introActive"
                active-text="已開通推廣"
                inactive-text="未開通推廣">
              </el-switch>
            </el-col>
          </el-row>
          <el-row v-if="selectedUserInfo.introActive">
            <el-col>
              <el-select
                style="width: 40%;"
                v-model="selectedUserInfo.affiliateLevel"
                placeholder="用戶等級">
                <el-option
                  label="一般會員"
                  :value="false">
                </el-option>
                <el-option
                  v-for="item in affiliate.affiliateLabel"
                  :key="item"
                  :label="item"
                  :value="affiliate.affiliateLabel.indexOf(item)">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row v-if="selectedUserInfo.introActive">
            <el-col>
              <el-switch
                v-model="selectedUserInfo.userAffiliateLayerActive"
                active-text="已設定個別比例"
                inactive-text="未設定個別比例">
              </el-switch>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="4" v-if="selectedUser && selectedUserInfo.userAffiliateLayerActive">
        <!-- select layers -->
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 8, offset: 2}">
          <el-select v-model="selectAffiliateLayer">
            <el-option
              v-for="item in selectAffiliateLayerOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <!-- inputs of layers -->
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 12, offset: 0}">
          <el-form label-width="90px">
            <el-form-item v-for="n in selectAffiliateLayer" :key="n.email" :label="'第' + n + '層'">
              <el-input v-model="userAffiliateLayer[n - 1]"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="selectedUserInfo.address">
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 4, offset: 10}">
          <el-button type="primary" @click="updateUserAffiliate">更新</el-button>
        </el-col>
      </el-row>
      <!-- customized users table -->
      <el-row>
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 20, offset: 2}">
          <el-table
            :data="personalAffiliateTable"
            style="width: 100%">
            <el-table-column
              prop="address"
              label="Address">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>Name: {{ scope.row.name }}</p>
                  <p>email: {{ scope.row.email }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.address }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="userAffiliateLayer"
              label="推廣層級">
              <template slot-scope="scope">
                <el-tag 
                  style="width: 100%"
                  v-for="n in scope.row.userAffiliateLayer.length" 
                  :key="n"
                  type="success">
                  第{{n}}層 : {{scope.row.userAffiliateLayer[n - 1]}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="清除">
              <template slot-scope="scope">
                <el-button type="danger" @click="clearUserAffiliateLayer(scope.row.email)">清除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      personalAffiliateTable: [],
      selectedUser: '',
      adminSelectedUserTitle: '',
      selectedUserInfo: {},
      loading: false,
      //
      selectAffiliateLayer: 3,
      selectAffiliateLayerOptions: [1, 2, 3, 4, 5],
      userAffiliateLayer: [0.05, 0.03, 0.02],
    }
  },
  watch: {
    usersVerified: function () {
      this.personalAffiliateTable = []
      for (let key in this.usersVerified) {
        if (this.usersVerified[key].userAffiliateLayerActive) {
          this.personalAffiliateTable.push(this.usersVerified[key]);
        }
      }
    },
  },
  props: ['usersVerified', 'affiliate'],
  methods: {
    async updateUserAffiliate () {
      if (!this.checkForm()) {
        return
      }
      try {
        const db = firebase.firestore();
        await db.collection('users').doc(this.selectedUserInfo.email).update({
          introActive: this.selectedUserInfo.introActive,
          affiliateLevel: (this.selectedUserInfo.introActive) ? this.selectedUserInfo.affiliateLevel : false,
          userAffiliateLayerActive: (this.selectedUserInfo.introActive) ? this.selectedUserInfo.userAffiliateLayerActive : false,
          userAffiliateLayer: (this.selectedUserInfo.introActive && this.selectedUserInfo.userAffiliateLayerActive) ? this.userAffiliateLayer.map(x => parseFloat(x)) : false,
        });
        this.$notify({
          title: '更新成功',
          type: 'success',
        });
        this.selectedUser = '';
        this.userAffiliateLayer = [0.05, 0.03, 0.02];
        this.selectAffiliateLayer= 3;
        this.$emit('getUsers');
      } catch (e) {
        console.log(e);
      }
    },
    async clearUserAffiliateLayer (docId) {
      try {
        const db = firebase.firestore();
        await db.collection('users').doc(docId).update({
          userAffiliateLayerActive: false,
          userAffiliateLayer: firebase.firestore.FieldValue.delete()
        });
        this.$notify({
          title: '清除成功',
          type: 'success',
        });
        this.$emit('getUsers');
      } catch (e) {
        console.log(e);
      }
    },
    checkForm () {
      if (!this.selectedUser) {
        this.$notify({
          title: '請選擇用戶',
          type: 'error',
        });
        return false
      }
      if (this.selectedUserInfo.introActive && this.selectedUserInfo.affiliateLevel === false) {
        this.$notify({
          title: '一般會員不得開啟推廣',
          type: 'error',
        });
        return false
      }
      if (this.selectedUserInfo.userAffiliateLayerActive) {
        this.userAffiliateLayer = this.userAffiliateLayer.slice(0, this.selectAffiliateLayer);
        if (this.selectAffiliateLayer != this.userAffiliateLayer.length) {
          this.$notify({
            title: '欄位不得空白',
            type: 'error',
          });
          return false
        }
        for (let i = 0; i < this.userAffiliateLayer.length; i++) {
          if (this.userAffiliateLayer[i] < this.userAffiliateLayer[i + 1]) {
            this.$notify({
              title: '下一代領取的%比例，不能超越上一代的%比例',
              type: 'error',
            });
            return false
          }
        }
      }
      return true
    },
    adminSelectedUser () {
      for (let key in this.usersVerified) {
        if (this.usersVerified[key].address == this.selectedUser) {
          this.selectedUserInfo = this.usersVerified[key];
          if (this.selectedUserInfo.userAffiliateLayerActive) {
            this.selectAffiliateLayer = this.selectedUserInfo.userAffiliateLayer.length
            this.userAffiliateLayer = this.selectedUserInfo.userAffiliateLayer
          } else {
            this.selectAffiliateLayer = 3
            this.userAffiliateLayer = [0.05, 0.03, 0.02]
          }
          return
        }
      }
      this.selectedUserInfo = {}
    },
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loading = true;
    //     setTimeout(() => {
    //       this.loading = false;
    //       this.options = this.usersVerified.filter(item => {
    //         return item.address.indexOf(query) > -1;
    //       });
    //     }, 200);
    //   } else {
    //     this.options = [''];
    //   }
    // },
  },
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
</style>
