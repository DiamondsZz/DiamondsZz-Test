const REQUEST_ADDRESS = "https://taobao1111.ecostudio.cn";
var TOKEN = getToken();
var PLATFORMLIST = [];
var off_on = false;
var TIMER = null;
var HomeGoodsList = [];
var cacheTaobaoList = [];
var cacheHomeList = [];
var cacheTBData = [];
var cacheJDData = [];
var cachePDDData = [];
var cachePersonalDetail = {};
var tbPage = 1;

(function () {
  var Router = function () {
    this.routes = {};
    this.curUrl = "";
  };
  Router.prototype.init = function () {
    window.addEventListener("load", this.reloadPage.bind(this), false);
    window.addEventListener("hashchange", this.reloadPage.bind(this), false);
  };
  Router.prototype.reloadPage = function () {
    this.curUrl = substrAnchor(location.hash) || "/personal";
    if (this.curUrl === "/personal") {
      document.title = "个人中心";
    } else {
      document.title = "导购商城";
    }
    this.routes[this.curUrl]();
  };
  Router.prototype.map = function (key, callback) {
    this.routes[key] = callback;
  };
  window.oRou = Router;
})();

$(function () {
  var oRouter2 = new oRou();
  oRouter2.init();
  off_on = true;

  //问号下标
  const questionMarkIndex = window.location.hash.indexOf("?");
  //当前页面路径
  const currentUrl = window.location.hash.slice(2, questionMarkIndex);
  if (currentUrl !== "recommend") {
    //平台检查
    getPlatformChecked(function (data) {
      PLATFORMLIST = data;
      watchURLChange();
    });
  }

  //相似商品推荐页面
  oRouter2.map("/recommend", function () {
    //页面dom
    const page = document.querySelector(".page-wrapper");

    new Vue({
      el: page,
      data() {
        return {
          //serverIp: "http://deily.appdata.ecofanli.com",
          //serverIp: "https://deilykauizhan.ecofanli.com",
          //serverIp: "http://120.55.71.116:8644",
          //serverIp: "https://appdata.console.ecofanli.com",
          serverIp: "https://taobao1111.ecostudio.cn",
          list: [],
          shops: [],
          loading: false,
          finished: false,
          itemId: undefined,
          userId: undefined,
          deviceWxId: undefined,
          customerId: undefined,
          platformId: undefined,
          itemUrl: undefined,
          couponUrl: undefined,
          //当前复制淘口令
          currentTaobaoCommand: undefined,
          //复制弹窗
          copyModalVisible: false,
        };
      },
      methods: {
        //获取参数
        getParams(name) {
          //问号下标
          const questionMarkIndex = window.location.hash.indexOf("?");
          let query = window.location.hash.substring(questionMarkIndex + 1);
          let vars = query.split("&");
          for (let i = 0; i < vars.length; i++) {
            let item = vars[i].split("=");
            if (item[0] == name) {
              return item[1];
            }
          }
          return undefined;
        },
        getData() {
          this.loading = true;
          fetch(
            `${this.serverIp}/api/v2/recommendation/getSimilarInfo2?itemId=${this.itemId}&userId=${this.userId}&deviceWxId=${this.deviceWxId}&customerId=${this.customerId}&platformId=${this.platformId}`,
            {
              method: "GET",
            }
          )
            .then((res) => res.json())
            .then((response) => {
              if (response.status === 200) {
                this.list = response.data;
                this.onLoad();
              } else {
                this.$toast({
                  duration: 1000, // 持续展示 toast
                  forbidClick: true,
                  message: response.msg || "请求错误",
                  getContainer: () => document.querySelector(".recommend"),
                });
              }
            })
            .catch((error) => {
              this.$toast({
                duration: 1000, // 持续展示 toast
                forbidClick: true,
                message: error || "请求错误",
                getContainer: () => document.querySelector(".recommend"),
              });
            });
        },
        getContainerMount() {
          return document.querySelector(".recommend");
        },
        onLoad() {
          this.loading = true;
          const start = this.shops.length;
          // 数据全部加载完成
          if (start >= this.list.length) {
            //dom发生更新
            this.$nextTick(() => {
              this.loading = false;
              this.finished = true;
            });
          } else {
            for (let i = 0; i < 5; i++) {
              //是否越界
              if (start + i <= this.list.length) {
                this.list[start + i] && this.shops.push(this.list[start + i]);
              } else {
                this.finished = true;
              }
            }
            //dom发生更新
            this.$nextTick(() => {
              this.loading = false;
            });
          }
        },
        //复制粘贴
        copy() {
          this.copyModalVisible = true;
        },
        //点击复制淘口令
        copyTaobaoText() {
          let input = document.createElement("input");
          input.value = this.currentTaobaoCommand;
          //input.style.position = "absolute";
          //input.style.left = -200 + "vw";
          document.body.appendChild(input);
          input.select();
          document.execCommand("Copy");
          document.body.removeChild(input)
        },
        //点击复制
        clickHandle(item) {
          fetch(
            `${this.serverIp}/api/v2/recommendation/getTklInfo?itemId=${item.itemId}&userId=${this.userId}&deviceWxId=${this.deviceWxId}&platformId=${this.platformId}&itemUrl=${item.itemUrl}&couponUrl=${item.couponUrl}`,
            {
              method: "GET",
            }
          )
            .then((res) => res.json())
            .then((response) => {
              if (response.status === 200) {
                this.currentTaobaoCommand = response.msg;
                //淘宝复制
                if (this.platformId === "1") {
                  this.copy();
                }
                //京东、拼多多跳转
                if (this.platformId === "2" || this.platformId === "3") {
                  window.open(response.msg);
                }
              } else {
                this.$toast({
                  duration: 1000, // 持续展示 toast
                  forbidClick: true,
                  message: response.msg || "请求错误",
                  getContainer: () => document.querySelector(".recommend"),
                });
              }
            })
            .catch((error) => {
              this.$toast({
                duration: 1000, // 持续展示 toast
                forbidClick: true,
                message: error || "请求错误",
                getContainer: () => document.querySelector(".recommend"),
              });
            });
        },
      },
      created() {
        this.itemId = this.getParams("itemId") || "";
        this.userId = this.getParams("userId") || "";
        this.deviceWxId = this.getParams("deviceWxId") || "";
        this.customerId = this.getParams("customerId") || "";
        //京东、拼多多
        this.platformId = this.getParams("platformId") || "";
        this.getData();
      },
      mounted() {},
      template: `<div class="index">
      <div class="recommend">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="item" v-for="(item, i) in shops" :key="i">
            <div
              class="item-img"
              :style="{
                backgroundImage: 'url('+item.itemPictUrl+')',
              }"
            ></div>
            <div class="item-des">
              <div class="item-til">
                {{ item.itemTitle }}
              </div>
              <div class="item-money">
                <div class="item-money-item">
                  券价：<span class="item-money-text"
                    >{{ item.couponMoney }}元</span
                  >
                </div>
                <div class="item-money-item">
                  返利： <span class="item-money-text">{{ item.tkMoney }}元</span>
                </div>
              </div>
              <div class="item-action">
                <div class="item-action-item">￥{{ item.itemEndPrice }}</div>
                <div class="item-action-btn">
                  <van-button
                    color="#FF415C"
                    v-if="platformId === '1'"
                    @click="clickHandle(item)"
                    >点击复制淘口令</van-button
                  >
                  <van-button
                    color="#FF415C"
                    v-if="platformId === '2' || platformId === '3'"
                    @click="clickHandle(item)"
                    >点击下单</van-button
                  >
                </div>
              </div>
            </div>
          </div>
        </van-list>
  
        <van-dialog
          class="copy-dialog"
          v-model="copyModalVisible"
          title="提示"
          @confirm="copyTaobaoText"
          confirm-button-text="朕知道了"
          :getContainer="getContainerMount"
        >
          <div class="copy-dialog-text">
            淘口令<span
              id="tb_copy_text"
              class="copy-dialog-command"
              >{{ currentTaobaoCommand }}</span
            >复制成功，请打开手淘进行下单！
          </div>
        </van-dialog>
      </div>
    </div>`,
    });
  });
});

/**
 *
 * -----------------------------------------分隔线-----------------------------------------------
 *
 */

function getToken() {
  let token = "";
  let search = location.search;
  if (search) {
    let searchStr = search.split("=")[1];
    token = getQueryVariable("token");
  }
  return token;
}

function substrAnchor(str) {
  if (str.indexOf("?") !== -1) {
    str = str.split("?")[0].substring(1);
  } else {
    str = str.substring(1);
  }
  return str;
}

function watchURLChange() {
  let navHashNameList = ["jd", "pdd", "tb", "home", "personal"];
  let hash = substrAnchor(location.hash);
  let hashName = hash.slice(1);
  if (navHashNameList.includes(hashName)) {
    if ($("#tabs .tab").length === 0) {
      PLATFORMLIST.forEach(function (item) {
        let tpl = `<a class='tab' href="${item.href}">
                <span class='${item.cls}'></span>
                <h5>${item.name}</h5>
            </a> `;
        $("#tabs").append(tpl);
      });
    }
    $(`.tab .icon-${hashName}`)
      .parent()
      .addClass("select")
      .siblings()
      .removeClass("select");
  }
}
