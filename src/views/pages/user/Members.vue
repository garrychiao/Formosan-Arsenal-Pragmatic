<template>
  <vue-scroll class="page-profile" id="affix-container">
    <div class="card-base card-shadow--medium identity" id="boundary">
      <div class="cover"></div>
      <div class="username">
        <div class="cover-small"></div>
        <div class="avatar-small">
          <img src="@/assets/images/avatar.jpg" alt="avatar">
        </div>
        <span>SMART PM</span>
        <span style="color: white;">Dangelababy 的小天地</span>
      </div>
      <img
        src="@/assets/images/cover-2.jpg"
        id="color-thief"
        class="color-thief"
        alt="profile cover"
      >
    </div>
    <el-row :gutter="15">
      <el-col :span="6">
        <el-button type="primary" @click="addMemberDialog = true">
          Add
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-input v-model="condition" placeholder="Condition"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input v-model="target" placeholder="Target"></el-input>
      </el-col>
      <el-col :span="6">
        <!-- <el-button type="warning" @click="getMembers(condition, target)">
          Filter
        </el-button> -->
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="24">
        <el-table
          ref="memberTable"
          :data="tableData"
          style="width: 100%"
          :default-sort = "{prop: 'name', order: 'descending'}"
          >
          <el-table-column
            prop="name"
            label="Name"
            sortable>
          </el-table-column>
          <el-table-column
            prop="category"
            label="Category">
          </el-table-column>
          <el-table-column
            prop="contact"
            label="Contact"
            sortable>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="Remark">
          </el-table-column>
          <el-table-column
            prop="gallery"
            label="Gallery">
          </el-table-column>
          <el-table-column
            prop="skillList"
            label="Skill List"
            sortable="">
          </el-table-column>
          <el-table-column
            prop="id"
            label="Manipulate"
            width="100">
            <template slot-scope="scope">
              <el-button @click="openEditMemberDialog(scope.row)" type="info" size="mini">
                Edit
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="Manipulate"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteMember(scope.row.docId)" type="danger" size="mini">
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- add dialog -->
        <el-dialog
          title="Add Member"
          :visible.sync="addMemberDialog"
          width="60%"
          center>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Name</span>
                <el-input
                  placeholder="Name"
                  v-model="addMemberInfo.name">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Category</span>
                <el-input
                  placeholder="Category"
                  v-model="addMemberInfo.category">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Contact</span>
                <el-input
                  placeholder="Contact"
                  v-model="addMemberInfo.contact">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Remark</span>
                <el-input
                  placeholder="Remark"
                  v-model="addMemberInfo.remark">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Gallery</span>
                <el-input
                  placeholder="Gallery"
                  v-model="addMemberInfo.gallery">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Skill List</span>
                <el-input
                  placeholder="Skill List"
                  v-model="addMemberInfo.skillList">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <el-button @click="addMemberDialog = false">Cancel</el-button>
                <el-button type="primary" @click="addMember">Confirm</el-button>
              </el-col>
            </el-row>
        </el-dialog>
        <!-- edit dialog -->
        <el-dialog
          title="Edit Member"
          :visible.sync="editMemberDialog"
          width="60%"
          center>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Name</span>
                <el-input
                  placeholder="Name"
                  v-model="editMemberInfo.name">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Category</span>
                <el-input
                  placeholder="Category"
                  v-model="editMemberInfo.category">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Contact</span>
                <el-input
                  placeholder="Contact"
                  v-model="editMemberInfo.contact">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Remark</span>
                <el-input
                  placeholder="Remark"
                  v-model="editMemberInfo.remark">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Gallery</span>
                <el-input
                  placeholder="Gallery"
                  v-model="editMemberInfo.gallery">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <span class="demo-input-label">Skill List</span>
                <el-input
                  placeholder="Skill List"
                  v-model="editMemberInfo.skillList">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="addingForm">
              <el-col>
                <el-button @click="editMemberDialog = false">Cancel</el-button>
                <el-button type="primary" @click="editMember(editMemberInfo.docId)">Confirm</el-button>
              </el-col>
            </el-row>
        </el-dialog>
      </el-col>
    </el-row>
  </vue-scroll>
