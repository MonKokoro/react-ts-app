import React, { createRef } from 'react';
import { BrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom';

import Login from './page/login';
import Layout from './layout';

import router from './router'

function App() {
    return <RouterProvider router={router} />
    // return <BrowserRouter>
    //     <Routes>
    //         <Route path="/login" element={<Login />}></Route>
    //         <Route path="*" element={<Layout />}></Route>
    //     </Routes>
    // </BrowserRouter>
}

export default App;
