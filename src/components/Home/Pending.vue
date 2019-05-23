<template>
  <div>
    <el-card shadow="always">
      <h2 class="text--warning">
        <i class="el-icon-warning"></i>
        等待管理員驗證中
      </h2>
      <h3 style="line-height: 2;">
        歡迎： {{ email }}
        <br>
        地址：{{ address }}
      </h3>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: [
    'email',
    'address'
  ],
  methods: {
    //
  },
  created () {
    this.$notify({
      title: '等待驗證中',
      type: 'warning',
    });
  },
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
  },
};

</script>
<style>
.el-card {
  margin-top: 20px;
}
.text--warning {
  color: #e65100;

}
</style>
