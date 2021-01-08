// 定义类（创建、使用JWT数据）
class AuthJwt {
    // 将数据进行base64转码
    static encodeBase64(str) {
        // 如果传入的数据是对象的话转换为字符串
        if(typeof str == 'object') {
            str = JSON.stringify(str);
        }
        // 将字符串转换为base64类型
        return Buffer.from(str).toString('base64');
    }

    // 将base64的编码转换为utf-8类型
    static decodeBase64(str) {
        return JSON.parse(Buffer.from(str,'base64').toString('utf-8'));
    }

    // 创建JWT数据：
    static createJwtData(uname, uid) {
        // 头信息A
        let headers = { 'alg': 'base64', 'typ': 'JWT' };
        // 有效载荷B：用来存放用户自己的数据
        let payloads = { uname, uid, times: new Date().getTime() };
        // 转码之后的headers：
        let headersBase64 = this.encodeBase64(headers);
        // 转码之后的payload：
        let payloadsBase64 = this.encodeBase64(payloads);

        // 签名C：用来校验JWT数据是否有效
        let signature = this.encodeBase64(`${headersBase64}.${payloadsBase64}.web222#$%`);

        // 将A、B、C拼接起来传出去
        return headersBase64 + '.' + payloadsBase64 + '.' + signature;
    }

    // 使用JWT数据
    static useJwtData (req) {
        // 获取JWT数据
        let curJwtData = req.headers.authorization;
        // 将获取的JWT数据进行分割成数组
        let arr = curJwtData.split('.');
        // console.log(arr.length);
        // 判断JWT格式
        if(arr.length == 3) {
            // 创建签名:
            let signature = this.encodeBase64(arr[0] + '.' + arr[1] + '.web222#$%');
            // console.log(signature);

            // 判断签名是否相等
            if(signature == arr[2]) {
                // 获取payload数据
                let payload = this.decodeBase64(arr[1]);
                // 判断JWT数据是否过期：
                if(new Date().getTime() - payload.times > 60 * 60 * 1000 * 2) { // 过期
                    return false;
                }else {
                    // 将数据绑定到req对象上
                    req.UID = payload.uid;
                    req.UNAME = payload.uname;
                    // console.log(payload.uid,88888);
                    return true;
                }
            }else {     // 签名不正确
                return false;
            }
        }else {     // JWT数据格式不正确
            return false;
        }

    }
};


// 暴露出去
module.exports = AuthJwt;