</template>

<script>
import { diaCodeList } from "@/utils/diaCode";
import firebase from "firebase";
import UserService from "@/services/UserService";
import _ from "lodash";
import swal from "sweetalert2";

export default {
  name: "Profile",
  data() {
    return {
      condition: '',
      target: '',
      addMemberInfo: {
        name: '',
        category: '',
        contact: '',
        remark: '',
        gallery: '',
        skillList: '',
      },
      editMemberInfo: {
        name: '',
        category: '',
        contact: '',
        remark: '',
        gallery: '',
        skillList: '',
        docId: '',
      },
      editMemberDialog: false,
      addMemberDialog: false,
      tableData: [],
      origianlTableData: [],
    };
  },
  methods: {
    async addMember() {
      if(this.addMemberInfo.name == '') {
        swal('name cannot be empty', '', 'error');
        return
      }
      const db = firebase.firestore();
      try {
        await db.collection('members').add(this.addMemberInfo);
      } catch (err) {
        console.log(err);
      }
      swal('Member Added', '', 'success');
      // clear added info
      this.addMemberDialog = false;
      this.addMemberInfo = {
        name: '',
        category: '',
        contact: '',
        remark: '',
        gallery: '',
        skillList: '',
        condition: '',
        target: '',
      };
      await this.getMembers(this.condition, this.target);
    },
    async getMembers (condition = '', target = '') {
      const db = firebase.firestore();
      try {
        let membersRef;
        let members = [];
        membersRef = await db.collection('members').get();
        // if (condition && target) {
        //   membersRef = await db.collection('members').where(condition, '==', target).get();
        // } else {
          
        // }
        membersRef.forEach(doc => {
          let item = doc.data();
          item.docId = doc.id;
          members.push(item);
        });
        this.origianlTableData = members;
        this.tableData = members;
        // console.log(members);
      } catch (err) {
        console.log(err);
      }
    },
    openEditMemberDialog(userData) {
      this.editMemberInfo = userData;
      this.editMemberDialog = true
      console.log(userData);
    },
    async editMember (docId) {
      try {
        const db = firebase.firestore();
        await db.collection('members').doc(docId).update(this.editMemberInfo);
        swal('User updated', '', 'success');
        this.editMemberDialog = false;
        this.editMemberInfo = {
          name: '',
          category: '',
          contact: '',
          remark: '',
          gallery: '',
          skillList: '',
          docId: '',
        };
        await this.getMembers(this.condition, this.target);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteMember (docId) {
      swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        const db = firebase.firestore();
        await db.collection('members').doc(docId).delete();
        swal('Member deleted.' ,'', 'success');
        this.getMembers(this.condition, this.target);
      })
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  mounted() {
    this.getMembers(this.condition, this.target);
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.resizeAffixEnabled);
  },
  components: {
    //
  },
  watch: {
    target: function () {
      if (!this.condition) {
        return 
      } else if (this.condition == 'skill list') {
        this.condition = 'skillList'
      }
      if (!this.target) {
        this.tableData = this.origianlTableData;
        return
      }
      if (!(this.condition in this.origianlTableData[0])) {
        return
      }
      let newTableData = this.origianlTableData.filter((obj) => {
        if (obj[this.condition].includes(this.target)) {
          return obj
        }
      });
      console.log(newTableData);
      this.tableData = newTableData;
    }
  }
};
</script>

<style>
.swal2-container.swal2-shown {
  z-index: 3000 !important;
}
</style>

<style lang="scss" scoped>
@import "../../../assets/scss/_variables";

.addingForm {
  margin: 15px 0;
}
.card-form {
  padding: 20px;
}
.uploadedImg {
  margin-left: 10px;
  width: 50%;
}

// .el-button {
//   float: left;
// }

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
