import streamlit as st
import json
import requests

# API configuration
BASE_URL = "http://localhost:8000/api"

def get_analyses():
    """Get all analyses."""
    try:
        response = requests.get(f"{BASE_URL}/analyses/")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Failed to fetch analyses: {str(e)}")
        return []

def create_analysis(title: str, description: str = "", data: dict = None):
    """Create a new analysis."""
    try:
        payload = {
            "title": title,
            "description": description,
            "data": data or {}
        }
        response = requests.post(
            f"{BASE_URL}/analyses/",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Failed to create analysis: {str(e)}")
        return None

def run_analysis(analysis_id: int):
    """Run a specific analysis."""
    try:
        response = requests.post(f"{BASE_URL}/analyses/{analysis_id}/run_analysis/")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Failed to run analysis: {str(e)}")
        return None

def show_analysis_section():
    """Show analysis management UI."""
    st.header("Analysis Management")
    
    # Create new analysis
    with st.expander("Create New Analysis"):
        with st.form("create_analysis_form"):
            title = st.text_input("Title")
            description = st.text_area("Description")
            data = st.text_area("Data (JSON format)", value="{}")
            
            if st.form_submit_button("Create Analysis"):
                try:
                    data_dict = json.loads(data)
                    result = create_analysis(title, description, data_dict)
                    if result:
                        st.success("Analysis created successfully!")
                        st.experimental_rerun()
                except json.JSONDecodeError:
                    st.error("Invalid JSON format")
    
    # List analyses
    st.subheader("Analyses")
    analyses = get_analyses()
    
    if not analyses:
        st.info("No analyses found. Create one above!")
        return
        
    for analysis in analyses:
        with st.expander(f"{analysis['title']} - {analysis['created_at']}"):
            st.write(f"**Description:** {analysis['description']}")
            st.json(analysis['data'])
            
            if st.button(f"Run Analysis {analysis['id']}"):
                result = run_analysis(analysis['id'])
                if result:
                    st.success("Analysis started!")
                    st.json(result)

def main():
    st.set_page_config(page_title="Django + Streamlit Integration", layout="wide")
    st.title("Django + Streamlit Integration")
    
    # Show analysis section directly without authentication
    show_analysis_section()

if __name__ == "__main__":
    main()
