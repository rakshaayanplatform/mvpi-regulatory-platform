import streamlit as st
import pandas as pd
import plotly.express as px
import datetime
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt
import networkx as nx
from wordcloud import WordCloud
import random

# Download necessary NLTK data
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

def generate_mock_data(num_records=100):
    devices = [
        "Insulin Pump XS-200", "Heart Valve Model H-42", "Pacemaker PM-500", 
        "Cochlear Implant CI-10", "Hip Replacement Titanium-Plus",
        "Glucose Monitor G6", "Stent Coronary S3", "Knee Replacement K-2000",
        "Defibrillator D-Shock", "Breast Implant SmoothShell"
    ]
    
    platforms = ["Twitter", "Facebook", "Reddit", "Instagram", "Patient Forums"]
    
    event_types = [
        "Device Malfunction", "Unexpected Pain", "Infection", "Allergic Reaction",
        "Battery Failure", "Connection Issue", "Physical Damage", "Software Error",
        "Unexpected Side Effect", "Post-Surgical Complication"
    ]
    
    sentiment_categories = ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"]
    sentiment_weights = [0.15, 0.35, 0.3, 0.15, 0.05]  # Weighted more toward negative for adverse events
    
    severity_levels = ["Low", "Medium", "High", "Critical"]
    severity_weights = [0.3, 0.4, 0.2, 0.1]
    
    # Generate mock text snippets
    snippets = [
        "The device stopped working after just a few days",
        "I've been experiencing severe pain around the implant site",
        "My device is showing error code E-45 constantly",
        "The battery depleted much faster than expected",
        "I developed an unexpected infection at the site",
        "The device works fine but the app keeps crashing",
        "Had to go to ER when my device malfunctioned",
        "Rash and itching around where the device is attached",
        "Started experiencing dizziness after the procedure",
        "Device working great for 6 months but now having issues",
        "Bleeding around the implant site hasn't stopped",
        "Third replacement in two years - quality issues",
        "App shows different readings than manual checks",
        "Constant beeping from device causing anxiety",
        "Hospital says malfunction is 'normal' but I disagree"
    ]
    
    # Date range (last 90 days)
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=90)
    date_range = (end_date - start_date).days
    
    data = []
    for i in range(num_records):
        device = random.choice(devices)
        platform = random.choice(platforms)
        event_type = random.choice(event_types)
        snippet = random.choice(snippets)
        sentiment = random.choices(sentiment_categories, weights=sentiment_weights)[0]
        severity = random.choices(severity_levels, weights=severity_weights)[0]
        
        # Generate random date within range
        random_days = random.randint(0, date_range)
        post_date = start_date + datetime.timedelta(days=random_days)
        
        # Generate mock sentiment score
        if sentiment == "Very Negative":
            sentiment_score = round(random.uniform(-1.0, -0.6), 2)
        elif sentiment == "Negative":
            sentiment_score = round(random.uniform(-0.6, -0.1), 2)
        elif sentiment == "Neutral":
            sentiment_score = round(random.uniform(-0.1, 0.1), 2)
        elif sentiment == "Positive":
            sentiment_score = round(random.uniform(0.1, 0.6), 2)
        else:  # Very Positive
            sentiment_score = round(random.uniform(0.6, 1.0), 2)
        
        # Add increasing number of events in recent days for trending purposes
        if random_days > date_range - 10 and random.random() < 0.7:
            for _ in range(random.randint(1, 3)):
                data.append({
                    "device_name": device,
                    "event_type": event_type,
                    "platform": platform,
                    "post_date": post_date - datetime.timedelta(days=random.randint(0, 3)),
                    "text_snippet": snippet,
                    "sentiment": sentiment,
                    "sentiment_score": sentiment_score,
                    "severity": severity,
                    "verified": random.choice([True, False]),
                    "reported_to_fda": random.choice([True, False])
                })
        
        data.append({
            "device_name": device,
            "event_type": event_type,
            "platform": platform,
            "post_date": post_date,
            "text_snippet": snippet,
            "sentiment": sentiment,
            "sentiment_score": sentiment_score,
            "severity": severity,
            "verified": random.choice([True, False]),
            "reported_to_fda": random.choice([True, False])
        })
    
    return pd.DataFrame(data)

# Load or generate data
@st.cache_data
def load_data():
    # In a real application, you would load data from APIs or databases
    # For this example, we'll generate mock data
    return generate_mock_data(300)

