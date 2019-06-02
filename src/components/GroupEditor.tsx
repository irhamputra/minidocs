import React from 'react';
import {SyncingEditor} from "../SyncingEditor";
import {RouteComponentProps} from "react-router-dom";

export const GroupEditor: React.FC<RouteComponentProps<{ id: string }>> = ({match: {params: {id}}}) => {
    return <div>
        <SyncingEditor groupId={id}/>
    </div>
};
