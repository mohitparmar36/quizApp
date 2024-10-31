import React from 'react';
import { Container } from 'react-bootstrap';

const Layout = ({ headerContent, children }) => {
    return (
        <Container fluid className="p-0" style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Top bar (20% height, dark blue) */}
            <div
                style={{
                    height: '30%',
                    backgroundColor: '#4632db',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    position: 'relative',
                    zIndex: -1
                }}
            >
                {headerContent}
            </div>

            {/* Main Content (80% height, light blue), overlapping the top bar */}
            <div
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    padding: '20px',
                    overflowY: 'auto',
                }}
            >
                {children}
            </div>
        </Container>
    );
};

export default Layout;
