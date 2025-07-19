import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import datetime
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt
import networkx as nx
from wordcloud import WordCloud
import random
import json
import numpy as np

# Download necessary NLTK data
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

class MedicalDeviceMonitor:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.data = None
        self.alerts = []
        
    def generate_mock_data(self, num_records=100):
        """Generate mock social media data for testing"""
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
        sentiment_weights = [0.15, 0.35, 0.3, 0.15, 0.05]
        
        severity_levels = ["Low", "Medium", "High", "Critical"]
        severity_weights = [0.3, 0.4, 0.2, 0.1]
        
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
    
    def load_data(self, source="mock", num_records=300):
        """Load data from various sources"""
        if source == "mock":
            self.data = self.generate_mock_data(num_records)
        else:
            # In real implementation, load from APIs or databases
            pass
        return self.data
    
    def filter_data(self, start_date=None, end_date=None, devices=None, platforms=None, severity=None):
        """Filter the data based on various criteria"""
        if self.data is None:
            return pd.DataFrame()
        
        df_filtered = self.data.copy()
        
        # Date filtering
        if start_date:
            df_filtered = df_filtered[df_filtered['post_date'].dt.date >= start_date]
        if end_date:
            df_filtered = df_filtered[df_filtered['post_date'].dt.date <= end_date]
        
        # Device filtering
        if devices:
            df_filtered = df_filtered[df_filtered['device_name'].isin(devices)]
        
        # Platform filtering
        if platforms:
            df_filtered = df_filtered[df_filtered['platform'].isin(platforms)]
        
        # Severity filtering
        if severity:
            df_filtered = df_filtered[df_filtered['severity'].isin(severity)]
        
        return df_filtered
    
    def get_key_metrics(self, df=None):
        """Calculate key metrics from the data"""
        if df is None:
            df = self.data
        
        if df.empty:
            return {}
        
        total_events = len(df)
        critical_count = len(df[df['severity'] == 'Critical'])
        negative_count = len(df[df['sentiment'].isin(['Very Negative', 'Negative'])])
        reported_count = len(df[df['reported_to_fda'] == True])
        
        return {
            'total_events': total_events,
            'critical_events': critical_count,
            'negative_sentiment': negative_count,
            'negative_sentiment_pct': (negative_count/total_events*100) if total_events > 0 else 0,
            'fda_reported': reported_count,
            'fda_reported_pct': (reported_count/total_events*100) if total_events > 0 else 0
        }
    
    def create_timeline_chart(self, df=None):
        """Create timeline chart showing events over time"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        events_by_date = df.groupby(df['post_date'].dt.date).size().reset_index(name='count')
        events_by_date.columns = ['date', 'count']
        
        fig = px.line(
            events_by_date, 
            x='date', 
            y='count',
            title='Adverse Events Over Time',
            labels={'date': 'Date', 'count': 'Number of Events'},
        )
        
        return fig
    
    def create_device_comparison_chart(self, df=None):
        """Create bar chart comparing events by device"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        events_by_device = df.groupby('device_name').size().reset_index(name='count')
        events_by_device = events_by_device.sort_values('count', ascending=False)
        
        fig = px.bar(
            events_by_device, 
            x='device_name', 
            y='count',
            title='Events by Device',
            labels={'device_name': 'Device', 'count': 'Number of Events'},
        )
        
        return fig
    
    def create_sentiment_pie_chart(self, df=None):
        """Create pie chart showing sentiment distribution"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        sentiment_counts = df['sentiment'].value_counts().reset_index()
        sentiment_counts.columns = ['sentiment', 'count']
        
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
        
        return fig
    
    def create_sentiment_by_device_chart(self, df=None):
        """Create stacked bar chart showing sentiment by device"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        sentiment_order = ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"]
        sentiment_by_device = df.groupby(['device_name', 'sentiment']).size().reset_index(name='count')
        
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
        
        return fig
    
    def create_event_type_chart(self, df=None):
        """Create bar chart showing events by type"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        event_type_counts = df['event_type'].value_counts().reset_index()
        event_type_counts.columns = ['event_type', 'count']
        event_type_counts = event_type_counts.sort_values('count', ascending=False)
        
        fig = px.bar(
            event_type_counts, 
            x='event_type', 
            y='count',
            title='Events by Type',
            labels={'event_type': 'Event Type', 'count': 'Number of Events'},
        )
        
        return fig
    
    def generate_wordcloud(self, df=None):
        """Generate word cloud from text snippets"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        all_text = " ".join(df['text_snippet'].tolist())
        wordcloud = WordCloud(width=800, height=400, background_color='white').generate(all_text)
        
        plt.figure(figsize=(10, 5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis("off")
        plt.title("Most Common Terms in Event Reports")
        
        return plt
    
    def create_network_graph(self, df=None):
        """Create network graph showing device-event relationships"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        # Create a network graph
        G = nx.Graph()
        
        # Add nodes for devices and event types
        devices = df['device_name'].unique()
        events = df['event_type'].unique()
        
        for device in devices:
            G.add_node(device, type='device')
            
        for event in events:
            G.add_node(event, type='event')
        
        # Add edges between devices and events
        device_event_pairs = df.groupby(['device_name', 'event_type']).size().reset_index(name='weight')
        
        for _, row in device_event_pairs.iterrows():
            G.add_edge(row['device_name'], row['event_type'], weight=row['weight'])
        
        # Draw the graph
        plt.figure(figsize=(12, 8))
        
        # Define positions
        pos = nx.spring_layout(G, seed=42, k=2, iterations=50)
        
        # Draw nodes
        device_nodes = [n for n, attr in G.nodes(data=True) if attr.get('type') == 'device']
        event_nodes = [n for n, attr in G.nodes(data=True) if attr.get('type') == 'event']
        
        nx.draw_networkx_nodes(G, pos, nodelist=device_nodes, node_color='skyblue', node_size=800, alpha=0.8)
        nx.draw_networkx_nodes(G, pos, nodelist=event_nodes, node_color='lightgreen', node_size=600, alpha=0.8)
        
        # Draw edges with weights
        edges = G.edges(data=True)
        weights = [data['weight'] * 0.5 for _, _, data in edges]
        
        nx.draw_networkx_edges(G, pos, width=weights, alpha=0.5, edge_color='gray')
        
        # Add labels
        nx.draw_networkx_labels(G, pos, font_size=8, font_family='sans-serif')
        
        plt.title("Device-Event Relationship Network")
        plt.axis('off')
        
        return plt
    
    def generate_alerts(self, df=None):
        """Generate alerts based on data analysis"""
        if df is None:
            df = self.data
        
        if df.empty:
            return []
        
        alerts = []
        
        # Check for critical events in the last 7 days
        recent_critical = df[
            (df['severity'] == 'Critical') & 
            (df['post_date'] > (datetime.datetime.now() - datetime.timedelta(days=7)))
        ]
        
        for _, row in recent_critical.iterrows():
            alerts.append({
                "level": "Critical",
                "message": f"Critical event reported for {row['device_name']}: {row['event_type']}",
                "date": row['post_date'],
                "platform": row['platform'],
                "device": row['device_name'],
                "event_type": row['event_type']
            })
        
        # Check for trending issues (multiple reports of same issue)
        device_event_counts = df.groupby(['device_name', 'event_type']).size().reset_index(name='count')
        trending_issues = device_event_counts[device_event_counts['count'] > 5]
        
        for _, row in trending_issues.iterrows():
            alerts.append({
                "level": "Warning",
                "message": f"Trending issue: {row['count']} reports of {row['event_type']} for {row['device_name']}",
                "date": datetime.datetime.now(),
                "platform": "Multiple",
                "device": row['device_name'],
                "event_type": row['event_type'],
                "count": row['count']
            })
        
        # Check for sudden sentiment drops
        recent_sentiment = df[df['post_date'] > (datetime.datetime.now() - datetime.timedelta(days=7))]
        if not recent_sentiment.empty:
            avg_sentiment = recent_sentiment['sentiment_score'].mean()
            if avg_sentiment < -0.5:
                alerts.append({
                    "level": "Warning",
                    "message": f"Significant negative sentiment detected (avg: {avg_sentiment:.2f})",
                    "date": datetime.datetime.now(),
                    "platform": "Multiple",
                    "sentiment_score": avg_sentiment
                })
        
        self.alerts = alerts
        return alerts
    
    def generate_fda_report(self, device_name, event_type, severity, event_date, 
                           reporter_name, reporter_role, event_description, 
                           additional_info=None):
        """Generate FDA MedWatch report structure"""
        
        report = {
            "report_id": f"FDA-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}",
            "submission_date": datetime.datetime.now().isoformat(),
            "device_information": {
                "device_name": device_name,
                "event_type": event_type,
                "severity": severity
            },
            "event_information": {
                "event_date": event_date.isoformat() if hasattr(event_date, 'isoformat') else str(event_date),
                "description": event_description
            },
            "reporter_information": {
                "name": reporter_name,
                "role": reporter_role
            },
            "additional_information": additional_info or {}
        }
        
        return report
    
    def export_data(self, df=None, format='json', filename=None):
        """Export data in various formats"""
        if df is None:
            df = self.data
        
        if df.empty:
            return None
        
        if filename is None:
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"medical_device_events_{timestamp}"
        
        if format == 'json':
            # Convert datetime objects to strings for JSON serialization
            df_export = df.copy()
            df_export['post_date'] = df_export['post_date'].dt.strftime('%Y-%m-%d %H:%M:%S')
            return df_export.to_json(f"{filename}.json", orient='records', indent=2)
        elif format == 'csv':
            return df.to_csv(f"{filename}.csv", index=False)
        elif format == 'excel':
            return df.to_excel(f"{filename}.xlsx", index=False)
    
    def analyze_sentiment(self, text):
        """Analyze sentiment of a single text using NLTK"""
        scores = self.sia.polarity_scores(text)
        return scores
    
    def get_summary_report(self, df=None):
        """Generate a comprehensive summary report"""
        if df is None:
            df = self.data
        
        if df.empty:
            return {}
        
        metrics = self.get_key_metrics(df)
        alerts = self.generate_alerts(df)
        
        # Top devices by event count
        top_devices = df['device_name'].value_counts().head(5).to_dict()
        
        # Top event types
        top_events = df['event_type'].value_counts().head(5).to_dict()
        
        # Platform breakdown
        platform_breakdown = df['platform'].value_counts().to_dict()
        
        # Sentiment analysis
        sentiment_breakdown = df['sentiment'].value_counts().to_dict()
        avg_sentiment_score = df['sentiment_score'].mean()
        
        summary = {
            "generation_date": datetime.datetime.now().isoformat(),
            "data_period": {
                "start_date": df['post_date'].min().isoformat(),
                "end_date": df['post_date'].max().isoformat()
            },
            "key_metrics": metrics,
            "alerts": alerts,
            "top_devices": top_devices,
            "top_event_types": top_events,
            "platform_breakdown": platform_breakdown,
            "sentiment_analysis": {
                "breakdown": sentiment_breakdown,
                "average_score": avg_sentiment_score
            }
        }
        
        return summary


# Example usage
if __name__ == "__main__":
    # Initialize the monitor
    monitor = MedicalDeviceMonitor()
    
    # Load mock data
    data = monitor.load_data(source="mock", num_records=300)
    print(f"Loaded {len(data)} records")
    
    # Get key metrics
    metrics = monitor.get_key_metrics()
    print("\nKey Metrics:")
    for key, value in metrics.items():
        print(f"  {key}: {value}")
    
    # Generate alerts
    alerts = monitor.generate_alerts()
    print(f"\nGenerated {len(alerts)} alerts")
    for alert in alerts[:3]:  # Show first 3 alerts
        print(f"  {alert['level']}: {alert['message']}")
    
    # Filter data example
    filtered_data = monitor.filter_data(
        devices=["Insulin Pump XS-200", "Pacemaker PM-500"],
        severity=["High", "Critical"]
    )
    print(f"\nFiltered data: {len(filtered_data)} records")
    
    # Generate summary report
    summary = monitor.get_summary_report()
    print(f"\nSummary report generated for period: {summary['data_period']['start_date']} to {summary['data_period']['end_date']}")
    
    # Create and show charts (uncomment to use)
    # timeline_chart = monitor.create_timeline_chart()
    # timeline_chart.show()
    
    # device_chart = monitor.create_device_comparison_chart()
    # device_chart.show()
    
    # sentiment_chart = monitor.create_sentiment_pie_chart()
    # sentiment_chart.show()
