import React from 'react';
import {SyncingEditor} from "./SyncingEditor";
import {RouteComponentProps} from "react-router-dom";
import {Header} from "./Header";
import {Footer} from "./Footer";

export const GroupEditor: React.FC<RouteComponentProps<{ id: string }>> = ({match: {params: {id}}}) => {
    return <div>
        <Header/>
        <SyncingEditor groupId={id}/>
        <Footer/>
    </div>
};
