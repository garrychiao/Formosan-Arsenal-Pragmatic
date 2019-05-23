<template>
  <vue-scroll class="page-profile" id="affix-container">
    <div class="card-base card-shadow--medium identity" id="boundary">
      <div class="cover"></div>
      <div class="username">
        <div class="cover-small"></div>
        <div class="avatar-small">
          <img src="@/assets/images/avatar.jpg" alt="avatar">
        </div>
        <span>請填寫用戶資料</span>
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
      <el-col :span="20" :offset="1">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item prop="name" label="姓名" :rules="requireRules">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="電子郵件"
            :rules="[
              { required: true, message: 'Please input email address', trigger: 'blur' },
              { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
            ]"
          >
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="國籍">
            <el-select v-model="form.nationality" placeholder="Country">
              <el-option
                v-for="item in diaCodeOptions"
                :key="item.countryName"
                :label="item.countryName"
                :value="item.countryName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="idNo" label="身分證號" :rules="requireRules">
            <el-input v-model="form.idNo"></el-input>
          </el-form-item>
          <!-- img1 -->
          <el-form-item>
            <div class="upload-img-section">
              <el-button type="info" plain @click="clickUploadImg('img1')">上傳證件正照</el-button>
              <input
                type="file"
                accept="image/*"
                @change="onFilePicked"
                style="display: none;"
                ref="img1"
                name="img1"
                id="imgFront"
              >
              <img
                class="uploadedImg"
                @click="handlePreview(img1Preview, '證件正照')"
                :src="img1Preview"
                alt
              >
            </div>
          </el-form-item>
          <!-- img2 -->
          <el-form-item>
            <div class="upload-img-section">
              <el-button type="info" plain @click="clickUploadImg('img2')">上傳證件反照</el-button>
              <input
                type="file"
                accept="image/*"
                @change="onFilePicked"
                style="display: none;"
                ref="img2"
                name="img2"
                id="imgBack"
              >
              <img
                class="uploadedImg"
                @click="handlePreview(img2Preview, '證件反照')"
                :src="img2Preview"
                alt
              >
            </div>
          </el-form-item>
          <!-- img3 -->
          <el-form-item>
            <div class="upload-img-section">
              <el-button type="info" plain @click="clickUploadImg('img3')">本人與證件自拍</el-button>
              <input
                type="file"
                accept="image/*"
                @change="onFilePicked"
                style="display: none;"
                ref="img3"
                name="img3"
                id="imgSelfie"
              >
              <img
                class="uploadedImg"
                @click="handlePreview(img3Preview, '本人與證件自拍')"
                :src="img3Preview"
                alt
              >
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onSubmit">新增完成</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog :title="previewImgName" :visible.sync="previewDialog" top="10vh">
      <img style="width: 100%" :src="previewImg" alt>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialog = false">Close</el-button>
      </span>
    </el-dialog>
  </vue-scroll>
</template>

<script>
import { diaCodeList } from "@/utils/diaCode";
import firebase from "firebase";
import UserService from "@/services/UserService";
import _ from "lodash";

export default {
  name: "Profile",
  data() {
    return {
      registeredList: [],
      //
      diaCodeOptions: diaCodeList,
      colorActive: false,
      requireRules: [
        {
          required: true,
          message: "Please input email address",
          trigger: "blur"
        }
      ],
      form: {
        name: 'test',
        email: 'test@gmail.com',
        idNo: '1241242141212',
        nationality: "Taiwan",
      },
      img1Preview: "",
      img2Preview: "",
      img3Preview: "",
      previewDialog: false,
      previewImg: "",
      previewImgName: ""
    };
  },
  methods: {
    onSubmit() {
      // form validation
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$notify({
            title: "請檢查表單",
            type: "error"
          });
          return;
        } else {
          if (this.checkForm()) {
            this.form.phone = firebase.auth().currentUser.phoneNumber;
            this.form.uid = firebase.auth().currentUser.uid;
            this.submitForm();
          }
        }
      });
    },
    async submitForm () {
      let formData = new FormData();

      const imgFront = document.getElementById('imgFront').files[0];
      const imgBack = document.getElementById('imgBack').files[0];
      const imgSelfie = document.getElementById('imgSelfie').files[0];
      console.log(imgFront)
      formData.append('photos', imgFront)
      formData.append('photos', imgBack)
      formData.append('photos', imgSelfie)
      for (let key in this.form) {
        formData.append(key, this.form[key])
      }
      let res = await UserService.createUser(formData);
      console.log(res.data)
    },
    checkForm () {
      // img
      let imgFront = document.getElementById('imgFront').files[0]
      let imgBack = document.getElementById('imgBack').files[0]
      let imgSelfie = document.getElementById('imgSelfie').files[0]
      if (!imgFront || !imgBack || !imgSelfie) {
        this.$notify({
          title: "請檢查照片上傳",
          type: "error"
        });
        return false;
      }
      // find if input has been registered
      let e = _.filter(this.registeredList, { 'email': this.form.email });
      if (e.length > 0) {
        this.$notify({
          title: "Email 已被註冊",
          type: "error"
        });
        return false;
      }
      let i = _.filter(this.registeredList, { 'idNo': this.form.idNo });
      if (i.length > 0) {
        this.$notify({
          title: "ID 已被註冊",
          type: "error"
        });
        return false;
      }
      return true
    },
    clickUploadImg(ref) {
      this.$refs[ref].click();
    },
    onFilePicked(event) {
      if (event.target.files[0].name.lastIndexOf(".") <= 0) {
        this.$notify({
          title: "Please add a valid file!",
          type: "error"
        });
        return;
      }
      
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        if (event.target.name == "img1") {
          this.img1Preview = fileReader.result;
        }
        if (event.target.name == "img2") {
          this.img2Preview = fileReader.result;
        }
        if (event.target.name == "img3") {
          this.img3Preview = fileReader.result;
        }
      });
      if (file) {
        fileReader.readAsDataURL(file);
      }
    },
    handlePreview(url, label) {
      this.previewDialog = true;
      this.previewImg = url;
      this.previewImgName = label;
    }
  },
  mounted() {
    //
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.resizeAffixEnabled);
  },
  components: {
    //
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
  float: left;
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
