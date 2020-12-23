import request from "@/utils/request";
export function login(params) {
  return new Promise(async (resolve, reject) => {
    let res = await request.get("", params);
    if (res.status === 200) {
      resolve(res);
    } else {
      reject(res);
    }
  });
}
