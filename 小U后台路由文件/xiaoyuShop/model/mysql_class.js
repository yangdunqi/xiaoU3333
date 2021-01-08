const mysql = require('mysql');
//引入数据库配置文件
const { host, user, password, port, database } = require('./db_config.js');

//封装类(操作mysql数据库的类)
class DbMySql {
    //属性

    //方法
    constructor() {
        //创建mysql连接
        this.mysqlObj = mysql.createConnection({ host, port, user, password, database });
        //连接mysql数据库
        this.mysqlObj.connect();
    }

    //执行sql语句
    queryS(sql) {
        return new Promise((resolve, reject) => {
            this.mysqlObj.query(sql, (err, arr) => {
                if (err) { //失败
                    resolve([err,null]);
                } else { //成功
                    resolve([null, arr]);
                }
            })

        });
    }

    async exec(sql) {
        let arr = await this.queryS(sql);
        return arr;
    }

};

// 将模块暴露出去
module.exports = new DbMySql();

