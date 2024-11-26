import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Login from "../pages/Login.js/Login"
function routes() {
  return (
<Router>
      <Routes>
      <Route path="/" element={<Login/>}/>        
      </Routes>
     </Router>  )
}

export default routes