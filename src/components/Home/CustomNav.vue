<template>
  <div>
    <el-menu 
      :default-active="activeIndex" 
      class="el-menu-demo" 
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#36d7b7"
      router>
      <el-menu-item index="profile" route='/profile'>Profile</el-menu-item>
      <el-menu-item index="admin" v-if="isAdmin">Admin</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      //
    };
  },
  props: ['isAdmin', 'activeIndex'],
};

</script>
