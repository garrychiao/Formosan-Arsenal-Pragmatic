<template>
  <div>
    <el-card shadow="always">
      <el-form ref="form" :model="system" label-width="150px">
        <h3>公司地址</h3>
        <el-form-item label="地址">
          <el-input v-model="system.bankAccount"></el-input>
        </el-form-item>
        <h3>系統參數</h3>
        <el-form-item label="推廣業務所需費用">
          <el-input type="number" min="0" v-model="system.normalAffiliate"></el-input>
        </el-form-item>
        <el-form-item label="市場總監所需費用">
          <el-input type="number" min="0" v-model="system.superiorAffiliate"></el-input>
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
      //
    };
  },
  watch: {
    //
  },
  props: ['system'],
  methods: {
    async updateSystem () {
      const db = firebase.firestore();
      try {
        await db.collection('system').doc('system').update({
          bankAccount: (this.system.bankAccount || '0xbC26B63F83a9d15797B3a8f0bf73Ab3DDdfa1b8D'),
          normalAffiliate: parseFloat(this.system.normalAffiliate),
          superiorAffiliate: parseFloat(this.system.superiorAffiliate),
        });
        this.$notify({
          title: '更新成功',
          type: 'success',
        });
        this.$emit('getSystem')
      } catch (e) {
        this.$notify({
          title: '錯誤',
          type: 'error',
        });
        console.log(e);
      }
    }
  },
};
</script>
<style>

</style>
