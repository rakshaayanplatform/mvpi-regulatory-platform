import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    mean_squared_error, mean_absolute_error, r2_score, roc_auc_score,
    f1_score, explained_variance_score
)
import joblib
import io
import base64
from datetime import datetime
import os

# Define CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1E3A8A;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #2563EB;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    .info-box {
        background-color: #EFF6FF;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #BFDBFE;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #F0F9FF;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #BAE6FD;
        margin-bottom: 1rem;
    }
    .warning {
        color: #B91C1C;
        font-weight: bold;
    }
    .success {
        color: #15803D;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Main title and description
    st.title(" Adverse Event Prediction System")
    st.markdown("""
    This application helps you:
    - Upload and manage adverse event data
    - Train machine learning models
    - Generate predictions for potential adverse events
    - Create detailed reports
    """)

    # Sidebar for navigation
    page = st.sidebar.radio(
        "Navigate",
        ("Home", "Data Management", "Model Training", "Prediction", "Visualization", "Help"),
        label_visibility="collapsed"
    )

    # Initialize session state for variables that need to persist between pages
    if 'data' not in st.session_state:
        st.session_state.data = None
    if 'trained_models' not in st.session_state:
        st.session_state.trained_models = {}
    if 'predictions' not in st.session_state:
        st.session_state.predictions = None
    if 'model_metrics' not in st.session_state:
        st.session_state.model_metrics = {}
    if 'feature_importance' not in st.session_state:
        st.session_state.feature_importance = None
    if 'prediction_type' not in st.session_state:
        st.session_state.prediction_type = "classification"  # Default to classification
    if 'model_type' not in st.session_state:
        st.session_state.model_type = "random_forest"  # Default to random forest

    # Constants for sample data
    DEMO_COLUMNS = ['device_id', 'device_type', 'manufacturer', 'model_number', 'patient_age', 
                   'patient_gender', 'patient_weight', 'treatment_duration', 'previous_incidents', 
                   'hospital_setting', 'operator_experience', 'maintenance_frequency',
                   'adverse_event_occurred', 'severity_score']
    
    # This function is just for demonstration and should be called with proper arguments
    # The actual model training happens in the train_model function
    return None

def preprocess_data(data, prediction_type, target_col, test_size=0.2, random_state=42):
    """
    Preprocess the data for model training.
    
    Args:
        data: Input DataFrame
        prediction_type: Type of prediction ('classification' or 'regression')
        target_col: Name of the target column
        test_size: Proportion of data to use for testing
        random_state: Random seed for reproducibility
        
    Returns:
        X_train, X_test, y_train, y_test, preprocessor, numerical_cols, categorical_cols
    """
    # Separate features and target
    X = data.drop(columns=[target_col])
    y = data[target_col]
    
    # Identify numerical and categorical columns
    numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Create preprocessor
    preprocessor = create_preprocessor(numerical_cols, categorical_cols)
    
    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, 
        stratify=y if prediction_type == "classification" else None
    )
    
    return X_train, X_test, y_train, y_test, preprocessor, numerical_cols, categorical_cols

def create_preprocessor(numerical_cols, categorical_cols):
    """Create a preprocessor for numerical and categorical features"""
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_cols) if numerical_cols else ('passthrough', 'passthrough', []),
            ('cat', categorical_transformer, categorical_cols) if categorical_cols else ('passthrough', 'passthrough', [])
        ],
        remainder='drop'  # Drop columns that aren't explicitly transformed
    )
    
    return preprocessor

