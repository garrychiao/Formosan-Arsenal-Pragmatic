import Vue from 'vue';
import Router from 'vue-router';
// app
import Dashboard from './views/apps/Dashboard.vue';
//
import Members from './views/pages/user/Members';

import Profile from './views/pages/user/Profile.vue';
import KYC from './views/pages/user/KYC.vue';

import Login from './views/authentication/Login.vue';
import Register from './views/authentication/Register.vue';
import ForgotPassword from './views/authentication/ForgotPassword.vue';

import NotFound from './views/NotFound.vue';

import store from './store';
import firebase from 'firebase';

import layouts from './layout'
import UserService from './services/UserService'
import { userInfo } from 'os';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        auth: true,
        layout: layouts.navLeft,
      },
    },
    {
      path: '/members',
      name: 'mambers',
      component: Members,
      meta: {
        auth: true,
        layout: layouts.navLeft,
      },
    },
    // user
    // {
    //   path: '/kyc',
    //   name: 'kyc',
    //   component: KYC,
    //   meta: {
    //     kyc: true,
    //     layout: layouts.navLeft,
    //   },
    // },
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: Profile,
    //   meta: {
    //     auth: true,
    //     layout: layouts.navLeft,
    //   },
    // },
    // auth
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true,
        layout: layouts.contenOnly,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        guest: true,
        layout: layouts.contenOnly,
      },
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound,
      meta: {
        guest: true,
        layout: layouts.contenOnly,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  let authrequired = false;
	if (to && to.meta && to.meta.auth) {
    authrequired = true;
  }

  if (to && to.meta && to.meta.layout){
		l.set(to.meta.layout)
	}

  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user && authrequired) {
      console.log('user not logged in!');
      l.set(layouts.contenOnly)
      next('/login');
    } else if (!user && to.meta.guest) {
      next();
    } else if (user && to.meta.guest) {
      console.log('logged user redirect to dashboard.');
      console.log(to)
      next('/');
    } else {
      console.log('welcome ' + user.uid)
      next();
    }
  });
});

router.afterEach((to, from) => {
	setTimeout(()=>{
		store.commit('setSplashScreen', false)
	}, 500)
})
// setting layouts
const l = {
	contenOnly(){
		store.commit('setLayout', layouts.contenOnly)
	},
	navLeft(){
		store.commit('setLayout', layouts.navLeft)
	},
	navRight(){
		store.commit('setLayout', layouts.navRight)
	},
	navTop(){
		store.commit('setLayout', layouts.navTop)
	},
	navBottom(){
		store.commit('setLayout', layouts.navBottom)
	},
	set(layout){
		store.commit('setLayout', layout)
	}
}

export default router;
