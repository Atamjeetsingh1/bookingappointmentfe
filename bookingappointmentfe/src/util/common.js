// common.js
import { config } from "./config";
import axios from "axios";
import { toast, cssTransition } from "react-toastify";
import Swal from "sweetalert2";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";
import { navigate } from "./navigateHelper"; // Import the navigate function

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});

export const apiCall = async (method, url, reqData, params, header) => {
  return new Promise((resolve, reject) => {
    let headers;
    if (header) {
      headers = header;
    } else {
      headers = {
        language: config.LANGUAGE,
        authorization: config.AUTH_TOKEN,
        device_id: config.DEVICE_ID,
        device_type: 0,
        os: config.OS,
        web_app_version: config.VERSION,
        Accept: "*/*",
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      };
    }
    if (localStorage.getItem("AUTH_TOKEN") !== null) {
      headers.authorization = localStorage.getItem("AUTH_TOKEN");
    }
    return axios({
      method: method,
      url: config.API_BASE_URL + url,
      data: reqData,
      headers: headers,
      params: params,
    })
      .then(async (response) => {
        let data = response.data;
        if (data.code == 401) {
          await refreshToken();
        } else if (data.code == 0) {
          resolve(data);
          displayLog(0, data.message);
        } else {
          resolve(data);
        }
      })
      .catch(async (error) => {
        if (error && error.response.data.code == 401) {
          await refreshToken();
        } else if (error && error.response.data.code == 400) {
          displayLog(0, error.response.data.message);
        } else if (error && error.response.data.code == 500) {
          displayLog(0, error.response.data.message);
        } else if (error && error.response) {
          displayLog(3, "Something isn't working. This may be because of a technical error.");
        } else {
          displayLog(3, "Something isn't working. This may be because of a technical error.");
        }
        return error;
      });
  });
};

export const displayLog = (code, message) => {
  if (code == 0) {
    toast.error(message, {
      progress: undefined,
      transition: bounce,
    });
  } else if (code == 1) {
    toast.success(message, {
      progress: undefined,
      transition: bounce,
    });
  } else if (code == 2) {
    toast.info(message, {
      progress: undefined,
      transition: bounce,
    });
  } else {
    toast.warning(message, {
      progress: undefined,
      transition: bounce,
    });
  }
};

export const refreshToken = () => {
  let refreshTokenHeader = {
    auth_token: localStorage?.getItem("AUTH_TOKEN"),
    language: config.LANGUAGE,
    refresh_token: config.REFRESH_TOKEN_DEFAULT,
    device_id: config.DEVICE_ID,
    device_type: 0,
    os: config.OS,
    android_app_version: config.VERSION,
    ios_app_version: config.VERSION,
  };

  return axios({
    method: "GET",
    url: config.API_BASE_URL + "refreshToken",
    headers: refreshTokenHeader,
  })
    .then(async (response) => {
      if (response.data.code == 1) {
        localStorage.setItem("AUTH_TOKEN", response.data.data.new_token);
        window.location.reload();
      } else {
        if (await confirmBoxRefreshToken("User", "Session expired, please login again")) {
          localStorage.clear();
          navigate("/signin");
        }
      }
    })
    .catch((error) => {});
};

export const capitalizeFirstLetter = (text) => {
  text = text.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1).trim();
};

