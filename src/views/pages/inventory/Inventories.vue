<template>
  <vue-scroll class="page-profile" id="affix-container">
    <div class="card-base card-shadow--medium identity" id="boundary">
      <div class="cover"></div>
      <div class="username">
        <div class="cover-small"></div>
        <div class="avatar-small">
          <img src="@/assets/images/avatar.jpg" alt="avatar">
        </div>
        <span>Inventories</span>
      </div>
      <!-- <div class="avatar"><img src="@/assets/images/avatar.jpg" alt="avatar"></div> -->
      <img
        src="@/assets/images/cover-2.jpg"
        id="color-thief"
        class="color-thief"
        alt="profile cover"
      >
    </div>
    <el-row :gutter="12">
      <el-col :span="16">
        <v-select label="item_name" :options="inventories" v-model="selectedInv"></v-select>
      </el-col>
      <el-col :span="8">
        Unit Weight: {{selectedInv.unit_weight}}
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-input v-model="unit" type="number"></el-input>
      </el-col>
      <el-col :span="8">
        Weight: {{ totalWeight }}
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="8">
        <el-button type="primary" @click="dialogVisible = true">
          Udpate
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      title="Update Inv"
      :visible.sync="dialogVisible">
      <el-row>
        <el-col :span="8">
          Item Name
        </el-col>
        <el-col :span="16">
          <el-input type="text" v-model="form.item_name"></el-input>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="8">
          Item Weight
        </el-col>
        <el-col :span="16">
          <el-input type="numebr" v-model="form.unit_weight"></el-input>
        </el-col>
      </el-row>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateInv">Update</el-button>
      </span>
    </el-dialog>
  </vue-scroll>
</template>

<script>
import firebase from "firebase";
import { inventories } from './inventories';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { Decimal } from 'decimal.js';

export default {
  name: "Profile",
  data() {
    return {
      inventories: [],
      selectedInv: {},
      unit: 0,
      totalWeight: 0,
      dialogVisible: false,
      form: {}
    };
  },
  methods: {
    async getInventories () {
      try {
        let db = firebase.firestore();
        let inventoriesRef = await db.collection('inventories').orderBy('id', 'asc').get();
        let inventories = [];
        inventoriesRef.forEach(doc => {
          let item = doc.data();
          item.docId = doc.id;
          inventories.push(item);
        });
        this.inventories = inventories;
      } catch (err) {
        console.log(err);
      }
    },
    async updateInv () {
      try {
        let db = firebase.firestore();
        await db.collection('inventories').doc(this.selectedInv.docId).update({
          unit_weight: this.form.unit_weight,
        });

        this.getInventories();
        this.dialogVisible = false;
        this.$notify({
          title: 'success',
          type: 'success'
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    this.getInventories();
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.resizeAffixEnabled);
  },
  watch: {
    unit: function () {
      if (this.selectedInv.unit_weight) {
        let _unit = new Decimal(this.unit);

        this.totalWeight = parseFloat(_unit.times(parseFloat(this.selectedInv.unit_weight)));
      }
    },
    selectedInv: function () {
      this.form = this.selectedInv;
      if (this.selectedInv.unit_weight) {
        let _unit = new Decimal(this.unit);
        this.totalWeight = parseFloat(_unit.times(parseFloat(this.selectedInv.unit_weight)));
      }
    }
  },
  components: {
    vSelect,
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/_variables";

.card-form {
  padding: 20px;
}
.uploadedImg {
  margin-left: 10px;
  width: 50%;
}
.el-button {
  // float: left;
}

.page-profile {
  overflow: auto;

  .identity {
    margin-bottom: 20px;
    position: relative;
    width: 100%;
    height: 220px;

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("../../../assets/images/cover-2.jpg");
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
    .username {
      color: #32325d;
      position: absolute;
      width: 100%;
      height: 50px;
      bottom: 75px;
      left: 0;
      right: 0;
      background: #fff;
      line-height: 50px;
      box-sizing: border-box;
      padding-left: 250px;
      font-size: 25px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-shadow: 0 7px 14px 0 rgba(50, 50, 93, 0.1),
        0 3px 6px 0 rgba(0, 0, 0, 0.07);

      .cover-small {
        width: 220px;
        height: 50px;
        overflow: hidden;
        display: block;
        float: left;
        margin-right: -220px;
        position: relative;
        left: -250px;
        border-radius: 9px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 4px solid white;
        opacity: 0;
        top: 0px;
        background-image: url("../../../assets/images/cover-2.jpg");
        background-position: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
      }
      .avatar-small {
        width: 50px;
        height: 50px;
        overflow: hidden;
        display: block;
        float: left;
        margin-right: -50px;
        position: relative;
        left: -100px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 4px solid white;
        opacity: 0;
        top: 0px;
        transform: rotate(-50deg);
        transition: all 0.5s;
      }
      .avatar-small img {
        width: 100%;
      }

      &.affix {
        z-index: 99;
        border-radius: 5px;

        .cover-small {
          opacity: 1;
        }

        .avatar-small {
          opacity: 1;
          left: -60px;
          transform: rotate(0deg);
        }
      }

      .colors-box {
        height: 50px;
        background: white; //091c2d
        float: right;

        .color {
          width: 50px;
          height: 50px;
          background: white; //091c2d
          float: right;
          transform: skew(-45deg);
          box-shadow: 1px 0px 1px 0px transparent;
          position: relative;
          right: -25px;
          margin-right: -50px;
          transition: margin-right 0.75s;

          &.active {
            margin-right: 0;
          }

          &:nth-child(2) {
            opacity: 0.8;
          }
          &:nth-child(3) {
            opacity: 0.6;
          }
          &:nth-child(4) {
            opacity: 0.4;
          }
          &:nth-child(5) {
            opacity: 0.2;
          }
        }
      }
    }
    .avatar {
      border: 6px solid #fff;
      position: absolute;
      bottom: 10px;
      left: 50px;
      width: 180px;
      height: 180px;
      overflow: hidden;
      border-radius: 50%;
      box-sizing: border-box;
      box-shadow: 0px 20px 15px -15px rgba(0, 0, 0, 0.15);

      img {
        width: 100%;
      }
    }

    .color-thief {
      display: block;
      width: 100px;
      visibility: hidden;
      z-index: -999999;
      position: absolute;
    }
  }

  .info {
    padding: 24px 32px;
  }
}

@media (max-width: 768px) {
  .page-profile {
    .identity {
      height: auto;

      .avatar {
        bottom: inherit;
        top: 10px;
        left: 50%;
        width: 100px;
        margin-left: -50px;
        height: 100px;
        border-width: 3px;
      }

      .username {
        position: inherit;
        padding: 10px;
        margin: 0;
        top: inherit;
        left: inherit;
        z-index: 1;
        right: inherit;
        text-align: center;
        bottom: inherit;
        white-space: inherit;
        line-height: inherit;
        height: auto;
        margin-top: 120px;
        width: 90%;
        margin-left: 5%;
        margin-bottom: 10px;
        border-radius: 50px;

        .colors-box {
          display: none;
        }

        .avatar-small {
          display: none;
        }

        .cover-small {
          display: none;
        }
      }
    }

    .info {
      padding: 8px 16px;
    }
  }
}
</style>

<style lang="scss">
.page-profile {
  .el-tabs:not(.el-tabs--border-card) {
    .el-tabs__item:not(.is-active) {
      color: #32325d;
    }
  }
}
</style>
