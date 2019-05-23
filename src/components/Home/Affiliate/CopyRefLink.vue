<template>
  <div>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <div style="font-weight: bold;">我的經銷連結</div>
      </div>
      <h5>{{ locationOrigin }}?introCode={{ user.introCode }}</h5>
      <!-- Normal distribution right dialog -->
      <el-button type="primary" @click="copyRefLink()">
        複製經銷連結
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import clipboard from '@/mixins/clipboard'

export default {
  data() {
    return {
      locationOrigin: ''
    }
  },
  props: [
    'user',
  ],
  methods: {
    copyRefLink () {
      let refLink = this.locationOrigin + '?ref=' + this.user.introCode;
      clipboard.methods.copyStrToClipboard(refLink);
      this.$notify({
        title: '複製成功',
        type: 'success',
      });
    }
    //copyStrToClipboard
  },
  created () {
    this.locationOrigin = window.location.origin;
  },
  computed: {
    ...mapGetters([
      'getCurrentUser',
    ]),
  },
};

</script>
<style>
.text--warning {
  color: #e65100;
}
.text-left {
  text-align: left;
}
</style>
