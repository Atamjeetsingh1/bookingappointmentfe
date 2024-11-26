import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setLoginData } from "Actions";
import { apiCall, displayLog } from "../../util/common";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import cryptoJs from "crypto-js";
import { config } from "../../util/config";
import { Modal, Button } from "reactstrap";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "50%",
    marginRight: "-50%",
    height: "400px",
    transform: "translate(-50%, -50%)",
    borderRadius: "25px",
    boxShadow: "5px 5px rgb(215 215 215)",
  },
};

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordFlag, setShowPasswordFlag] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sentMailRes, setSentMailRes] = useState(false);
  const [isSentMail, setIsSentMail] = useState(false);
  const navigate = useNavigate();
  const regex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onUserLogin = async () => {
    if (email === "") {
      displayLog(0, "Email is required");
    } else if (!regex.test(email)) {
      displayLog(0, "Email is incorrect");
    } else if (password === "") {
      displayLog(0, "Password is required");
    } else {
      let data = {
        email: email.toLowerCase(),
        password: await cryptoJs.AES.encrypt(
          password,
          config.CRYPTO_JS_SECRET_KEY
        ).toString(),
      };

      const response = await apiCall("POST", "logIn", data);
      if (response.code === 1) {
        props.setLoginData(response?.data?.permissions);
        localStorage.setItem(
          "permissions",
          JSON.stringify(response?.data?.permissions)
        );

        const authorization = `Bearer ${response.data.auth_token}`;
        localStorage.setItem("AUTH_TOKEN", authorization);
        localStorage.setItem("username", response.data.admin_data.name);

        displayLog(1, "You are successfully logged in");
        navigate("/app/dashboard");
      }
    }
  };

  const showPassword = () => {
    setShowPasswordFlag(true);
  };

  const hidePassword = () => {
    setShowPasswordFlag(false);
  };

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      onUserLogin();
    }
  };

  const handleChange = (value, name) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const closeModal = () => {
    setIsResetModalOpen(false);
    setResetEmail("");
  };

  const handleResetpassword = async () => {
    if (resetEmail === "") {
      displayLog(0, "Email is required");
    } else if (!regex.test(resetEmail)) {
      displayLog(0, "Email is incorrect");
    } else {
      setIsSentMail(true);
      let data = {
        email: resetEmail?.toLowerCase(),
      };
      const response = await apiCall("POST", "forget-password", data);
      if (response?.code === 1) {
        displayLog(0, response?.message);
        setSentMailRes(true);
        setIsSentMail(false);
        closeModal();
      } else {
        setIsSentMail(false);
        displayLog(response?.code === 1, response?.message);
      }
    }
  };

  return (
    <div className="login-auth">
      <div className="container login-container" id="container">
        <div className="form-container sign-in-container">
          <span className="erff">
            <h1>Login</h1>
            <div className="inputIcon">
              <span className="main_page_left_icon">
                <i className="ti-email"></i>
              </span>
              <input
                type="mail"
                className="mb-0 cus_padding has-input input-lg"
                value={email}
                name="email"
                id="user-mail"
                placeholder="Email"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                onKeyPress={(e) => enterPressed(e)}
                autoComplete="false"
              />
            </div>
            <div className="inputIcon">
              <span className="main_page_left_icon_1">
                <i className="ti-lock"></i>
              </span>
              <input
                value={password}
                className="mt-0 cus_padding has-input input-lg"
                type={showPasswordFlag === true ? "text" : "password"}
                name="password"
                id="pwd"
                placeholder="Password"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                onKeyPress={(e) => enterPressed(e)}
                autoComplete="false"
              />
              {showPasswordFlag === false ? (
                <span
                  className="cus_ey"
                  title="Show Password"
                  onClick={showPassword}
                >
                  <i className="zmdi zmdi-eye"></i>
                </span>
              ) : (
                <span
                  className="cus_ey"
                  title="Hide Password"
                  onClick={hidePassword}
                >
                  <i className="zmdi zmdi-eye-off"></i>
                </span>
              )}
            </div>
            <div className="text-right w-100">
              <span
                className="reset-password-button"
                onClick={() => setIsResetModalOpen(true)}
              >
                Reset Password
              </span>
            </div>
            <button
              className="new_b"
              onClick={() => onUserLogin()}
              style={{ marginTop: "5px" }}
            >
              Login
            </button>
          </span>
        </div>
        <div className="overlay-container signin_back">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              {/* <img
                style={{ width: "350px", maxWidth: "100%" }}
                src={require("../../assets/img/leva-logo-white.png")}
                alt="im_11"
              /> */}
            </div>
          </div>
        </div>
      </div>
      {isResetModalOpen && (
        <Modal
          isOpen={isResetModalOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          className="reset-modal"
          centered
        >
          <div className="">
            <button onClick={closeModal} title="Close Table" className="close">
              &#10005;
            </button>
            <div className="modal-header position-relative border-0">
              <h5 className="modal-title">Reset Password</h5>
            </div>
            <div className="modal-body">
              <div className="modal-body-content">
                <p>
                  Enter your email. If we have this address on file, we'll send
                  you a link to reset your password.
                </p>
                <div className="inputIcon text-center">
                  <span className="main_page_left_icon">
                    <i className="ti-email"></i>
                  </span>
                  <input
                    type="mail"
                    className="mb-0 cus_padding has-input input-lg"
                    value={resetEmail}
                    placeholder="Email"
                    onChange={(e) => setResetEmail(e.target.value)}
                    onKeyPress={(e) => enterPressed(e)}
                    autoComplete="false"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                className="new_b reset-email-button"
                onClick={handleResetpassword}
                style={{ marginTop: "5px" }}
                disabled={isSentMail}
              >
                Send Email
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default connect(null, {
  setLoginData,
})(Login);


// import React, { useEffect, useState } from "react";
// import {useNavigate, withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { setLoginData } from "Actions";
// import { apiCall, displayLog } from "../../util/common";
// import "react-toastify/dist/ReactToastify.css";
// import "./style.scss";
// import cryptoJs from "crypto-js";
// import { config } from "../../util/config";
// import { Modal, Button } from "reactstrap";
// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     width: "50%",
//     marginRight: "-50%",
//     height: "400px",
//     transform: "translate(-50%, -50%)",
//     borderRadius: "25px",
//     boxShadow: "5px 5px rgb(215 215 215)",
//   },
// };
// const Login = (props) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPasswordFlag, setShowPasswordFlag] = useState(false);
//   const [isResetModalOpen, setIsResetModalOpen] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [sentMailRes, setSentMailRes] = useState(false);
//   const [isSentMail, setIsSentMail] = useState(false);
//   const navigate= useNavigate();
//   const regex =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//   const onUserLogin = async () => {
//     if (email == "") {
//       displayLog(0, "Email is required");
//     } else if (!regex.test(email)) {
//       displayLog(0, "Email is incorrect");
//     } else if (password == "") {
//       displayLog(0, "Password is required");
//     } else {
//       let data = {
//         email: email.toLowerCase(),
//         password: await cryptoJs.AES.encrypt(
//           password,
//           config.CRYPTO_JS_SECRET_KEY
//         ).toString(),
//       };

//       const response = await apiCall("POST", "logIn", data);
//       if (response.code == 1) {
//         props.setLoginData(response?.data?.permissions);
//         localStorage.setItem(
//           "permissions",
//           JSON.stringify(response?.data?.permissions)
//         );

//         const authorization = `Bearer ${response.data.auth_token}`;
//         localStorage.setItem("AUTH_TOKEN", authorization);
//         localStorage.setItem("username", response.data.admin_data.name);//usernamefrom backend 

//         displayLog(1, "You are successfully logged in");
//         navigate("/app/dashboard");
//       }
//     }
//   };

//   const showPassword = () => {
//     setShowPasswordFlag(true);
//   };

//   const hidePassword = () => {
//     setShowPasswordFlag(false);
//   };

//   const enterPressed = (event) => {
//     var code = event.keyCode || event.which;//check
//     if (code === 13) {
//       onUserLogin();
//     }
//   };

//   const handleChange = (value, name) => {
//     if (name == "email") {
//       setEmail(value);
//     } else if (name == "password") {
//       setPassword(value);
//     }
//   };

//   const closeModal = () => {
//     setIsResetModalOpen(false);
//     setResetEmail("");
//   };
//   const handleResetpassword = async () => {
//     if (resetEmail == "") {
//       displayLog(0, "Email is required");
//     } else if (!regex.test(resetEmail)) {
//       displayLog(0, "Email is incorrect");
//     } else {
//       setIsSentMail(true);
//       let data = {
//         email: resetEmail?.toLowerCase(),
//       };
//       const response = await apiCall("POST", "forget-password", data);
//       if (response?.code == 1) {
//         displayLog(0, response?.message);
//         setSentMailRes(true);
//         setIsSentMail(false);
//         closeModal();
//       } else {
//         setIsSentMail(false);
//         displayLog(response?.code == 1, response?.message);
//       }
//     }
//   };
//   return (
//     <div className="login-auth">
//       <div className="container login-container" id="container">
//         <div className="form-container sign-in-container">
//           <span className="erff">
//             <h1>Login</h1>
//             <div className="inputIcon">
//               <span className="main_page_left_icon">
//                 <i className="ti-email"></i>
//               </span>
//               <input
//                 type="mail"
//                 className="mb-0 cus_padding has-input input-lg"
//                 value={email}
//                 name="email"
//                 id="user-mail"
//                 placeholder="Email"
//                 onChange={(e) => handleChange(e.target.value, e.target.name)}
//                 onKeyPress={(e) => enterPressed(e)}
//                 autoComplete={false}
//               />
//             </div>
//             <div className="inputIcon">
//               <span className="main_page_left_icon_1">
//                 <i className="ti-lock"></i>
//               </span>
//               <input
//                 value={password}
//                 className="mt-0 cus_padding has-input input-lg"
//                 type={showPasswordFlag == true ? "text" : "password"}
//                 name="password"
//                 id="pwd"
//                 placeholder="Password"
//                 onChange={(e) => handleChange(e.target.value, e.target.name)}
//                 onKeyPress={(e) => enterPressed(e)}
//                 autoComplete={false}
//               />
//               {showPasswordFlag == false ? (
//                 <span
//                   className="cus_ey"
//                   title="Show Password"
//                   onClick={showPassword}
//                 >
//                   <i className="zmdi zmdi-eye"></i>
//                 </span>
//               ) : (
//                 <span
//                   className="cus_ey"
//                   title="Hide Password"
//                   onClick={hidePassword}
//                 >
//                   <i className="zmdi zmdi-eye-off"></i>
//                 </span>
//               )}
//             </div>
//             <div className="text-right w-100">
//               <span
//                 className="reset-password-button"
//                 onClick={() => setIsResetModalOpen(true)}
//               >
//                 Reset Password
//               </span>
//             </div>
//             <button
//               className="new_b"
//               onClick={() => onUserLogin()}
//               style={{ marginTop: "5px" }}
//             >
//               Login
//             </button>
//           </span>
//         </div>
//         <div className="overlay-container signin_back">
//           <div className="overlay">
//             <div className="overlay-panel overlay-right">
//               {/* <img
//                 style={{ width: "350px", maxWidth: "100%" }}
//                 src={require("../../assets/img/leva-logo-white.png")}
//                 alt="im_11"
//               /> */}
//             </div>
//           </div>
//         </div>
//       </div>
//       {isResetModalOpen && (
//         <Modal
//           isOpen={isResetModalOpen}
//           onRequestClose={closeModal}
//           style={customStyles}
//           contentLabel="Example Modal"
//           className="reset-modal"
//           centered
//         >
//           <div className="">
//             <button onClick={closeModal} title="Close Table" className="close">
//               &#10005;
//             </button>
//             <div className="modal-header position-relative border-0">
//               <h5 className="modal-title">Reset Password</h5>
//             </div>
//             <div className="modal-body">
//               <div className="modal-body-content">
//                 <p>
//                   Enter your email. If we have this address on file, we'll send
//                   you a link to reset your password.
//                 </p>
//                 <div className="inputIcon text-center">
//                   <span className="main_page_left_icon">
//                     <i className="ti-email"></i>
//                   </span>
//                   <input
//                     type="mail"
//                     className="mb-0 cus_padding has-input input-lg"
//                     value={resetEmail}
//                     placeholder="Email"
//                     onChange={(e) => setResetEmail(e.target.value)}
//                     onKeyPress={(e) => enterPressed(e)}
//                     autoComplete={false}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <Button
//                 className="new_b reset-email-button"
//                 onClick={handleResetpassword}
//                 style={{ marginTop: "5px" }}
//                 disabled={isSentMail}
//               >
//                 Send Email
//               </Button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default connect(null, { setLoginData, })(Login);
