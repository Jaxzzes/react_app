import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from "../router";
import { AuthContext } from "../context";
import Loader from "./UI/loader/Loader";

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    if (isLoading) {
        return <Loader />
    }

    return (
        isAuth
            ?
            <Routes>
                {privateRoutes.map(route => 
                    <Route
                        key={route.path}
                        element={<route.component />}
                        path={route.path}
                        exact={route.exact}
                    />
                )}
                <Route path="*" element={<Navigate to="/posts" replace />} />
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route => 
                    <Route
                        key={route.path}
                        element={<route.component />}
                        path={route.path}
                        exact={route.exact}
                    />
                )}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
    );
};

export default AppRouter;

/* <Route path="/about" element={<About />} />
<Route exact path="/posts" element={<Posts />} />
<Route exact path="/posts/:id" element={<PostIdPage />} />
<Route path="/error" element={<Error />} /> */