<template>
  <div>
    <el-card shadow="always">
      <h3>待驗證之用戶</h3>
      <el-table
        :data="usersNotVerified"
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
        <!-- img part -->
        <el-table-column
          align='left'
          label="Image 1">
          <template slot-scope="scope">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="scope.row.img0" @click="openPreviewImg(scope.row.img0)" class="image">
            </el-card>
          </template>
        </el-table-column>
        <!--  -->
        <el-table-column
          align='left'
          label="Image 2">
          <template slot-scope="scope">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="scope.row.img1" class="image" @click="openPreviewImg(scope.row.img1)">
            </el-card>
          </template>
        </el-table-column>
        <!--  -->
        <el-table-column
          align='left'
          label="Image 3">
          <template slot-scope="scope">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="scope.row.img2" @click="openPreviewImg(scope.row.img2)" class="image">
            </el-card>
          </template>
        </el-table-column>
        <!-- verify btn -->
        <el-table-column
          align='left'
          label="Verify">
          <template slot-scope="scope">
            <el-button type="success" @click="verifyUser(scope.row.email)">確認</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- img preview dialog -->
    <el-dialog
      :visible.sync="previewImgDialog"
      width="80%">
      <img :src="previewImg" class="previewImg" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="previewImgDialog = false">關閉</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      previewImgDialog: false,
      previewImg: '',
    };
  },
  created () {
    // this.getUsers();
  },
  props: ['usersNotVerified'],
  methods: {
    async verifyUser (email) {
      const db = firebase.firestore()
      try {
        await db.collection('users').doc(email).update({
          verified: true,
        });

        this.$notify({
          title: '驗證成功',
          type: 'success',
        });
        this.$emit('getUsers')
      } catch (e) {
        console.log(e)
      }
    },
    openPreviewImg (url) {
      this.previewImgDialog = true;
      this.previewImg = url;
    },
  }
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
