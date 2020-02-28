const axios = require("axios");
const moment = require("moment");

const recordStatus = {
  weekend: `Vacation/Weekend`,
  workAtHome: "Work from home in Mainland China"
};

const transferCurrentDate = () => {
  const currentDate = moment();
  const date = currentDate.format("M/DD/YYYY");
  const week = currentDate.format("dddd");
  console.log(date, week);
  if (week === "Sunday" || week === "Saturday") {
    status = recordStatus.weekend;
  } else {
    status = recordStatus.workAtHome;
  }
  return {
    date,
    status
  };
};

const login = async juid => {
  const loginRes = await axios({
    method: "post",
    url: `http://65.183.25.201/Login?guid=${juid}`
  });
  const userInfo = loginRes.data[0];
  console.log(loginRes.data);
  const checkInRes = await axios({
    method: "get",
    url: `http://65.183.25.201/GetClockinInfo?guid=${userInfo.guid}&email=${userInfo.email}`
  });
  const parameters = transferCurrentDate();
  const recordRes = await axios({
    method: "post",
    url: "http://65.183.25.201/SaveClockinInfo",
    data: {
      GUID: userInfo.guid,
      email: userInfo.email,
      health_status: "Well",
      do_status: parameters.status,
      other_desc: "",
      clockin_time: parameters.date,
      address: "",
      resident_status:
        "Either I or my resident(s) never left Shanghai during the last 14 days."
    }
  });
  console.log(recordRes.data);
};

module.exports = {
  login
};
