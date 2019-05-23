<template>
  <div>
    <el-card shadow="always">
      <h3>管理員設定</h3>
      <el-table
        :data="usersVerified"
        highlight-current-row>
        <el-table-column
          align='left'
          label="Name">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>電子郵件: {{ scope.row.email }}</p>
              <p>地址: {{ scope.row.address }}</p>
              <p>加入時間: {{ scope.row.createDateTime }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="ID No."
          align='left'
          prop="idNo">
        </el-table-column>
        <!-- verify btn -->
        <el-table-column
          align='left'
          label="權限">
          <template slot-scope="scope">
            <el-button
              :disabled="authorityBtnDisabled || checkLastAdmin(scope.row)"
              :type="scope.row.admin === true ? 'success' : 'info'"
              @click="handleAuthority(scope.$index, scope.row)">
                {{scope.row.admin === true ? 'Admin' : 'Normal User'}}
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
      previewImgDialog: false,
      previewImg: '',
      authorityBtnDisabled: false,
      lastAuth: false,
    };
  },
  watch: {
    usersVerified: function () {
      let adminUsers = _.filter(this.usersVerified, { 'admin': true });
      if (adminUsers.length == 1) {
        this.lastAuth = true;
      } else {
        this.lastAuth = false;
      }
    }
  },
  props: ['usersVerified'],
  methods: {
    async handleAuthority (index, row) {
      const db = firebase.firestore()
      try {
        if (!row.admin) {
          await db.collection('users').doc(row.email).update({
            admin: true,
          });
        } else {
          await db.collection('users').doc(row.email).update({
            admin: false,
          });
        }
        this.$notify({
          title: '更新成功',
          type: 'success',
        });
        this.$emit('getUsers');
      } catch (e) {
        console.log(e)
      }
    },
    checkLastAdmin (row) {
      if (this.lastAuth && row.admin) {
        return true;
      }
      return false;
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
