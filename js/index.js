//验证是否有登陆，没有跳转登陆页，有的话获取到登陆的用户信息
(async function () {
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    //user没值 没登陆
    alert("未登陆或登陆已过期，清重新登陆");
    location.href = "./login.html";
    return;
  }
  const doms = {
    aside: {
      //侧边栏
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    container: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  //下面的代码一定是登陆状态
  setUserInfo();
  loadHistory();
  //设置用户信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //注销事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  //加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    resp.data.map((obj) => addChat(obj));
    scrollBottom();
  }

  //发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
  //根据消息对象，将其添加到页面中
  /**content: "my name is  qiaqia，kla，kla，qia qia qia"
createdAt: 1652347192389
from: "haha"
to: null */
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const time = $$$("div");
    time.className = "chat-date";
    time.innerText = formatDate(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(time);
    doms.container.appendChild(div);
  }

  //让聊天区域的滚动条滚动到底
  function scrollBottom() {
    doms.container.scrollTop = doms.container.scrollHeight;
  }
  //根据时间戳设置时间
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); //从零开始的月份 不足十月+0
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minute}:${second}`;
  }
  //发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return; //什么也没输入
    }
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  window.sendChat = sendChat;
})();
