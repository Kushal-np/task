import React from "react"
import { BrowserRouter , Route , Routes} from "react-router-dom";

const App: React.FC =() =>{
  return(
    <div>
      <Routes>
        <Route path="/" element={<Homepage/>} />
      </Routes>
    </div>
  )
}


export default App ; 