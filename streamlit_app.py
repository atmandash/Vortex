import streamlit as st
import streamlit.components.v1 as components
import subprocess
import os
import signal
import atexit
import time
from pathlib import Path

# Page configuration
st.set_page_config(
    page_title="SEPLUS - Sepsis Early Detection",
    page_icon="❤️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to remove Streamlit branding and make it fullscreen
st.markdown("""
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
        .block-container {
            padding-top: 0rem;
            padding-bottom: 0rem;
            padding-left: 0rem;
            padding-right: 0rem;
            max-width: 100%;
        }
        iframe {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100vh;
            border: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    </style>
""", unsafe_allow_html=True)

# Get the directory where this script is located
BASE_DIR = Path(__file__).parent.absolute()

# Server process management
server_process = None

def start_node_server():
    """Start the Node.js server if not already running"""
    global server_process
    
    try:
        # Check if server is already running on port 3000
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 3000))
        sock.close()
        
        if result == 0:
            st.sidebar.success("✅ Server already running on port 3000")
            return True
        
        # Start the server
        st.sidebar.info("🚀 Starting Node.js server...")
        server_process = subprocess.Popen(
            ['npm', 'start'],
            cwd=str(BASE_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid if os.name != 'nt' else None
        )
        
        # Wait for server to start
        time.sleep(3)
        
        # Check if server started successfully
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 3000))
        sock.close()
        
        if result == 0:
            st.sidebar.success("✅ Server started successfully!")
            return True
        else:
            st.sidebar.error("❌ Failed to start server")
            return False
            
    except Exception as e:
        st.sidebar.error(f"❌ Error starting server: {str(e)}")
        return False

def stop_node_server():
    """Stop the Node.js server"""
    global server_process
    if server_process:
        try:
            if os.name != 'nt':
                os.killpg(os.getpgid(server_process.pid), signal.SIGTERM)
            else:
                server_process.terminate()
        except:
            pass

# Register cleanup on exit
atexit.register(stop_node_server)

# Sidebar controls
with st.sidebar:
    st.title("🏥 SEPLUS Control Panel")
    st.markdown("---")
    
    if st.button("🔄 Restart Server", use_container_width=True):
        stop_node_server()
        time.sleep(1)
        start_node_server()
    
    if st.button("🛑 Stop Server", use_container_width=True):
        stop_node_server()
        st.info("Server stopped")
    
    st.markdown("---")
    st.markdown("""
    ### About SEPLUS
    Sepsis Early Detection & Patient Management System
    
    **Features:**
    - Patient Registration
    - Sepsis Screening
    - Doctor Portal
    - Hospital Management
    - Educational Resources
    """)

# Main content - Start server and display the application
if start_node_server():
    # Embed the entire application using an iframe
    components.iframe(
        "http://localhost:3000",
        height=800,
        scrolling=True
    )
else:
    st.error("""
    ### ⚠️ Server Failed to Start
    
    Please ensure:
    1. Node.js is installed
    2. Dependencies are installed (`npm install`)
    3. Port 3000 is available
    4. MongoDB is running (if required)
    
    Try running manually:
    ```bash
    npm start
    ```
    """)
