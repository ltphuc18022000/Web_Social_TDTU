import socketio from "socket.io-client";
import { BASE_URL } from '../common/constant';
import React from 'react';

console.log("123123", BASE_URL)
export const socket = socketio.connect(BASE_URL);
export const SocketContext = React.createContext();