def train_model(X_train, y_train, preprocessor=None, model_type=None, prediction_type="classification"):
    """
    Train a machine learning model with the given data and parameters.
    
    Args:
        X_train: Training features
        y_train: Training target
        preprocessor: Optional preprocessor (if None, will be created)
        model_type: Type of model to train
        prediction_type: Type of prediction ('classification' or 'regression')
        
    Returns:
        pipeline: Trained pipeline including preprocessing and model
    """
    if model_type is None:
        model_type = st.session_state.get('model_type', 'random_forest')
    
    # If no preprocessor is provided, create a default one
    if preprocessor is None:
        numerical_cols = X_train.select_dtypes(include=['int64', 'float64']).columns.tolist()
        categorical_cols = X_train.select_dtypes(include=['object', 'category']).columns.tolist()
        preprocessor = create_preprocessor(numerical_cols, categorical_cols)
    
    # Initialize the appropriate model based on model_type and prediction_type
    if model_type == "random_forest":
        if prediction_type == "classification":
            model = RandomForestClassifier(n_estimators=100, random_state=42)
        else:  # regression
            model = RandomForestRegressor(n_estimators=100, random_state=42)
    elif model_type == "gradient_boosting":
        if prediction_type == "classification":
            model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        else:  # regression
            model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    elif model_type == "logistic_regression":
        if prediction_type == "classification":
            model = LogisticRegression(max_iter=1000, random_state=42)
        else:
            raise ValueError("Logistic Regression is only for classification tasks")
    else:
        raise ValueError(f"Unsupported model type: {model_type}")
    
    try:
        # Create and train pipeline
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('model', model)
        ])
        
        # Fit the pipeline
        pipeline.fit(X_train, y_train)
        
        # Store the trained model in session state
        st.session_state.trained_model = pipeline
        
        return pipeline
        
    except Exception as e:
        st.error(f"Error training model: {str(e)}")
        st.stop()

def evaluate_model(model, X_test, y_test, prediction_type="classification"):
    """
    Evaluate model performance.
    
    Args:
        model: Trained model or pipeline
        X_test: Test features
        y_test: True target values
        prediction_type: Type of prediction ('classification' or 'regression')
        
    Returns:
        tuple: (metrics_dict, y_pred) where metrics_dict contains relevant metrics
    """
    try:
        # Make predictions
        y_pred = model.predict(X_test)
        
        if prediction_type == "classification":
            # Classification metrics
            report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
            conf_matrix = confusion_matrix(y_test, y_pred)
            
            # Handle binary vs. multi-class classification
            if len(conf_matrix) == 2:  # Binary classification
                tn, fp, fn, tp = conf_matrix.ravel()
                metrics = {
                    'accuracy': report['accuracy'],
                    'precision': report['weighted avg']['precision'],
                    'recall': report['weighted avg']['recall'],
                    'f1': report['weighted avg']['f1-score'],
                    'confusion_matrix': conf_matrix,
                    'true_negatives': int(tn),
                    'false_positives': int(fp),
                    'false_negatives': int(fn),
                    'true_positives': int(tp)
                }
            else:  # Multi-class classification
                metrics = {
                    'accuracy': report['accuracy'],
                    'precision': report['weighted avg']['precision'],
                    'recall': report['weighted avg']['recall'],
                    'f1': report['weighted avg']['f1-score'],
                    'confusion_matrix': conf_matrix
                }
                
            # Add class-specific metrics
            for class_name, class_metrics in report.items():
                if class_name not in ['accuracy', 'macro avg', 'weighted avg'] and isinstance(class_metrics, dict):
                    metrics[f'class_{class_name}_precision'] = class_metrics['precision']
                    metrics[f'class_{class_name}_recall'] = class_metrics['recall']
                    metrics[f'class_{class_name}_f1'] = class_metrics['f1-score']
                    
        else:  # regression
            # Regression metrics
            mse = mean_squared_error(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            metrics = {
                'mse': float(mse),
                'rmse': float(np.sqrt(mse)),
                'mae': float(mae),
                'r2': float(r2),
                'explained_variance': float(explained_variance_score(y_test, y_pred))
            }
        
        return metrics, y_pred
        
    except Exception as e:
        st.error(f"Error evaluating model: {str(e)}")
        # Return empty metrics and predictions in case of error
        return {}, np.array([])

def get_feature_importance(model, numerical_cols, categorical_cols, prediction_type="classification"):
    """
    Extract feature importance from the model.
    
    Args:
        model: Trained pipeline including preprocessing and model
        numerical_cols: List of numerical column names
        categorical_cols: List of categorical column names
        prediction_type: Type of prediction ('classification' or 'regression')
        
    Returns:
        DataFrame with feature importances or None if not available
    """
    try:
        # Check if model supports feature importance
        if not hasattr(model[-1], 'feature_importances_'):
            return None
        
        # Get preprocessor and feature names after preprocessing
        preprocessor = model.named_steps['preprocessor']
        
        # Initialize feature names
        feature_names = []
        
        # Add numerical features
        if numerical_cols:
            feature_names.extend(numerical_cols)
        
        # Add categorical features (after one-hot encoding)
        if categorical_cols and hasattr(preprocessor, 'named_transformers_') and 'cat' in preprocessor.named_transformers_:
            cat_transformer = preprocessor.named_transformers_['cat']
            if hasattr(cat_transformer, 'named_steps') and 'onehot' in cat_transformer.named_steps:
                ohe = cat_transformer.named_steps['onehot']
                if hasattr(ohe, 'categories_'):
                    for i, col in enumerate(categorical_cols):
                        if i < len(ohe.categories_):
                            cat_values = ohe.categories_[i]
                            for val in cat_values:
                                feature_names.append(f"{col}_{val}")
        
        # If no features were found, return None
        if not feature_names:
            return None
            
        # Get feature importances
        importances = model[-1].feature_importances_
        
        # Ensure we don't have more importances than feature names
        if len(importances) > len(feature_names):
            importances = importances[:len(feature_names)]
        elif len(importances) < len(feature_names):
            feature_names = feature_names[:len(importances)]
        
        # Create a dataframe of feature importances
        feature_importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': importances
        }).sort_values('Importance', ascending=False)
        
        return feature_importance_df
        
    except Exception as e:
        st.warning(f"Could not extract feature importance: {str(e)}")
        return None

