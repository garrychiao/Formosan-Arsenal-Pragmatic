<template>
  <vue-scroll class="login-page align-vertical">
    <div class="form-wrapper align-vertical-middle">
      <div class="form-box card-base card-shadow--extraLarge" align="center">
        <img class="image-logo" src="@/assets/images/logo.svg" alt="logo">
        <h2>登入</h2>

        <float-label class="styled">
          <input type="text" v-model="email" placeholder="帳號">
        </float-label>
        <float-label class="styled">
          <input type="password" v-model="pass" placeholder="密碼">
        </float-label>

        <el-button plain size="small" @click="onLogin" class="signin-btn tada animated">登入</el-button>
        <div class="text-center login-box pt-10">
          Don't have account yet?
          <router-link to="/register">Register</router-link>
        </div>
      </div>
    </div>
  </vue-scroll>
</template>

<script>
import { diaCodeList } from "@/utils/diaCode";
import firebase from "firebase";
import swal from 'sweetalert2';

export default {
  name: "Login",
  data() {
    return {
      email: '',
      pass: '',
    };
  },
  mounted() {
    //
  },
  methods: {
    async onLogin () {
      try {
        if (this.email == '' || this.pass == '') {
          swal('inputs cannot be empty', '', 'error');
          return
        }
        await firebase.auth().signInWithEmailAndPassword(this.email, this.pass);
        swal('Login Success.' ,'', 'success')
        this.$router.push('/');
      } catch (e) {
        console.log(e);
      }
    },
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.login-page {
  background: $text-color;
  margin-left: -30px;
  margin-right: -30px;

  .form-wrapper {
    width: 100%;
  }

  .form-box {
    width: 100%;
    max-width: 340px;
    padding: 30px;
    box-sizing: border-box;
    margin: 20px auto;

    a {
      font-size: 14px;
      color: $text-color-accent;
      text-decoration: none;
      font-weight: 500;
    }

    .image-logo {
      width: 80px;
      margin: 0px auto;
      margin-bottom: 30px;
      display: block;
    }

    .login-btn,
    .social-btn {
      width: 160px;

      &.google {
        margin-bottom: 10px;
        background-color: #d73d32;
        color: white;

        &:hover {
          border-color: #d73d32;
        }
      }
      &.facebook {
        background-color: #3f5c9a;
        color: white;

        &:hover {
          border-color: #3f5c9a;
        }
      }
    }

    .signin-box {
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .layout-container .container .view.login-page {
    margin-left: -5px;
    margin-right: -5px;
    max-width: calc(100% + 10px);
  }
}
</style>
