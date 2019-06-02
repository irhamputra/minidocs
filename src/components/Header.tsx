import React from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import Icon from "@material-ui/core/Icon";

const StyledHeader = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 120px;
    
    & > a {
      text-decoration: none;
      color: black;
      display: flex;
      align-items: center;
      
      &:hover {
        color: darkgray;
      }
    }
`;

export const Header = () => {
    return <StyledHeader>
        <h1>MiniDocs</h1>
        <Link to={`/group/${Date.now()}`} target="_blank">
            <Icon>add</Icon>
            Create new docs
        </Link>
    </StyledHeader>
};