export function capitalizeEveryFirstLetter(str) {
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export const tConvert = (time) => {
  time = time
    ?.toString()
    ?.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) {
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};

tConvert("18:00:00");

export const confirmBoxRefreshToken = (title, message) => {
  return new Promise((resolve, reject) => {
    let obj = {
      text: message,
      showCancelButton: false,
      cancelButtonText: "Cancel",
      confirmButtonText: `Ok`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    };

    if (title) obj.title = title;
    Swal.fire(obj).then((result) => {
      if (result.isConfirmed) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

// Other utility functions remain the same...

// Other utility functions remain the same...

// import { config } from "./config";
// import axios from "axios";
// import { toast, cssTransition } from "react-toastify";
// import Swal from "sweetalert2";
// import "animate.css";
// import "react-toastify/dist/ReactToastify.css";
// import useCustomNavigation from './useCustomNavigation';

// const bounce = cssTransition({
//   enter: "animate__animated animate__bounceIn",
//   exit: "animate__animated animate__bounceOut",
// });
// export const apiCall = async (method, url, reqData, params, header) => {
//   return new Promise((resolve, reject) => {
//     let headers;
//     if (header) {
//       headers = header;
//     } else {
//       headers = {
//         language: config.LANGUAGE,
//         authorization: config.AUTH_TOKEN,
//         device_id: config.DEVICE_ID,
//         device_type: 0,
//         os: config.OS,
//         web_app_version: config.VERSION,
//         Accept: "*/*",
//         "Content-Type": "application/json",
//         "access-control-allow-origin": "*",
//       };
//     }
//     if (localStorage.getItem("AUTH_TOKEN") !== null) {
//       headers.authorization = localStorage.getItem("AUTH_TOKEN");
//     }
//     return axios({
//       method: method,
//       url: config.API_BASE_URL + url,
//       data: reqData,
//       headers: headers,
//       params: params,
//     })
//       .then(async (response) => {
//         let data = response.data;
//         if (data.code == 401) {
//           // resolve(data);
//           await refreshToken();
//         } else if (data.code == 0) {
//           resolve(data);
//           displayLog(0, data.message);
//         } else {
//           resolve(data);
//         }
//       })
//       .catch(async (error) => {
//         if (error && error.response.data.code == 401) {
//           await refreshToken();
//         } else if (error && error.response.data.code == 400) {
//           displayLog(0, error.response.data.message);
//         } else if (error && error.response.data.code == 500) {
//           displayLog(0, error.response.data.message);
//         } else if (error && error.response) {
//           displayLog(
//             3,
//             "Something isn't working. This may be because of a technical error."
//           );
//         } else {
//           displayLog(
//             3,
//             "Something isn't working. This may be because of a technical error."
//           );
//         }
//         return error;
//       });
//   });
// };

// export const displayLog = (code, message) => {
//   if (code == 0) {
//     toast.error(message, {
//       progress: undefined,
//       transition: bounce,
//     });
//   } else if (code == 1) {
//     toast.success(message, {
//       progress: undefined,
//       transition: bounce,
//     });
//   } else if (code == 2) {
//     toast.info(message, {
//       progress: undefined,
//       transition: bounce,
//     });
//   } else {
//     toast.warning(message, {
//       progress: undefined,
//       transition: bounce,
//     });
//   }
// };


// export const refreshToken = () => {
//   const { handleNavigation } = useCustomNavigation();

//   let refreshTokenHeader = {
//     auth_token: localStorage?.getItem("AUTH_TOKEN"),
//     language: config.LANGUAGE,
//     refresh_token: config.REFRESH_TOKEN_DEFAULT,
//     device_id: config.DEVICE_ID,
//     device_type: 0,
//     os: config.OS,
//     android_app_version: config.VERSION,
//     ios_app_version: config.VERSION,
//   };

//   return axios({
//     method: "GET",
//     url: config.API_BASE_URL + "refreshToken",
//     headers: refreshTokenHeader,
//   })
//     .then(async (response) => {
//       if (response.data.code == 1) {
//         localStorage.setItem("AUTH_TOKEN", response.data.data.new_token);
//         window.location.reload();
//       } else {
//         if (await confirmBoxRefreshToken("User", "Session expired, please login again")) {
//           localStorage.clear();
//           handleNavigation("/signin");
//         }
//       }
//     })
//     .catch((error) => {});
// };

// export const capitalizeFirstLetter = (text) => {
//   text = text.replace(/_/g, " ");
//   return text.charAt(0).toUpperCase() + text.slice(1).trim();
// };
// export function capitalizeEveryFirstLetter(str) {
//   return str.split(' ').map(word => {
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   }).join(' ');
// }
// export const tConvert = (time) => {
//   time = time
//     ?.toString()
//     ?.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
//   if (time.length > 1) {
//     // If time format correct
//     time = time.slice(1); // Remove full string match value
//     time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
//     time[0] = +time[0] % 12 || 12; // Adjust hours
//   }
//   return time.join(""); // return adjusted time or original string
// };

// tConvert("18:00:00");

// export const confirmBoxRefreshToken = (title, message) => {
//   return new Promise((resolve, reject) => {
//     let obj = {
//       // title: message,
//       text: message,
//       showCancelButton: false,
//       cancelButtonText: "Cancel",
//       confirmButtonText: `Ok`,
//       showClass: {
//         popup: "animate__animated animate__fadeInDown",
//       },
//       hideClass: {
//         popup: "animate__animated animate__fadeOutUp",
//       },
//     };

//     if (title) obj.title = title;
//     Swal.fire(obj).then((result) => {
//       if (result.isConfirmed) {
//         resolve(1);
//       } else {
//         resolve(0);
//       }
//     });
//   });
// };

// export const confirmBox = (title, message) => {
//   return new Promise((resolve, reject) => {
//     let obj = {
//       // title: title ? title: null,
//       text: title !== undefined ? message.concat(" ", title, " ?") : message,
//       showCancelButton: true,
//       cancelButtonText: "No",
//       confirmButtonText: `Yes`,
//       showClass: {
//         popup: "animate__animated animate__fadeInDown",
//       },
//       hideClass: {
//         popup: "animate__animated animate__fadeOutUp",
//       },
//     };

//     // if (title) {obj.title = title};
//     Swal.fire(obj).then((result) => {
//       if (result.isConfirmed) {
//         resolve(1);
//       } else {
//         resolve(0);
//       }
//     });
//   });
// };


// export const isValidEmail = (email) => {
//   const emailRegex =
//     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(email);
// };

// export const permissionObj = {
//   Dashboard: "dashboard",
//   User: "user",
//   Interest: "interest",
//   Article: "article",
//   Meditation: "meditation",
//   Video: "video",
//   Milestone: "milestone",
//   Consultant: "consultant",
//   Notification: "notification",
//   "CMS Page": "cms page",
//   "Subscription Message": "subscription message",
//   "Mom Concern": "mom concern",
//   "Banner Image": "banner image",
//   "Baby Profile Image": "baby profile image",
//   "Weekly Notification": "weekly notification",
//   "Access Permission": "access permission",
//   "Business Accounts": "subAdmin",
//   "Activity Logs": "activity logs",
// };

// export const arrayNumbers = (length) =>
//   Array.from({ length: length }, (_, index) => index);


// export function capitalizeOnlyFirstLetter(string) {
//   if (typeof string !== 'string' || string.length === 0) {
//     return string;
//   }
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// }