def main():
    # Main title and description
    st.title("Medical Device Adverse Event Monitoring Dashboard")

    # Load data
    df = load_data()

    # Sidebar for filtering
    st.sidebar.title("Filters")

    # Date filter
    date_range = st.sidebar.date_input(
        "Date Range",
        value=(
            df['post_date'].min().date(),
            df['post_date'].max().date()
        )
    )

    if len(date_range) == 2:
        start_date, end_date = date_range
        df_filtered = df[(df['post_date'].dt.date >= start_date) & (df['post_date'].dt.date <= end_date)]
    else:
        df_filtered = df

    # Device filter
    selected_devices = st.sidebar.multiselect(
        "Select Devices",
        options=df['device_name'].unique(),
        default=[]
    )

    if selected_devices:
        df_filtered = df_filtered[df_filtered['device_name'].isin(selected_devices)]

    # Platform filter
    selected_platforms = st.sidebar.multiselect(
        "Select Platforms",
        options=df['platform'].unique(),
        default=[]
    )

    if selected_platforms:
        df_filtered = df_filtered[df_filtered['platform'].isin(selected_platforms)]

    # Severity filter
    selected_severity = st.sidebar.multiselect(
        "Severity Level",
        options=df['severity'].unique(),
        default=[]
    )

    if selected_severity:
        df_filtered = df_filtered[df_filtered['severity'].isin(selected_severity)]

    # Key metrics
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "Total Events", 
            len(df_filtered),
            f"{len(df_filtered) - len(df[df['post_date'] > (datetime.datetime.now() - datetime.timedelta(days=7))])}"
        )

    with col2:
        critical_count = len(df_filtered[df_filtered['severity'] == 'Critical'])
        st.metric(
            "Critical Events", 
            critical_count,
            f"{critical_count - len(df[(df['severity'] == 'Critical') & (df['post_date'] > (datetime.datetime.now() - datetime.timedelta(days=7)))])}"
        )

    with col3:
        negative_count = len(df_filtered[df_filtered['sentiment'].isin(['Very Negative', 'Negative'])])
        st.metric(
            "Negative Sentiment", 
            negative_count,
            f"{negative_count/len(df_filtered)*100:.1f}%"
        )

    with col4:
        reported_count = len(df_filtered[df_filtered['reported_to_fda'] == True])
        st.metric(
            "FDA Reported", 
            reported_count,
            f"{reported_count/len(df_filtered)*100:.1f}%"
        )

    # Trending analysis section
    st.header("Trending Analysis")

    tab1, tab2 = st.tabs(["Timeline", "Device Comparison"])

    with tab1:
        # Events over time
        events_by_date = df_filtered.groupby(df_filtered['post_date'].dt.date).size().reset_index(name='count')
        events_by_date.columns = ['date', 'count']
        
        fig = px.line(
            events_by_date, 
            x='date', 
            y='count',
            title='Adverse Events Over Time',
            labels={'date': 'Date', 'count': 'Number of Events'},
        )
        st.plotly_chart(fig, use_container_width=True)

    with tab2:
        # Events by device
        if not df_filtered.empty:
            events_by_device = df_filtered.groupby('device_name').size().reset_index(name='count')
            events_by_device = events_by_device.sort_values('count', ascending=False)
            
            fig = px.bar(
                events_by_device, 
                x='device_name', 
                y='count',
                title='Events by Device',
                labels={'device_name': 'Device', 'count': 'Number of Events'},
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.write("No data available with current filters")

    # Sentiment Analysis Section
    st.header("Sentiment Analysis")

    col1, col2 = st.columns(2)

    with col1:
        # Sentiment distribution
        sentiment_counts = df_filtered['sentiment'].value_counts().reset_index()
        sentiment_counts.columns = ['sentiment', 'count']
        
        # Ensure proper ordering of sentiment categories
        sentiment_order = ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"]
        sentiment_counts['sentiment'] = pd.Categorical(
            sentiment_counts['sentiment'], 
            categories=sentiment_order, 
            ordered=True
        )
        sentiment_counts = sentiment_counts.sort_values('sentiment')
        
        fig = px.pie(
            sentiment_counts, 
            values='count', 
            names='sentiment',
            title='Sentiment Distribution',
            color='sentiment',
            color_discrete_map={
                'Very Negative': '#d62728',
                'Negative': '#ff7f0e',
                'Neutral': '#1f77b4',
                'Positive': '#2ca02c',
                'Very Positive': '#9467bd'
            }
        )
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        # Sentiment by device
        sentiment_by_device = df_filtered.groupby(['device_name', 'sentiment']).size().reset_index(name='count')
        
        # Create ordered categorical for proper legend ordering
        sentiment_by_device['sentiment'] = pd.Categorical(
            sentiment_by_device['sentiment'], 
            categories=sentiment_order, 
            ordered=True
        )
        
        fig = px.bar(
            sentiment_by_device, 
            x='device_name', 
            y='count', 
            color='sentiment',
            title='Sentiment by Device',
            labels={'device_name': 'Device', 'count': 'Number of Events'},
            color_discrete_map={
                'Very Negative': '#d62728',
                'Negative': '#ff7f0e',
                'Neutral': '#1f77b4',
                'Positive': '#2ca02c',
                'Very Positive': '#9467bd'
            }
        )
        st.plotly_chart(fig, use_container_width=True)

    # Event Type Analysis
    st.header("Event Type Analysis")

    # Events by type
    event_type_counts = df_filtered['event_type'].value_counts().reset_index()
    event_type_counts.columns = ['event_type', 'count']
    event_type_counts = event_type_counts.sort_values('count', ascending=False)

    fig = px.bar(
        event_type_counts, 
        x='event_type', 
        y='count',
        title='Events by Type',
        labels={'event_type': 'Event Type', 'count': 'Number of Events'},
    )
    st.plotly_chart(fig, use_container_width=True)

    # Event details section
    st.header("Event Details")

    # Detailed data table
    st.dataframe(
        df_filtered[['device_name', 'event_type', 'platform', 'post_date', 'text_snippet', 'sentiment', 'severity', 'reported_to_fda']],
        hide_index=True,
        use_container_width=True
    )

    # Alert System
    st.header("Alert System")

    # Create some mock alerts based on the data
    alerts = []

    # Check for critical events in the last 7 days
    recent_critical = df_filtered[
        (df_filtered['severity'] == 'Critical') & 
        (df_filtered['post_date'] > (datetime.datetime.now() - datetime.timedelta(days=7)))
    ]
    if not recent_critical.empty:
        for _, row in recent_critical.iterrows():
            alerts.append({
                "level": "Critical",
                "message": f"Critical event reported for {row['device_name']}: {row['event_type']}",
                "date": row['post_date'],
                "platform": row['platform']
            })

    # Check for trending issues (multiple reports of same issue)
    device_event_counts = df_filtered.groupby(['device_name', 'event_type']).size().reset_index(name='count')
    trending_issues = device_event_counts[device_event_counts['count'] > 5]
    if not trending_issues.empty:
        for _, row in trending_issues.iterrows():
            alerts.append({
                "level": "Warning",
                "message": f"Trending issue: {row['count']} reports of {row['event_type']} for {row['device_name']}",
                "date": datetime.datetime.now(),
                "platform": "Multiple"
            })

    # Display alerts
    if alerts:
        for alert in alerts:
            if alert["level"] == "Critical":
                st.error(f"{alert['level']}: {alert['message']} ({alert['date'].strftime('%Y-%m-%d')} on {alert['platform']})")
            else:
                st.warning(f"{alert['level']}: {alert['message']}")
    else:
        st.success("No active alerts at this time")

    # NLP Analysis Section
    st.header("Text Analysis")

    col1, col2 = st.columns(2)

    with col1:
        # Word cloud of complaint text
        if not df_filtered.empty:
            all_text = " ".join(df_filtered['text_snippet'].tolist())
            wordcloud = WordCloud(width=800, height=400, background_color='white').generate(all_text)
            
            plt.figure(figsize=(10, 5))
            plt.imshow(wordcloud, interpolation='bilinear')
            plt.axis("off")
            st.pyplot(plt)
        else:
            st.write("No text data available with current filters")

    with col2:
        # Network graph of device/event relationships
        if not df_filtered.empty:
            # Create a network graph
            G = nx.Graph()
            
            # Add nodes for devices and event types
            devices = df_filtered['device_name'].unique()
            events = df_filtered['event_type'].unique()
            
            for device in devices:
                G.add_node(device, type='device')
                
            for event in events:
                G.add_node(event, type='event')
            
            # Add edges between devices and events
            device_event_pairs = df_filtered.groupby(['device_name', 'event_type']).size().reset_index(name='weight')
            
            for _, row in device_event_pairs.iterrows():
                G.add_edge(row['device_name'], row['event_type'], weight=row['weight'])
            
            # Draw the graph
            plt.figure(figsize=(10, 8))
            
            # Define positions
            pos = nx.spring_layout(G, seed=42)
            
            # Draw nodes
            device_nodes = [n for n, attr in G.nodes(data=True) if attr.get('type') == 'device']
            event_nodes = [n for n, attr in G.nodes(data=True) if attr.get('type') == 'event']
            
            nx.draw_networkx_nodes(G, pos, nodelist=device_nodes, node_color='skyblue', node_size=500, alpha=0.8)
            nx.draw_networkx_nodes(G, pos, nodelist=event_nodes, node_color='lightgreen', node_size=400, alpha=0.8)
            
            # Draw edges with weights
            edges = G.edges(data=True)
            weights = [data['weight'] * 0.5 for _, _, data in edges]  # Scale down for visibility
            
            nx.draw_networkx_edges(G, pos, width=weights, alpha=0.5, edge_color='gray')
            
            # Add labels
            nx.draw_networkx_labels(G, pos, font_size=8, font_family='sans-serif')
            
            plt.axis('off')
            st.pyplot(plt)
        else:
            st.write("No data available to generate network graph")

    # Settings and Configuration Section
    st.header("Settings & Configuration")

    with st.expander("API Configuration"):
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Social Media APIs")
            st.text_input("Twitter API Key", type="password")
            st.text_input("Facebook App ID", type="password")
            st.text_input("Reddit Client ID", type="password")
            
            st.subheader("Search Parameters")
            st.multiselect(
                "Platforms to Monitor",
                options=["Twitter", "Facebook", "Reddit", "Instagram", "Patient Forums", "News Sites"],
                default=["Twitter", "Reddit", "Patient Forums"]
            )
        
        with col2:
            st.subheader("Query Configuration")
            st.text_area("Device Keywords", value="insulin pump, heart valve, pacemaker, implant, stent, glucose monitor")
            st.text_area("Event Keywords", value="failure, malfunction, error, pain, infection, broken, recall, side effect")
            
            st.subheader("Monitoring Schedule")
            st.selectbox("Update Frequency", options=["Real-time", "Hourly", "Daily", "Weekly"])
            st.checkbox("Send email alerts", value=True)
            st.checkbox("Auto-report to FDA", value=False)

    with st.expander("NLP Model Configuration"):
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Text Classification")
            st.slider("Relevance Threshold", min_value=0.0, max_value=1.0, value=0.7)
            st.slider("Sentiment Threshold", min_value=-1.0, max_value=1.0, value=-0.3)
        
        with col2:
            st.subheader("Entity Recognition")
            st.slider("Confidence Threshold", min_value=0.0, max_value=1.0, value=0.6)
            st.checkbox("Enable fuzzy matching", value=True)
            st.checkbox("Use medical ontology", value=True)

    # FDA Reporting Section
    st.header("FDA Reporting")

    # Create a form for FDA report submission
    with st.form("fda_report_form"):
        st.subheader("Generate FDA MedWatch Report")
        
        col1, col2 = st.columns(2)
        
        with col1:
            selected_device = st.selectbox("Select Device", options=df['device_name'].unique())
            event_type = st.selectbox("Event Type", options=df['event_type'].unique())
            severity = st.selectbox("Severity", options=["Low", "Medium", "High", "Critical"])
        
        with col2:
            event_date = st.date_input("Event Date")
            reporter_name = st.text_input("Reporter Name")
            reporter_role = st.selectbox("Reporter Role", options=["Healthcare Professional", "Patient", "Caregiver", "Manufacturer", "Other"])
        
        event_description = st.text_area("Event Description")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.checkbox("Patient Harm Occurred", value=False, key="harm_occurred")
            st.checkbox("Device Returned to Manufacturer", value=False, key="device_returned")
        
        with col2:
            st.checkbox("Include Social Media Evidence", value=True, key="include_evidence")
            st.checkbox("Send Report to Manufacturer", value=True, key="send_report")
        
        submitted = st.form_submit_button("Submit Report")
    
    if submitted:
        st.success("Report submitted successfully! MedWatch report number: FDA-2023-12345")

    # Footer with disclaimer
    st.markdown("---")
    st.markdown(
        """
        <div style="text-align: center; color: gray; font-size: small;">
        This dashboard is for demonstration purposes only. In a real implementation, actual data would be collected from social media APIs.
        All data shown is simulated and does not represent real medical device issues.
        </div>
        """, 
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()