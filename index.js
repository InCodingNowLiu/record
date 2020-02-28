const schedule = require("node-schedule");
const login = require("./record").login;

const recordList = async () => {
  await login("jliu396");
  await login("yding048");
  await login("pchen189");
  await login("rshi037", false);
};

const scheduleCronstyle = () => {
  //每分钟的第30秒定时执行一次:
  schedule.scheduleJob("0 0 8 * * *", () => {
    recordList();
    console.log("scheduleCronstyle:" + new Date());
  });
};

scheduleCronstyle();
