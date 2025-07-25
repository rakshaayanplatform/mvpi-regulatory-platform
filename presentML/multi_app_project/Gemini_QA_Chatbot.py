import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv

def generate_response(prompt, api_key, model_name):
    """Generate a response using the Gemini model"""
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating response: {str(e)}"

def main():
    st.title("🤖 Gemini AI Q&A Chatbot")
    
    st.markdown("""
    Interact with a powerful Generative AI model for questions and answers. 
    Ensure your Gemini API key is set in the `.env` file or entered below.
    """)

    # --- API Key Management ---
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))  # Load from .env in the same directory
    api_key_env = os.getenv("GEMINI_API_KEY")

    # Sidebar for configuration
    st.sidebar.header("API Configuration")
    
    if api_key_env and api_key_env != "YOUR_GEMINI_API_KEY_HERE":
        st.sidebar.success("Gemini API Key loaded from .env file!")
        api_key = api_key_env
    else:
        api_key = st.sidebar.text_input("Enter your Gemini API Key:", type="password")
        if api_key:
            st.sidebar.success("API Key entered!")

    # Model selection
    model_name = st.sidebar.selectbox(
        "Select Model",
        ["gemini-pro", "gemini-pro-vision"],
        index=0
    )

    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Display chat messages from history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Chat input
    if prompt := st.chat_input("What would you like to know?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message in chat message container
        with st.chat_message("user"):
            st.markdown(prompt)

        # Display assistant response in chat message container
        with st.chat_message("assistant"):
            with st.spinner('Generating response...'):
                if not api_key:
                    response = "Please enter your Gemini API Key in the sidebar to start chatting."
                else:
                    response = generate_response(prompt, api_key, model_name)
                
                st.markdown(response)
                
                # Add assistant response to chat history
                st.session_state.messages.append({"role": "assistant", "content": response})

    # Add a clear chat button
    if st.sidebar.button("Clear Chat"):
        st.session_state.messages = []
        st.rerun()

    # Add a simple footer
    st.sidebar.markdown("---")
    st.sidebar.markdown("### About")
    st.sidebar.markdown("This chatbot uses Google's Gemini AI model for generating responses.")
    st.sidebar.markdown("Your API key is only used for this session and is not stored.")

    # Add a link to get an API key
    st.sidebar.markdown("---")
    st.sidebar.markdown("### Get an API Key")
    st.sidebar.markdown("1. Go to [Google AI Studio](https://makersuite.google.com/)")
    st.sidebar.markdown("2. Sign in with your Google account")
    st.sidebar.markdown("3. Create an API key in the API Keys section")

    # Placeholder for actual QA.py content integration
    # To integrate your 'QA.py':
    # 1. Ensure API key handling is robust (ideally from .env).
    # 2. Implement conversation history management if needed.
    # 3. Connect to any specific data sources or vector stores your QA system uses.
    # 4. Customize the Gemini model and generation parameters as required.

if __name__ == "__main__":
    main()
# 4. Customize the Gemini model and generation parameters as required.
