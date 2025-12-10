import React from 'react';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <div className="content-container">
                    {children}
                </div>
            </main>
            <CommandPalette />
        </div>
    );
};

export default Layout;