def generate_prediction_report(data, predictions, prediction_type="classification"):
    """Generate a report from the predictions."""
    if prediction_type == "classification":
        # Add prediction to the dataframe
        result_df = data.copy()
        result_df['predicted_adverse_event'] = predictions
        
        # Calculate risk percentages
        high_risk_count = np.sum(predictions == 1)
        high_risk_percent = (high_risk_count / len(predictions)) * 100
        
        # Group by device type or other interesting dimensions
        device_risk = result_df.groupby('device_type')['predicted_adverse_event'].mean().reset_index()
        device_risk['risk_percentage'] = device_risk['predicted_adverse_event'] * 100
        device_risk = device_risk.sort_values('risk_percentage', ascending=False)
        
        return {
            'result_df': result_df,
            'high_risk_percent': high_risk_percent,
            'device_risk': device_risk
        }
    else:  # regression
        # Add prediction to the dataframe
        result_df = data.copy()
        result_df['predicted_severity'] = predictions
        
        # Calculate severity statistics
        avg_severity = np.mean(predictions)
        high_severity_count = np.sum(predictions >= 7)
        high_severity_percent = (high_severity_count / len(predictions)) * 100
        
        # Group by device type or other interesting dimensions
        device_severity = result_df.groupby('device_type')['predicted_severity'].mean().reset_index()
        device_severity = device_severity.sort_values('predicted_severity', ascending=False)
        
        return {
            'result_df': result_df,
            'avg_severity': avg_severity,
            'high_severity_percent': high_severity_percent,
            'device_severity': device_severity
        }

def get_table_download_link(df, filename="data.csv", text="Download CSV"):
    """Generate a link to download the dataframe as a CSV file."""
    csv = df.to_csv(index=False)
    b64 = base64.b64encode(csv.encode()).decode()
    href = f'<a href="data:file/csv;base64,{b64}" download="{filename}">{text}</a>'
    return href

def plot_confusion_matrix(conf_matrix):
    """Plot a confusion matrix."""
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', ax=ax)
    ax.set_xlabel('Predicted')
    ax.set_ylabel('Actual')
    ax.set_title('Confusion Matrix')
    return fig

def plot_feature_importance(feature_importance_df, top_n=10):
    """
    Plot feature importances.
    
    Args:
        feature_importance_df: DataFrame with 'Feature' and 'Importance' columns
        top_n: Number of top features to display
        
    Returns:
        Matplotlib figure object
    """
    if feature_importance_df is None or feature_importance_df.empty:
        # Create an empty plot with a message
        fig, ax = plt.subplots(figsize=(10, 2))
        ax.text(0.5, 0.5, 'No feature importance data available', 
                ha='center', va='center', fontsize=12)
        ax.axis('off')
        return fig
        
    # Ensure we don't try to plot more features than available
    top_n = min(top_n, len(feature_importance_df))
    top_features = feature_importance_df.head(top_n).sort_values('Importance', ascending=True)
    
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.barh(top_features['Feature'], top_features['Importance'])
    ax.set_xlabel('Importance')
    ax.set_title('Top Feature Importances')
    plt.tight_layout()
    
    return fig

