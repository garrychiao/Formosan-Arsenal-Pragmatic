<template>
  <div>
    <el-card shadow="always">
      <h3>待驗證之推廣申請</h3>
      <el-table
        :data="affiliateApplications"
        highlight-current-row>
        <el-table-column
          align='left'
          label="姓名">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>電子郵件: {{ scope.row.email }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="申請時間"
          align='left'
          prop="dateTime">
        </el-table-column>
        <el-table-column
          label="申請類別"
          align='left'>
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.type === 'normal' ? '' : 'success'">
                {{scope.row.type === 'normal' ? '推廣業務' : '市場總監'}}
            </el-tag>
          </template>
        </el-table-column>
        <!-- verify btn -->
        <el-table-column
          align='left'
          label="權限">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="verifiyApplication(scope.row)">
              驗證
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex';
import _ from 'lodash';

export default {
  data() {
    return {
      
    };
  },
  watch: {
    //
  },
  props: ['affiliateApplications'],
  methods: {
    async verifiyApplication (doc) {
      const db = firebase.firestore();
      try {
        // setting this application to verified
        await db.collection('userBuyingAffiliate').doc(doc.docId).update({
          verified: true,
        });
        // setting user introActive true
        await db.collection('users').doc(doc.email).update({
          buyAffiliatePending: false,
          introActive: true,
          introType: doc.type,
        });
        this.$notify({
          title: '成功',
          type: 'success',
        });
        this.$emit('getAffiliateApplications');
      } catch (e) {
        console.log(e);
      }
    },
  },
};

</script>
<style>
.image {
  width: 100%;
}
.previewImg {
  width: 100%;
}
</style>
