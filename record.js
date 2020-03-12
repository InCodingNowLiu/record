const axios = require("axios");
const moment = require("moment");

const recordStatus = {
  weekend: `Vacation/Weekend`,
  workAtHome: "Work from home in Mainland China"
};

const regionStatus = {
  atShanghai:
    "Either I or my resident(s) never left Shanghai during the last 14 days.",
  noInShanghai:
    "Either I or my resident(s) never leaves the permanent residence out of Shanghai during the last 14 days."
};

const recordInfo = `尊敬的176****1394客户，您好！根据您的授权查询，您于近14日内曾到访：上海。此为公益服务，查询结果仅供参考，不作为最终判定依据。[中国电信]`;

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

const login = async (juid, inShanghai = true) => {
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
  console.log(checkInRes.data);
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
      resident_status: inShanghai
        ? regionStatus.atShanghai
        : regionStatus.noInShanghai
    }
  });
  console.log(recordRes.data);
  if (juid === "jliu396") {
    await addRecordToWork(parameters.date);
    await saveHealthInfo(parameters.date);
  }
};

//http://65.183.25.201/GetHealthInfoRegistration?guid=jliu396&email=jiqing.j.liu@pwc.com
/*

GUID: "jliu396"
email: "jiqing.j.liu@pwc.com"
seat_info_id: "42"
submit_time: "03/15/2020"
*/
const addRecordToWork = async date => {
  console.log(`date: `, date);
  const bookSeatResult = await axios({
    method: "POST",
    url: "http://65.183.25.201/BookSeat",
    data: {
      GUID: "jliu396",
      email: "jiqing.j.liu@pwc.com",
      seat_info_id: "42",
      submit_time: date
    }
  });
  console.log(`addRecordToWork: `, bookSeatResult.data);
};

//http://65.183.25.201/SaveHealthInfoRegistration

/*
GUID: "jliu396"
room: "42"
email: "jiqing.j.liu@pwc.com"
office_time: "03/15/2020"
chinese_name: "刘吉庆 "
mobile_number: "17602131394"
document_type: "身份证 ID Card"
id_number: "320721199308104611"
residence: "上海市浦东新区创新中路180弄1号403"
depart_from: ""
depart_day: null
depart_city: null
vehicle: ""
stops_along_the_way: "否"
stop_place: ""
traveling_person_info: null
body_temperture: "35.4"
health_status: "无上述异常症状"
travel_to_key_areas: "否"
contact_with_a_patient_with_fever: "否"
contact_with_a_patient: "否"
living_person_status: "否"
my_status: "否"
taken_prevention: "是"
QRCode_info: ""
SMS_info: "尊敬的176****1394客户，您好！根据您的授权查询，您于近14日内曾到访：上海。此为公益服务，查询结果仅供参考，不作为最终判定依据。[中国电信]"

*/
const saveHealthInfo = async date => {
  const healthInfo = await axios({
    method: "POST",
    url: "http://65.183.25.201/SaveHealthInfoRegistration",
    data: {
      GUID: "jliu396",
      room: "42",
      email: "jiqing.j.liu@pwc.com",
      office_time: date,
      chinese_name: "刘吉庆 ",
      mobile_number: "17602131394",
      document_type: "身份证 ID Card",
      id_number: "320721199308104611",
      residence: "上海市浦东新区创新中路180弄1号403",
      depart_from: "",
      depart_day: null,
      depart_city: null,
      vehicle: "",
      stops_along_the_way: "否",
      stop_place: "",
      traveling_person_info: null,
      body_temperture: "35.4",
      health_status: "无上述异常症状",
      travel_to_key_areas: "否",
      contact_with_a_patient_with_fever: "否",
      contact_with_a_patient: "否",
      living_person_status: "否",
      my_status: "否",
      taken_prevention: "是",
      QRCode_info: "",
      SMS_info:
        "尊敬的176****1394客户，您好！根据您的授权查询，您于近14日内曾到访：上海。此为公益服务，查询结果仅供参考，不作为最终判定依据。[中国电信]"
    }
  });
  console.log(`saveHealthInfo: `, healthInfo.data);
};

module.exports = {
  login
};
