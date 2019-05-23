export default {
  methods: {
    /**
    *  This mixin function is responsible for handle happyetherserver response
    *  input must be a response object from happyetherserver
    *  the response obj must contain a 'code' and a 'msg'
    *  if code is sucesss then return true, else return false
    *  @return bolean
    */
    resReception(resObj) {
      console.log(resObj);
      if (resObj.data.code === 'success') {
        this.$notify({
          title: 'Success',
          message: resObj.data.msg,
          type: 'success',
        });
        return true;
      }
      this.$notify.error({
        title: 'Error',
        message: resObj.data.msg,
      });
      return false;
    },
  },
};
