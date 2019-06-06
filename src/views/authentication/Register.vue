<template>
  <vue-scroll class="register-page align-vertical">
    <div class="form-wrapper align-vertical-middle">
      <div class="form-box card-base card-shadow--extraLarge" align="center">
        <img class="image-logo" src="@/assets/images/logo.svg" alt="logo">
        <h2>註冊</h2>
        <float-label class="styled">
          <input type="text" v-model="email" placeholder="信箱">
        </float-label>
        <float-label class="styled">
          <input type="password" v-model="pass1" placeholder="密碼">
        </float-label>
        <float-label class="styled">
          <input type="password" v-model="pass2" placeholder="確認密碼">
        </float-label>

        <el-button type="primary" @click="onSignUp">
          確認
        </el-button>
        <div class="text-center login-box pt-10">
          Already have an account?
          <router-link to="/login">Login</router-link>
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
  name: "Register",
  data() {
    return {
      email: '',
      pass1: '',
      pass2: '',
    };
  },
  created() {
    //
  },
  mounted() {
    //
  },
  methods: {
    async onSignUp() {
      if (this.pass1 == '' || this.pass2 == '' || this.email == '') {
        swal('inputs cant be empty.', '', 'error')
        return
      } else if (this.pass1 !== this.pass2) {
        swal('pass words dont match.', '', 'error')
        return 
      }
      try {
        await firebase.auth().createUserWithEmailAndPassword(this.email, this.pass1);
        swal('register success', '', 'success');
        this.$router.push('/')
      } catch (err) {
        console.log(err);
      }

    },
    login() {
      this.$store.commit("setLogin");
      this.$router.push("dashboard");
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

#recaptcha-container {
  transform: scale(0.9) translateX(-5%);
  margin-bottom: 20px;
}

.register-page {
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
      margin-bottom: 50px;
      display: block;
    }

    .signin-btn {
      width: 160px;
    }

    .login-box {
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .layout-container .container .view.register-page {
    margin-left: -5px;
    margin-right: -5px;
    max-width: calc(100% + 10px);
  }
}
</style>
