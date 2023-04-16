//注册的js
const loginIdvalidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号已存在";
  }
});
const nicknameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const loginPwdAgainValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一样";
    }
  }
);
const form = $(".user-form");

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdvalidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdAgainValidator
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form); //传入表单dom，得到一个表单数据对象
  const data = Object.fromEntries(formData.entries());
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功");
    location.href = "./login.html";
  }
};
