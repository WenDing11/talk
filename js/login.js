//登陆的js
const loginIdvalidator = new FieldValidator("txtLoginId", function (val) {
  if (!val) {
    return "请填写账号";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdvalidator,
    loginPwdValidator
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form); //传入表单dom，得到一个表单数据对象
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登陆成功");
    location.href = "./index.html";
  } else {
    alert("登陆失败，清检查账号和密码");
  }
};
