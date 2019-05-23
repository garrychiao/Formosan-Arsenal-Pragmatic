<template>
	<vue-scroll class="page-dashboard">
    <el-button @click="signOut">
      Sign Out
    </el-button>
		<el-button @click="goto('/members')">
      Members
    </el-button>
	</vue-scroll>
</template>

<script>
import _ from 'lodash';
import firebase from 'firebase';

export default {
	name: 'Dashboard',
	data () {
		return {
			//
		}
	},
	computed: {
		// smallWidget() {
		// 	return this.dashboardWidth >= 970 && this.dashboardWidth <= 1412 && this.windowWidth >= 1200
		// }
  },
  created() {
    this.$notify({
      title: "歡迎",
      type: "success"
    });
  },
	methods: {
		goto (routes) {
			this.$router.push(routes);
		},
		__resizeHanlder: _.throttle(function (e) {
			if(this.resized) {			

				this.asyncComponent = null
				this.removePeity()
				setTimeout(()=>{this.asyncComponent = 'peity'}, 1000)
		
				this.asyncChart1 = false
				this.asyncChart2 = false
				setTimeout(()=>{this.asyncChart1 = true; this.resizeChart1()}, 1000)
				setTimeout(()=>{this.asyncChart2 = true; this.resizeChart2()}, 2500)
			}
			this.resized = true
		}, 700),
		signOut () {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
    },
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

.widget {
	height: 200px;
	position: relative;

	.widget-header {

		.widget-icon-box {
			background: rgba(0, 0, 0, .02);
			border: 1px solid rgba(0, 0, 0, .02);
			border-radius: 4px;
			text-align: center;
			width: 60px;
			padding: 5px;
		}

		.widget-title {
			font-weight: bold;
		}
	}



	.badge-box {
		.badge {
			//background: rgba(0, 0, 0, .02);
			display: inline-block;
			//padding: 2px 5px;
			//border: 1px solid rgba(0, 0, 0, .02);
			border-radius: 4px;
			font-size: 80%;
		}
	}
}


/*@media (max-width: 768px) {
	.el-row {
		//margin-left: 0 !important;
		//margin-right: 0 !important;

		.el-col-24 {
			//padding-left: 0 !important;
			//padding-right: 0 !important;
		}
	}
}*/

.timeline {
	max-width: 1200px;
	margin: 6px;
}
.timeline, .timeline-title {
	color: $text-color;
	line-height: 1.4;
	cursor: default;
	font-family: inherit;
}


/*@media (min-width: 1200px) and (max-width: 1850px) {
	.widget {
		.widget-header {
			.widget-icon-box {
				display: none;
			}
		}
	}
}*/
@media (min-width: 768px) and (max-width: 1040px) {
	.radio-switcher {
		display: none;
	}

	.widget {
		.widget-header {
			.widget-icon-box {
				display: none;
			}
		}
	}
}
@media (max-width: 420px) {
	.radio-switcher {
		display: none;
	}
}
</style>

<style lang="scss">
.page-dashboard {

	.widget {
		.peity {
			position: absolute;
			bottom: -1px;
			left: 0;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
		}
	}
	table.styled {
		.peity {
			margin-right: 10px;
		}
	}

	.vb-content {
		padding: 0 20px;
		box-sizing: border-box !important;
		margin-top: -5px;
		margin-left: -20px;
		margin-right: -20px;
		height: calc(100% + 15px) !important;
		width: calc(100% + 40px) !important;
	}
}

@media (max-width: 768px) {
	.page-dashboard {
		.vb-content {
			padding: 0 5px !important;
			margin: -5px;
			width: calc(100% + 10px) !important;
		}
	}
}
</style>


