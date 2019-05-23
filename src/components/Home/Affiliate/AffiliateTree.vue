<template>
  <div>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <div style="font-weight: bold;">推廣組織</div>
      </div>
      <el-tree lazy :load="loadNode" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-card>
  </div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      affiliateTree: [],
    }
  },
  props: [
    'user',
  ],
  methods: {
    async createAffiliateTree () {
      const db = firebase.firestore();
      try{
        for (let key in this.user.children) {
          let doc = await db.collection('users').doc(this.user.children[key].email).get();
          let userChildren = doc.data().children;
          if (userChildren.length > 0) {
            this.user.children[key].children = userChildren;
            // console.log(this.user.children[key])
          }
        }
        let me = {
          name: this.user.name,
          children: this.user.children,
        }
        this.affiliateTree.push(me);
        // console.log(this.affiliateTree)
      } catch (e) {
        console.log(e);
      }
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(
          [
            {
              name: this.user.name,
              email: this.user.email,
              children: this.user.children,
            },
          ]
        );
      }
      // console.log(node.data)
      const db = firebase.firestore();
      let doc = await db.collection('users').doc(node.data.email).get();
      let userChildren = doc.data().children;
      resolve(userChildren);
    },
    handleNodeClick(data) {
      console.log(data);
    }
  },
  created () {
    // this.createAffiliateTree();
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
  padding-bottom: 20px;
}

.text--warning {
  color: #e65100;

}
</style>
