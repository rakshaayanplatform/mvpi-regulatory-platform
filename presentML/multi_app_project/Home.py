import streamlit as st
from streamlit_option_menu import option_menu
import backend_utils

# Page configuration - must be the first Streamlit command
st.set_page_config(
    page_title="Unified Medical AI Platform",
    page_icon="🔗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar navigation
with st.sidebar:
    st.title("🔗 Navigation")
    page = option_menu(
        "Main Menu",
        ["Home", "Image to Text OCR", "Global Recalls", 
         "Social Media Monitor", "Predictive Analysis", "Gemini QA Chatbot"],
        icons=['house', 'image', 'globe', 'graph-up', 'bar-chart-line', 'robot'],
        menu_icon="list",
        default_index=0,
        styles={
            "container": {"padding": "5!important", "background-color": "#f8f9fa"},
            "icon": {"color": "orange", "font-size": "16px"}, 
            "nav-link": {"font-size": "16px", "text-align": "left", "margin":"0px", "--hover-color": "#eee"},
            "nav-link-selected": {"background-color": "#0d6efd"},
        }
    )

if page == "Home":
    st.title("🔗 Unified Medical AI Platform")
    
    # Backend status indicator
    with st.spinner('Checking backend connection...'):
        health = backend_utils.check_backend_health()
    
    if health.get('status') == 'success':
        st.success('✅ Backend is connected and running')
        
        # Example of using backend data
        with st.expander("Backend Status Details"):
            st.json(health)
            
            # Example of fetching and displaying analysis data
            with st.spinner('Fetching analysis data...'):
                analysis_data = backend_utils.get_analysis_data()
                if analysis_data.get('status') == 'success':
                    st.metric("Total Analyses", analysis_data['data']['total_analyses'])
                else:
                    st.warning("Could not fetch analysis data")
    else:
        st.warning('⚠️ Backend is not available. Some features may be limited.')
        st.info('Make sure the Django backend server is running.')
    
    st.markdown("""
    Welcome to your integrated AI platform. This application brings together a suite of powerful tools to assist with various medical and research tasks.

    **Navigate through the available tools using the sidebar on the left:**

    -   🏠 **Home**: You are here! Get an overview of the platform.
    -   📸 **Image to Text OCR**: Extract text from images with high accuracy.
    -   🌍 **Global Device Recalls**: Stay updated on medical device recalls worldwide.
    -   📊 **Social Media Monitoring**: Analyze social media trends and sentiments related to health topics.
    -   🔮 **Adverse Event Prediction**: Utilize machine learning to predict potential adverse events.
    -   🤖 **Gemini AI Chatbot**: Get answers and insights from a state-of-the-art AI language model.
    """)
    st.info("This is a demonstration platform. Ensure you have the necessary API keys and configurations set up for full functionality, especially for the Gemini AI Chatbot.")

elif page == "Image to Text OCR":
    # Import and run the OCR app
    from Image_to_Text_OCR import main
    main()

elif page == "Global Recalls":
    # Import and run the Global Recalls app
    from Global_Recalls import main
    main()

elif page == "Social Media Monitor":
    # Import and run the Social Media Monitor app
    from Social_Media_Monitor import main
    main()

elif page == "Predictive Analysis":
    # Import and run the Predictive Analysis app
    from Predictive_Analysis import main
    main()

elif page == "Gemini QA Chatbot":
    # Import and run the Gemini QA Chatbot app
    from Gemini_QA_Chatbot import main
    main()
