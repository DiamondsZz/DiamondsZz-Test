// 请求成功
export function requestSuccess(success) {
  this.$notify({
    type: "success",
    message: (success || {}).msg || "请求出现错误，请稍后再试",
    duration: 500
  });
}
// 请求失败
export function requestFailed(err) {
  this.$notify({
    type: "error",
    message: (err || {}).msg || "请求出现错误，请稍后再试",
    duration: 500
  });
}
// 挂载modal
export function mountModal(id) {
  return document.querySelector(id);
}

// 图片base64
export function getBase64More(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// 是否是大于等于0的整数字符串
export function isIntegerGreaterThanZero(val) {
  // 大于等于0的整数
  const pattern = new RegExp("^[0-9]*$");
  return pattern.test(val);
}
// 是否是大于等于0的数字字符串
export function isFloatGreaterThanZero(val) {
  // 大于等于0的数
  const patternFloat = new RegExp("^\\d+(\\.\\d+)?$");
  return patternFloat.test(val);
}
// 是否是整数字符串
export function isInteger(val) {
  // 整数
  const pattern = new RegExp("^-?[0-9]\\d*$");
  return pattern.test(val);
}

// 是否为空
export function utilsIsEmpty(val) {
  return !(val && val.trim());
}
