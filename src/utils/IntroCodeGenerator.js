'use strict'
/*
|--------------------------------------------------------------------------
| Intro Code Generator
|--------------------------------------------------------------------------
|
| This utility is responsible for creating the user intro code
| which created from 0-9 and a-z, 6 digits string
|
*/

module.exports = {
  /**
   * generate user introCode
   * 
   * @return [string] user intro code
   */
  GenerateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  // Generates a random alphanumberic character
  GenerateRandomChar() {
    var chars = "1234567890abcdefghijklmnopqrxtuvwxyz"
    var randomNumber = this.GenerateRandomNumber(0, chars.length - 1)
    return chars[randomNumber]
  },
  // Generates a Serial Number, based on a certain mask
  GenerateCodeNumber(mask) {
    var code = ""
    if (mask != null) {
      for (var i = 0; i < mask.length; i++) {
        var maskChar = mask[i]
        code += maskChar === "0" ? this.GenerateRandomChar() : maskChar
      }
    }
    return code
  }
}