import React from 'react';
import {BrowserRouter, Redirect, Route} from "react-router-dom";
import {GroupEditor} from "./components/GroupEditor";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Route path="/"
                       exact
                       render={() => <Redirect to={`/groups/${Date.now()}`}/>}
                />
                <Route path="/groups/:id" component={GroupEditor}/>
            </BrowserRouter>
        </>
    )
};

export default App;
