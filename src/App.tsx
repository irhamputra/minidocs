import React from 'react';
import {BrowserRouter, Redirect, Route} from "react-router-dom";
import {GroupEditor} from "./components/GroupEditor";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Route path="/"
                       exact
                       render={() => <Redirect to={`/group/${Date.now()}`}/>}
                />
                <Route path="/group/:id" component={GroupEditor}/>
            </BrowserRouter>
        </>
    )
};

export default App;
