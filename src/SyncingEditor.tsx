import React, {useEffect, useRef, useState} from 'react';
import {Editor} from "slate-react";
import {initialValue} from "./slateInitialValue";
import io from 'socket.io-client';
import {Operation, Value} from "slate";
import styled from "styled-components";
import Icon from '@material-ui/core/Icon';
import {Link} from "react-router-dom";

const socket = io('http://localhost:4000');

const EditorWrapper = styled.div`
  margin: 0 120px
`;

const Toolbar = styled.div`
  padding: 10px;
  margin-bottom: 3px;
  background-color: white;
`;

const StyledButton = styled.button`
  padding: 5px 5px 0 5px;
  border: none;
  color: gray;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

interface Props {
    groupId: string
}

export const SyncingEditor: React.FC<Props> = ({groupId}) => {
    const [value, setValue] = useState(initialValue);
    const id = useRef(`${Date.now()}`);
    const editor = useRef<Editor | null>(null);
    const remote = useRef(false);

    useEffect(() => {
        fetch(`http://localhost:4000/group/${groupId}`)
            .then(x => x.json()
                .then(data => {
                    setValue(Value.fromJSON(data));
                })
            );
        const eventName = `new-remote-operations-${groupId}`;
        socket.on(eventName, ({editorId, ops}: { editorId: string, ops: Operation[] }) => {
            if (id.current !== editorId) {
                remote.current = true;
                ops.forEach((op: any) => editor.current!.applyOperation(op));
                remote.current = false;
                setTimeout(() => {
                    console.log('Saved')
                },2000)
            }
        });

        return () => {
            socket.off(eventName)
        }
    }, []);

    return <>
        <EditorWrapper>
            <Toolbar>
                <StyledButton onMouseDown={(e) => {
                    e.preventDefault();
                    editor.current!.toggleMark('bold')
                }}>
                    <Icon>format_bold</Icon>
                </StyledButton>
                <StyledButton onMouseDown={(e) => {
                    e.preventDefault();
                    editor.current!.toggleMark('italic')
                }}>
                    <Icon>format_italic</Icon>
                </StyledButton>
                <StyledButton onMouseDown={(e) => {
                    e.preventDefault();
                    editor.current!.toggleMark('underline')
                }}>
                    <Icon>format_underline</Icon>
                </StyledButton>
                <StyledButton onMouseDown={(e) => {
                    e.preventDefault();
                    editor.current!.toggleMark('link')
                }}>
                    <Icon>insert_link</Icon>
                </StyledButton>
            </Toolbar>

            <Editor
                ref={editor}
                style={{
                    backgroundColor: 'white',
                    maxWidth: '100%',
                    minHeight: 150,
                    boxShadow: '0 10px 6px -6px lightgray',
                    padding: 20
                }}
                value={value}
                renderMark={(props, editor, next) => {
                    if (props.mark.type === 'bold') {
                        return <strong>{props.children}</strong>
                    } else if (props.mark.type === 'italic') {
                        return <em>{props.children}</em>
                    } else if (props.mark.type === 'underline') {
                        return <u>{props.children}</u>
                    } else if (props.mark.type === 'link') {
                        return <Link to={`${props.children}`} target="_blank">{props.children}</Link>
                    }

                    return next()
                }}
                onChange={opts => {
                    setValue(opts.value);
                    const ops = opts.operations
                        .filter(o => {
                            if (o) {
                                return (
                                    o.type !== 'set_selection' &&
                                    o.type !== 'set_value' &&
                                    (!o.data || !o.data.has('source'))
                                )
                            }
                            return false
                        })
                        .toJS()
                        .map((o: any) => ({...o, data: {source: 'one'}}));
                    if (ops.length && !remote.current) {
                        socket.emit('new-operations', {
                            editorId: id.current,
                            ops,
                            value: opts.value.toJSON(),
                            groupId
                        });
                    }
                }}
            />
        </EditorWrapper>
    </>
};