def plot_risk_by_category(data, category_col, prediction_col, prediction_type="classification"):
    """Plot risk or severity by category."""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    if prediction_type == "classification":
        # For classification, plot percentage of adverse events by category
        risk_by_cat = data.groupby(category_col)[prediction_col].mean() * 100
        risk_by_cat = risk_by_cat.sort_values(ascending=False)
        risk_by_cat.plot(kind='bar', ax=ax)
        ax.set_ylabel('Risk Percentage (%)')
        ax.set_title(f'Risk Percentage by {category_col}')
    else:
        # For regression, plot average severity by category
        severity_by_cat = data.groupby(category_col)[prediction_col].mean()
        severity_by_cat = severity_by_cat.sort_values(ascending=False)
        severity_by_cat.plot(kind='bar', ax=ax)
        ax.set_ylabel('Average Severity Score')
        ax.set_title(f'Average Severity Score by {category_col}')
    
    ax.set_xlabel(category_col)
    plt.xticks(rotation=45)
    plt.tight_layout()
    return fig

def plot_correlation_heatmap(data, prediction_col=None):
    """Plot correlation heatmap of numerical features."""
    numerical_data = data.select_dtypes(include=['int64', 'float64'])
    
    # If prediction column is specified, include it
    if prediction_col and prediction_col in data.columns:
        if prediction_col not in numerical_data.columns:
            numerical_data[prediction_col] = data[prediction_col]
    
    # Calculate correlation matrix
    corr_matrix = numerical_data.corr()
    
    # Plot heatmap
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', ax=ax)
    ax.set_title('Correlation Heatmap')
    plt.tight_layout()
    return fig

    # Home page content
    st.markdown("## Welcome to the Adverse Event Prediction System")
    st.markdown("""
    This application helps you:
    - Upload and manage adverse event data
    - Train machine learning models
    - Generate predictions for potential adverse events
    - Create detailed reports
    """)
    st.markdown("<h1 class='main-header'>Adverse Event Prediction System</h1>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        <div class='info-box'>
        <h2 class='sub-header'>Workflow</h2>
        <ol>
            <li><strong>Data Management:</strong> Upload or generate sample data with device information, patient demographics, and historical adverse events.</li>
            <li><strong>Model Training:</strong> Train machine learning models to identify patterns and predict potential adverse events.</li>
            <li><strong>Prediction:</strong> Use trained models to predict risk levels for new devices or scenarios.</li>
            <li><strong>Visualization:</strong> Analyze and visualize results to gain insights into risk factors.</li>
        </ol>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div class='info-box'>
        <h2 class='sub-header'>Key Features</h2>
        <ul>
            <li>Support for both classification (adverse event occurrence) and regression (severity prediction) models</li>
            <li>Interactive visualizations to identify risk patterns</li>
            <li>Feature importance analysis to understand key risk factors</li>
            <li>Export capabilities for reports and predictions</li>
            <li>Model performance metrics and evaluation tools</li>
        </ul>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class='metric-card'>
        <h3>Getting Started</h3>
        <p>Use the navigation panel on the left to move between different sections of the application.</p>
        <p>Start by uploading your data or generating sample data in the <strong>Data Management</strong> section.</p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.session_state.data is not None:
            st.markdown("""
            <div class='metric-card'>
            <h3>Current Status</h3>
            <p>✅ Data loaded</p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.session_state.trained_models:
                st.markdown("""
                <p>✅ Models trained</p>
                """, unsafe_allow_html=True)
            
            if st.session_state.predictions is not None:
                st.markdown("""
                <p>✅ Predictions available</p>
                """, unsafe_allow_html=True)

    # Data Management page
    st.markdown("<h1 class='main-header'>Data Management</h1>", unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["Upload Data", "Generate Sample Data"])
    
    with tab1:
        st.markdown("<h2 class='sub-header'>Upload Your Data</h2>", unsafe_allow_html=True)
        
        uploaded_file = st.file_uploader("Upload CSV file", type="csv")
        
        if uploaded_file is not None:
            try:
                data = pd.read_csv(uploaded_file)
                st.session_state.data = data
                st.success(f"Data loaded successfully! Shape: {data.shape}")
                
                with st.expander("Preview Data"):
                    st.dataframe(data.head())
                
                with st.expander("Data Summary"):
                    st.write("**Data Types:**")
                    st.write(data.dtypes)
                    
                    st.write("**Summary Statistics:**")
                    st.write(data.describe())
                    
                    st.write("**Missing Values:**")
                    missing_data = data.isnull().sum()
                    st.write(missing_data[missing_data > 0])
            
            except Exception as e:
                st.error(f"Error loading data: {str(e)}")
    
    with tab2:
        st.markdown("<h2 class='sub-header'>Generate Sample Data</h2>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class='info-box'>
        This option will create synthetic data for demonstration purposes. The data includes:
        <ul>
            <li>Device information (type, manufacturer, model)</li>
            <li>Patient demographics (age, gender, weight)</li>
            <li>Usage context (hospital setting, operator experience)</li>
            <li>Historical adverse events and severity scores</li>
        </ul>
        </div>
        """, unsafe_allow_html=True)
        
        sample_size = st.slider("Number of samples", min_value=100, max_value=10000, value=1000, step=100)
        
        if st.button("Generate Sample Data"):
            with st.spinner("Generating sample data..."):
                data = create_sample_data(num_samples=sample_size)
                st.session_state.data = data
                
            st.success(f"Sample data generated successfully! Shape: {data.shape}")
            
            with st.expander("Preview Data"):
                st.dataframe(data.head())
            
            with st.expander("Data Summary"):
                st.write("**Data Types:**")
                st.write(data.dtypes)
                
                st.write("**Summary Statistics:**")
                st.write(data.describe())
    
    if st.session_state.data is not None:
        st.markdown("<h2 class='sub-header'>Data Export</h2>", unsafe_allow_html=True)
        st.markdown(get_table_download_link(st.session_state.data, 
                                          filename=f"adverse_event_data_{datetime.now().strftime('%Y%m%d')}.csv", 
                                          text="Download Current Data as CSV"), 
                  unsafe_allow_html=True)

# Model Training page
    # Model Training page
    st.header("Model Training")
    st.markdown("<h1 class='main-header'>Model Training</h1>", unsafe_allow_html=True)
    
    if st.session_state.data is None:
        st.warning("No data available. Please upload or generate data in the Data Management section first.")
    else:
        st.markdown("<h2 class='sub-header'>Configure Training Parameters</h2>", unsafe_allow_html=True)
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            prediction_type = st.radio(
                "Select Prediction Type", 
                ["Classification (Adverse Event Occurrence)", "Regression (Severity Score)"],
                index=0 if st.session_state.prediction_type == "classification" else 1
            )
            st.session_state.prediction_type = "classification" if "Classification" in prediction_type else "regression"
            
            if st.session_state.prediction_type == "classification":
                target_col = st.selectbox(
                    "Select Target Column (Binary)",
                    [col for col in st.session_state.data.columns if st.session_state.data[col].nunique() <= 5],
                    index=list(st.session_state.data.columns).index("adverse_event_occurred") 
                    if "adverse_event_occurred" in st.session_state.data.columns else 0
                )
                model_options = ["Random Forest", "Logistic Regression"]
            else:  # regression
                target_col = st.selectbox(
                    "Select Target Column (Continuous)",
                    [col for col in st.session_state.data.columns if st.session_state.data[col].dtype in ['int64', 'float64']],
                    index=list(st.session_state.data.columns).index("severity_score") 
                    if "severity_score" in st.session_state.data.columns else 0
                )
                model_options = ["Random Forest", "Gradient Boosting"]
        
        with col2:
            selected_model = st.selectbox("Select Model Type", model_options)
            st.session_state.model_type = selected_model.lower().replace(" ", "_")
            
            test_size = st.slider("Test Set Size (%)", min_value=10, max_value=50, value=20, step=5) / 100
            
            feature_cols = st.multiselect(
                "Select Features (optional, leave empty to use all relevant features)",
                [col for col in st.session_state.data.columns if col != target_col],
                []
            )
        
        if st.button("Train Model"):
            with st.spinner("Training model..."):
                try:
                    # Prepare data for training
                    data_to_use = st.session_state.data if not feature_cols else st.session_state.data[[*feature_cols, target_col]]
                    
                    X_train, X_test, y_train, y_test, preprocessor, numerical_cols, categorical_cols = preprocess_data(
                        data_to_use, 
                        prediction_type=st.session_state.prediction_type,
                        target_col=target_col,
                        test_size=test_size
                    )
                    
                    # Train model
                    trained_model = train_model(
                        X_train, 
                        y_train, 
                        preprocessor, 
                        model_type=st.session_state.model_type,
                        prediction_type=st.session_state.prediction_type
                    )
                    
                    # Evaluate model
                    metrics, test_predictions = evaluate_model(
                        trained_model, 
                        X_test, 
                        y_test, 
                        prediction_type=st.session_state.prediction_type
                    )
                    
                    # Get feature importance (if available)
                    feature_importance = get_feature_importance(
                        trained_model, 
                        numerical_cols, 
                        categorical_cols,
                        prediction_type=st.session_state.prediction_type
                    )
                    
                    # Store results in session state
                    model_key = f"{st.session_state.model_type}_{st.session_state.prediction_type}"
                    st.session_state.trained_models[model_key] = {
                        'model': trained_model,
                        'target_col': target_col,
                        'features': feature_cols if feature_cols else [col for col in data_to_use.columns if col != target_col],
                        'numerical_cols': numerical_cols,
                        'categorical_cols': categorical_cols,
                        'has_feature_importance': feature_importance is not None
                    }
                    st.session_state.model_metrics[model_key] = metrics
                    st.session_state.feature_importance = feature_importance
                    
                    st.success(f"Model trained successfully!")
                    
                    # Show a warning if feature importance is not available
                    if feature_importance is None and hasattr(trained_model[-1], 'coef_'):
                        st.info("Note: Feature importance is shown as coefficients for this model type.")
                    elif feature_importance is None:
                        st.info("Note: Feature importance is not available for this model type.")
                    
                except Exception as e:
                    st.error(f"Error training model: {str(e)}")
        
        if st.session_state.trained_models:
            st.markdown("<h2 class='sub-header'>Model Performance</h2>", unsafe_allow_html=True)
            
            # Select model to view
            model_keys = list(st.session_state.trained_models.keys())
            selected_model_key = st.selectbox("Select Model", model_keys, index=len(model_keys)-1)
            
            if selected_model_key in st.session_state.model_metrics:
                metrics = st.session_state.model_metrics[selected_model_key]
                
                col1, col2 = st.columns([3, 2])
                
                with col1:
                    if "classification" in selected_model_key:
                        # Classification metrics
                        st.markdown("<h3>Classification Metrics</h3>", unsafe_allow_html=True)
                        
                        # Display main metrics
                        col_metrics = st.columns(4)
                        with col_metrics[0]:
                            st.metric("Accuracy", f"{metrics.get('accuracy', 0):.4f}")
                        with col_metrics[1]:
                            st.metric("Precision", f"{metrics.get('precision', 0):.4f}")
                        with col_metrics[2]:
                            st.metric("Recall", f"{metrics.get('recall', 0):.4f}")
                        with col_metrics[3]:
                            st.metric("F1 Score", f"{metrics.get('f1', 0):.4f}")
                        
                        # Display confusion matrix if available
                        if 'confusion_matrix' in metrics and metrics['confusion_matrix'] is not None:
                            st.markdown("<h4>Confusion Matrix</h4>", unsafe_allow_html=True)
                            fig = plot_confusion_matrix(metrics['confusion_matrix'])
                            st.pyplot(fig)
                            
                            # For binary classification, show additional metrics
                            if 'true_positives' in metrics:
                                st.markdown("<h4>Binary Classification Metrics</h4>", unsafe_allow_html=True)
                                tp, tn = metrics['true_positives'], metrics['true_negatives']
                                fp, fn = metrics['false_positives'], metrics['false_negatives']
                                
                                st.markdown("""
                                <style>
                                .metric-box {
                                    border: 1px solid #e0e0e0;
                                    border-radius: 5px;
                                    padding: 10px;
                                    margin: 5px 0;
                                    background-color: #f9f9f9;
                                }
                                .metric-box h5 {
                                    margin: 0 0 5px 0;
                                    color: #333;
                                }
                                .metric-value {
                                    font-size: 1.2em;
                                    font-weight: bold;
                                    color: #1f77b4;
                                }
                                </style>
                                <div class='metric-box'>
                                    <h5>True Positives (TP): <span class='metric-value'>{}</span></h5>
                                    <p>Correctly identified positive cases</p>
                                </div>
                                <div class='metric-box'>
                                    <h5>True Negatives (TN): <span class='metric-value'>{}</span></h5>
                                    <p>Correctly identified negative cases</p>
                                </div>
                                <div class='metric-box'>
                                    <h5>False Positives (FP): <span class='metric-value'>{}</span></h5>
                                    <p>Negative cases incorrectly identified as positive</p>
                                </div>
                                <div class='metric-box'>
                                    <h5>False Negatives (FN): <span class='metric-value'>{}</span></h5>
                                    <p>Positive cases incorrectly identified as negative</p>
                                </div>
                                """.format(tp, tn, fp, fn), unsafe_allow_html=True)
                    
                    else:  # regression
                        # Regression metrics
                        st.markdown("<h3>Regression Metrics</h3>", unsafe_allow_html=True)
                        
                        # Display metrics in columns
                        col_metrics = st.columns(2)
                        with col_metrics[0]:
                            st.metric("Mean Absolute Error", f"{metrics.get('mae', 0):.4f}")
                            st.metric("R² Score", f"{metrics.get('r2', 0):.4f}")
                        with col_metrics[1]:
                            st.metric("Mean Squared Error", f"{metrics.get('mse', 0):.4f}")
                            st.metric("Root Mean Squared Error", f"{metrics.get('rmse', 0):.4f}")
                        
                        # Additional regression metrics
                        with st.expander("Additional Metrics"):
                            st.metric("Explained Variance Score", 
                                    f"{metrics.get('explained_variance', 0):.4f}",
                                    help="The proportion to which the model explains the variance of the target variable")
                
                with col2:
                    current_model = st.session_state.trained_models[selected_model_key]
                    if current_model.get('has_feature_importance', False) and st.session_state.feature_importance is not None:
                        st.markdown("<h3>Feature Importance</h3>", unsafe_allow_html=True)
                        fig = plot_feature_importance(st.session_state.feature_importance)
                        st.pyplot(fig)
                    elif hasattr(current_model['model'][-1], 'coef_'):
                        # For models with coefficients (like Logistic Regression)
                        st.markdown("<h3>Model Coefficients</h3>", unsafe_allow_html=True)
                        coef = current_model['model'][-1].coef_[0]
                        feature_names = current_model['features']
                        coef_df = pd.DataFrame({
                            'Feature': feature_names[:len(coef)],
                            'Coefficient': coef
                        }).sort_values('Coefficient', ascending=False)
                        
                        fig, ax = plt.subplots(figsize=(10, 6))
                        sns.barplot(x='Coefficient', y='Feature', data=coef_df.head(10), ax=ax)
                        ax.set_title('Top 10 Feature Coefficients')
                        st.pyplot(fig)
                    else:
                        st.info("Feature importance is not available for this model type.")
            
            # Model export option
            if st.button("Save Current Model"):
                try:
                    model_to_save = st.session_state.trained_models[selected_model_key]['model']
                    # In a real application, we would save to disk
                    # joblib.dump(model_to_save, f"{selected_model_key}_{datetime.now().strftime('%Y%m%d')}.pkl")
                    st.success("Model saved successfully! (Note: In this web app, the model is only saved to session state)")
                except Exception as e:
                    st.error(f"Error saving model: {str(e)}")

# Initialize uploaded_data if it doesn't exist in session state
if 'uploaded_data' not in st.session_state:
    st.session_state.uploaded_data = None

# File uploader for data
uploaded_file = st.file_uploader("Upload your medical device data (CSV)", type="csv")

if uploaded_file is not None:
    st.session_state.uploaded_data = uploaded_file

if st.session_state.uploaded_data is not None:
    try:
        df = pd.read_csv(st.session_state.uploaded_data)
        st.subheader("Uploaded Data Preview")
        st.dataframe(df.head())

        # --- Feature Selection (Simplified Example) ---
        st.sidebar.subheader("Feature Selection")
        if not df.empty:
            all_columns = df.columns.tolist()
            # Heuristic: assume last column is target, rest are features
            default_features = all_columns[:-1] if len(all_columns) > 1 else []
            default_target = all_columns[-1] if len(all_columns) > 0 else None
            
            features = st.sidebar.multiselect("Select Feature Columns", all_columns, default=default_features)
            target_column = st.sidebar.selectbox("Select Target Column (Adverse Event)", all_columns, index=len(all_columns)-1 if default_target else 0)

            if st.button("Train Predictive Model"):
                if not features or not target_column:
                    st.error("Please select feature and target columns.")
                elif target_column in features:
                    st.error("Target column cannot also be a feature column.")
                else:
                    with st.spinner("Training model..."):
                        X = df[features]
                        y = df[target_column]
                        
                        # --- Dummy Preprocessing (Example) ---
                        # In a real scenario, you'd handle categorical data, missing values, scaling etc.
                        # For simplicity, this example assumes numeric features and a binary target.
                        # X = pd.get_dummies(X, drop_first=True) # Example for categorical
                        if not np.issubdtype(y.dtype, np.number):
                             y, _ = pd.factorize(y) # Convert target to numeric if not already

                        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size_ratio, random_state=random_state_seed)

                        # --- Model Training (Example: Logistic Regression) ---
                        model = LogisticRegression(random_state=random_state_seed)
                        try:
                            model.fit(X_train, y_train)
                            y_pred = model.predict(X_test)
                            y_pred_proba = model.predict_proba(X_test)[:, 1] # For ROC curve

                            accuracy = accuracy_score(y_test, y_pred)
                            
                            st.subheader("Model Performance")
                            st.metric(label="Accuracy", value=f"{accuracy:.2f}")

                            # --- Visualizations ---
                            st.subheader("Performance Visualizations")
                            col1, col2 = st.columns(2)

                            with col1:
                                # Confusion Matrix
                                cm = confusion_matrix(y_test, y_pred)
                                fig_cm, ax_cm = plt.subplots()
                                sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax_cm)
                                ax_cm.set_title('Confusion Matrix')
                                ax_cm.set_xlabel('Predicted')
                                ax_cm.set_ylabel('Actual')
                                st.pyplot(fig_cm)
                            
                            with col2:
                                # ROC Curve
                                fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
                                fig_roc, ax_roc = plt.subplots()
                                ax_roc.plot(fpr, tpr, label='ROC Curve')
                                ax_roc.plot([0, 1], [0, 1], 'k--', label='Random Guess')
                                ax_roc.set_title('ROC Curve')
                                ax_roc.set_xlabel('False Positive Rate')
                                ax_roc.set_ylabel('True Positive Rate')
                                ax_roc.legend()
                                st.pyplot(fig_roc)

                            # --- Model Download ---
                            st.subheader("Download Trained Model")
                            model_bytes = io.BytesIO()
                            pickle.dump(model, model_bytes)
                            model_bytes.seek(0)
                            st.download_button(
                                label="Download Model (.pkl)",
                                data=model_bytes,
                                file_name="trained_predictive_model.pkl",
                                mime="application/octet-stream"
                            )
                            st.success("Model trained successfully!")

                        except Exception as e:
                            st.error(f"Error during model training or evaluation: {e}")
                            st.error("Ensure your data is clean and appropriate for the selected model. Check feature types and target variable encoding.")

    except Exception as e:
        st.error(f"Error loading or processing CSV: {e}. Please ensure it's a valid CSV file.")
else:
    st.info("Upload a CSV file containing your data to train a predictive model.")

    st.markdown("---")
    st.info("Note: This application uses machine learning to predict potential adverse events. Ensure your data is properly prepared and anonymized before uploading.")

if __name__ == "__main__":
    main()
