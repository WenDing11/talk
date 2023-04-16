//用户登陆和注册的表单项验证的通用代码
/**
 *一个用于验证某一个表单项的构造函数
 */
class FieldValidator {
  //你需要把表单项的ID传给我,还需要告诉我验证规则，通过一个回调函数
  /**
   *构造器
   * @param {String} 文本框的ID
   * @param {Function} 验证文本框规则的函数，当需要对文本框进行验证时会调用该函数。函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回则无错
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }
  /**
   * 验证。验证成功返回true，验证失败返回false
   */
  async validate() {
    //实际上就是调用实例的参数（验证函数）这里需要传递input的值.接收一个返回结果err。有值就是有错
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      //有错误
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  //写一个静态方法 可以通过这个类直接调用，来验证所有表单.给我所有的验证器fieldValidator[],所有的通过才为true
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate()); //验证器数组每一项调用验证，返回一个promise数组
    //但是不需要proms数组 需要知道每一个结果
    const results = await Promise.all(proms);
    return results.every((r) => r);
  }
}
