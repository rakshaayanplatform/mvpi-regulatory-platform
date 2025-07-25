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
    f1_score, explained_variance_score, roc_curve
)
import joblib
import pickle
import io
import base64
from datetime import datetime
import os


class AdverseEventPredictor:
    """
    A comprehensive class for predicting adverse events in medical devices.
    Supports both classification (event occurrence) and regression (severity prediction).
    """
    
    def __init__(self):
        self.trained_models = {}
        self.model_metrics = {}
        self.feature_importance = None
        self.data = None
        self.predictions = None
        self.prediction_type = "classification"
        self.model_type = "random_forest"
        
    def load_data(self, data_path=None, data_frame=None):
        """
        Load data from CSV file or DataFrame.
        
        Args:
            data_path: Path to CSV file
            data_frame: Pandas DataFrame
            
        Returns:
            DataFrame: Loaded data
        """
        if data_path:
            self.data = pd.read_csv(data_path)
        elif data_frame is not None:
            self.data = data_frame.copy()
        else:
            raise ValueError("Either data_path or data_frame must be provided")
        
        print(f"Data loaded successfully! Shape: {self.data.shape}")
        return self.data
    
    def create_sample_data(self, num_samples=1000):
        """
        Generate sample adverse event data for demonstration.
        
        Args:
            num_samples: Number of samples to generate
            
        Returns:
            DataFrame: Generated sample data
        """
        np.random.seed(42)
        
        # Device types and manufacturers
        device_types = ['Pacemaker', 'Defibrillator', 'Insulin Pump', 'Ventilator', 'Dialysis Machine', 'MRI Scanner']
        manufacturers = ['MedTech Corp', 'HealthDevice Inc', 'BioMed Solutions', 'MediCare Systems', 'TechMed Ltd']
        
        # Generate sample data
        data = {
            'device_id': [f'DEV_{i:05d}' for i in range(num_samples)],
            'device_type': np.random.choice(device_types, num_samples),
            'manufacturer': np.random.choice(manufacturers, num_samples),
            'model_number': [f'MODEL_{np.random.randint(1000, 9999)}' for _ in range(num_samples)],
            'patient_age': np.random.normal(65, 15, num_samples).clip(18, 95),
            'patient_gender': np.random.choice(['Male', 'Female'], num_samples),
            'patient_weight': np.random.normal(70, 15, num_samples).clip(40, 150),
            'treatment_duration': np.random.exponential(30, num_samples).clip(1, 365),
            'previous_incidents': np.random.poisson(0.3, num_samples),
            'hospital_setting': np.random.choice(['ICU', 'General Ward', 'Emergency', 'Outpatient'], num_samples),
            'operator_experience': np.random.normal(5, 2, num_samples).clip(0.5, 20),
            'maintenance_frequency': np.random.choice(['Weekly', 'Monthly', 'Quarterly', 'Yearly'], num_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Generate target variables based on realistic relationships
        # Risk factors for adverse events
        risk_score = (
            (df['patient_age'] - 65) / 30 * 0.3 +
            (df['previous_incidents'] * 0.4) +
            (df['treatment_duration'] / 100 * 0.2) +
            np.random.normal(0, 0.3, num_samples)
        )
        
        # Binary adverse event occurrence
        df['adverse_event_occurred'] = (risk_score > np.percentile(risk_score, 80)).astype(int)
        
        # Severity score (1-10 scale)
        df['severity_score'] = np.clip(
            np.random.normal(5, 2, num_samples) + risk_score * 2,
            1, 10
        )
        
        self.data = df
        return df
    
    def preprocess_data(self, target_col, test_size=0.2, random_state=42):
        """
        Preprocess the data for model training.
        
        Args:
            target_col: Name of the target column
            test_size: Proportion of data to use for testing
            random_state: Random seed for reproducibility
            
        Returns:
            tuple: X_train, X_test, y_train, y_test, preprocessor, numerical_cols, categorical_cols
        """
        if self.data is None:
            raise ValueError("No data loaded. Please load data first.")
        
        # Separate features and target
        X = self.data.drop(columns=[target_col])
        y = self.data[target_col]
        
        # Identify numerical and categorical columns
        numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
        categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
        
        # Create preprocessor
        preprocessor = self._create_preprocessor(numerical_cols, categorical_cols)
        
        # Split data into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, 
            stratify=y if self.prediction_type == "classification" else None
        )
        
        return X_train, X_test, y_train, y_test, preprocessor, numerical_cols, categorical_cols
    
    def _create_preprocessor(self, numerical_cols, categorical_cols):
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
            remainder='drop'
        )
        
        return preprocessor
    
    def train_model(self, target_col, model_type=None, prediction_type=None, test_size=0.2, random_state=42):
        """
        Train a machine learning model with the given parameters.
        
        Args:
            target_col: Name of the target column
            model_type: Type of model to train ('random_forest', 'gradient_boosting', 'logistic_regression')
            prediction_type: Type of prediction ('classification' or 'regression')
            test_size: Proportion of data to use for testing
            random_state: Random seed for reproducibility
            
        Returns:
            dict: Training results including model, metrics, and feature importance
        """
        if model_type:
            self.model_type = model_type
        if prediction_type:
            self.prediction_type = prediction_type
        
        # Preprocess data
        X_train, X_test, y_train, y_test, preprocessor, numerical_cols, categorical_cols = self.preprocess_data(
            target_col, test_size, random_state
        )
        
        # Initialize the appropriate model
        if self.model_type == "random_forest":
            if self.prediction_type == "classification":
                model = RandomForestClassifier(n_estimators=100, random_state=random_state)
            else:
                model = RandomForestRegressor(n_estimators=100, random_state=random_state)
        elif self.model_type == "gradient_boosting":
            if self.prediction_type == "classification":
                model = GradientBoostingClassifier(n_estimators=100, random_state=random_state)
            else:
                model = GradientBoostingRegressor(n_estimators=100, random_state=random_state)
        elif self.model_type == "logistic_regression":
            if self.prediction_type == "classification":
                model = LogisticRegression(max_iter=1000, random_state=random_state)
            else:
                raise ValueError("Logistic Regression is only for classification tasks")
        else:
            raise ValueError(f"Unsupported model type: {self.model_type}")
        
        # Create and train pipeline
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('model', model)
        ])
        
        # Fit the pipeline
        pipeline.fit(X_train, y_train)
        
        # Evaluate model
        metrics, test_predictions = self._evaluate_model(pipeline, X_test, y_test)
        
        # Get feature importance
        feature_importance = self._get_feature_importance(pipeline, numerical_cols, categorical_cols)
        
        # Store results
        model_key = f"{self.model_type}_{self.prediction_type}"
        self.trained_models[model_key] = {
            'model': pipeline,
            'target_col': target_col,
            'numerical_cols': numerical_cols,
            'categorical_cols': categorical_cols,
            'has_feature_importance': feature_importance is not None
        }
        self.model_metrics[model_key] = metrics
        self.feature_importance = feature_importance
        
        print(f"Model trained successfully!")
        print(f"Model key: {model_key}")
        
        return {
            'model': pipeline,
            'metrics': metrics,
            'feature_importance': feature_importance,
            'test_predictions': test_predictions
        }
    
    def _evaluate_model(self, model, X_test, y_test):
        """
        Evaluate model performance.
        
        Args:
            model: Trained model or pipeline
            X_test: Test features
            y_test: True target values
            
        Returns:
            tuple: (metrics_dict, y_pred)
        """
        # Make predictions
        y_pred = model.predict(X_test)
        
        if self.prediction_type == "classification":
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
    
    def _get_feature_importance(self, model, numerical_cols, categorical_cols):
        """
        Extract feature importance from the model.
        
        Args:
            model: Trained pipeline
            numerical_cols: List of numerical column names
            categorical_cols: List of categorical column names
            
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
            print(f"Could not extract feature importance: {str(e)}")
            return None
    
    def predict(self, new_data, model_key=None):
        """
        Make predictions on new data.
        
        Args:
            new_data: DataFrame with new data to predict
            model_key: Key of the model to use (if None, uses the most recent)
            
        Returns:
            numpy array: Predictions
        """
        if not self.trained_models:
            raise ValueError("No trained models available. Please train a model first.")
        
        if model_key is None:
            model_key = list(self.trained_models.keys())[-1]
        
        if model_key not in self.trained_models:
            raise ValueError(f"Model key '{model_key}' not found in trained models.")
        
        model = self.trained_models[model_key]['model']
        predictions = model.predict(new_data)
        
        self.predictions = predictions
        return predictions
    
    def generate_prediction_report(self, predictions=None, new_data=None):
        """
        Generate a comprehensive report from predictions.
        
        Args:
            predictions: Predictions array (if None, uses self.predictions)
            new_data: Data used for predictions (if None, uses self.data)
            
        Returns:
            dict: Report with analysis and insights
        """
        if predictions is None:
            predictions = self.predictions
        if new_data is None:
            new_data = self.data
        
        if predictions is None:
            raise ValueError("No predictions available. Please make predictions first.")
        
        if self.prediction_type == "classification":
            # Classification report
            result_df = new_data.copy()
            result_df['predicted_adverse_event'] = predictions
            
            # Calculate risk percentages
            high_risk_count = np.sum(predictions == 1)
            high_risk_percent = (high_risk_count / len(predictions)) * 100
            
            # Group by device type if available
            if 'device_type' in result_df.columns:
                device_risk = result_df.groupby('device_type')['predicted_adverse_event'].mean().reset_index()
                device_risk['risk_percentage'] = device_risk['predicted_adverse_event'] * 100
                device_risk = device_risk.sort_values('risk_percentage', ascending=False)
            else:
                device_risk = None
            
            return {
                'result_df': result_df,
                'high_risk_percent': high_risk_percent,
                'device_risk': device_risk,
                'total_predictions': len(predictions),
                'high_risk_count': high_risk_count
            }
        else:  # regression
            # Regression report
            result_df = new_data.copy()
            result_df['predicted_severity'] = predictions
            
            # Calculate severity statistics
            avg_severity = np.mean(predictions)
            high_severity_count = np.sum(predictions >= 7)
            high_severity_percent = (high_severity_count / len(predictions)) * 100
            
            # Group by device type if available
            if 'device_type' in result_df.columns:
                device_severity = result_df.groupby('device_type')['predicted_severity'].mean().reset_index()
                device_severity = device_severity.sort_values('predicted_severity', ascending=False)
            else:
                device_severity = None
            
            return {
                'result_df': result_df,
                'avg_severity': avg_severity,
                'high_severity_percent': high_severity_percent,
                'device_severity': device_severity,
                'total_predictions': len(predictions),
                'high_severity_count': high_severity_count
            }
    
    def save_model(self, model_key, file_path):
        """
        Save a trained model to disk.
        
        Args:
            model_key: Key of the model to save
            file_path: Path where to save the model
        """
        if model_key not in self.trained_models:
            raise ValueError(f"Model key '{model_key}' not found in trained models.")
        
        model_data = {
            'model': self.trained_models[model_key]['model'],
            'target_col': self.trained_models[model_key]['target_col'],
            'numerical_cols': self.trained_models[model_key]['numerical_cols'],
            'categorical_cols': self.trained_models[model_key]['categorical_cols'],
            'prediction_type': self.prediction_type,
            'model_type': self.model_type
        }
        
        joblib.dump(model_data, file_path)
        print(f"Model saved to {file_path}")
    
    def load_model(self, file_path):
        """
        Load a trained model from disk.
        
        Args:
            file_path: Path to the saved model file
            
        Returns:
            str: Model key of the loaded model
        """
        model_data = joblib.load(file_path)
        
        self.prediction_type = model_data['prediction_type']
        self.model_type = model_data['model_type']
        
        model_key = f"{self.model_type}_{self.prediction_type}"
        self.trained_models[model_key] = {
            'model': model_data['model'],
            'target_col': model_data['target_col'],
            'numerical_cols': model_data['numerical_cols'],
            'categorical_cols': model_data['categorical_cols'],
            'has_feature_importance': hasattr(model_data['model'][-1], 'feature_importances_')
        }
        
        print(f"Model loaded from {file_path}")
        return model_key
    
    def get_model_info(self):
        """
        Get information about all trained models.
        
        Returns:
            dict: Information about trained models
        """
        info = {}
        for key, model_data in self.trained_models.items():
            info[key] = {
                'target_column': model_data['target_col'],
                'numerical_features': len(model_data['numerical_cols']),
                'categorical_features': len(model_data['categorical_cols']),
                'has_feature_importance': model_data['has_feature_importance']
            }
        return info
    
    def print_metrics(self, model_key=None):
        """
        Print model metrics in a formatted way.
        
        Args:
            model_key: Key of the model to print metrics for
        """
        if model_key is None:
            model_key = list(self.trained_models.keys())[-1]
        
        if model_key not in self.model_metrics:
            print(f"No metrics available for model '{model_key}'")
            return
        
        metrics = self.model_metrics[model_key]
        
        print(f"\nModel Performance Metrics for '{model_key}':")
        print("=" * 50)
        
        if "classification" in model_key:
            print(f"Accuracy: {metrics.get('accuracy', 0):.4f}")
            print(f"Precision: {metrics.get('precision', 0):.4f}")
            print(f"Recall: {metrics.get('recall', 0):.4f}")
            print(f"F1 Score: {metrics.get('f1', 0):.4f}")
            
            if 'true_positives' in metrics:
                print(f"\nConfusion Matrix Components:")
                print(f"True Positives: {metrics['true_positives']}")
                print(f"True Negatives: {metrics['true_negatives']}")
                print(f"False Positives: {metrics['false_positives']}")
                print(f"False Negatives: {metrics['false_negatives']}")
        else:
            print(f"Mean Absolute Error: {metrics.get('mae', 0):.4f}")
            print(f"Mean Squared Error: {metrics.get('mse', 0):.4f}")
            print(f"Root Mean Squared Error: {metrics.get('rmse', 0):.4f}")
            print(f"R² Score: {metrics.get('r2', 0):.4f}")
            print(f"Explained Variance: {metrics.get('explained_variance', 0):.4f}")


# Visualization helper functions
class AdverseEventVisualizer:
    """
    Helper class for creating visualizations related to adverse event predictions.
    """
    
    @staticmethod
    def plot_confusion_matrix(conf_matrix, title="Confusion Matrix"):
        """Plot a confusion matrix."""
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', ax=ax)
        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')
        ax.set_title(title)
        plt.tight_layout()
        return fig
    
    @staticmethod
    def plot_feature_importance(feature_importance_df, top_n=10, title="Feature Importance"):
        """Plot feature importances."""
        if feature_importance_df is None or feature_importance_df.empty:
            fig, ax = plt.subplots(figsize=(10, 2))
            ax.text(0.5, 0.5, 'No feature importance data available', 
                    ha='center', va='center', fontsize=12)
            ax.axis('off')
            return fig
        
        top_n = min(top_n, len(feature_importance_df))
        top_features = feature_importance_df.head(top_n).sort_values('Importance', ascending=True)
        
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.barh(top_features['Feature'], top_features['Importance'])
        ax.set_xlabel('Importance')
        ax.set_title(title)
        plt.tight_layout()
        return fig
    
    @staticmethod
    def plot_risk_by_category(data, category_col, prediction_col, prediction_type="classification"):
        """Plot risk or severity by category."""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if prediction_type == "classification":
            risk_by_cat = data.groupby(category_col)[prediction_col].mean() * 100
            risk_by_cat = risk_by_cat.sort_values(ascending=False)
            risk_by_cat.plot(kind='bar', ax=ax)
            ax.set_ylabel('Risk Percentage (%)')
            ax.set_title(f'Risk Percentage by {category_col}')
        else:
            severity_by_cat = data.groupby(category_col)[prediction_col].mean()
            severity_by_cat = severity_by_cat.sort_values(ascending=False)
            severity_by_cat.plot(kind='bar', ax=ax)
            ax.set_ylabel('Average Severity Score')
            ax.set_title(f'Average Severity Score by {category_col}')
        
        ax.set_xlabel(category_col)
        plt.xticks(rotation=45)
        plt.tight_layout()
        return fig
    
    @staticmethod
    def plot_correlation_heatmap(data, title="Correlation Heatmap"):
        """Plot correlation heatmap of numerical features."""
        numerical_data = data.select_dtypes(include=['int64', 'float64'])
        corr_matrix = numerical_data.corr()
        
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', ax=ax)
        ax.set_title(title)
        plt.tight_layout()
        return fig
    
    @staticmethod
    def plot_roc_curve(y_true, y_prob, title="ROC Curve"):
        """Plot ROC curve for binary classification."""
        fpr, tpr, _ = roc_curve(y_true, y_prob)
        auc_score = roc_auc_score(y_true, y_prob)
        
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.plot(fpr, tpr, label=f'ROC Curve (AUC = {auc_score:.2f})')
        ax.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
        ax.set_xlabel('False Positive Rate')
        ax.set_ylabel('True Positive Rate')
        ax.set_title(title)
        ax.legend()
        plt.tight_layout()
        return fig


# Example usage
if __name__ == "__main__":
    # Create predictor instance
    predictor = AdverseEventPredictor()
    
    # Generate or load sample data
    print("Generating sample data...")
    sample_data = predictor.create_sample_data(num_samples=1000)
    print(f"Data shape: {sample_data.shape}")
    print(f"Columns: {list(sample_data.columns)}")
    
    # Train a classification model
    print("\nTraining classification model...")
    results = predictor.train_model(
        target_col='adverse_event_occurred',
        model_type='random_forest',
        prediction_type='classification'
    )
    
    # Print metrics
    predictor.print_metrics()
    
    # Train a regression model
    print("\nTraining regression model...")
    results = predictor.train_model(
        target_col='severity_score',
        model_type='random_forest',
        prediction_type='regression'
    )
    
    # Print metrics
    predictor.print_metrics()
    
    # Make predictions on the same data (for demonstration)
    print("\nMaking predictions...")
    predictions = predictor.predict(sample_data.drop(columns=['severity_score']))
    
    # Generate report
    report = predictor.generate_prediction_report(predictions, sample_data)
    print(f"\nPrediction Report:")
    print(f"Total predictions: {report['total_predictions']}")
    print(f"Average severity: {report['avg_severity']:.2f}")
    print(f"High severity percentage: {report['high_severity_percent']:.2f}%")
    
    # Show model information
    print("\nModel Information:")
    model_info = predictor.get_model_info()
    for key, info in model_info.items():
        print(f"{key}: {info}")
    
    # Create visualizations
    visualizer = AdverseEventVisualizer()
    
    # Feature importance plot
    if predictor.feature_importance is not None:
        fig = visualizer.plot_feature_importance(predictor.feature_importance)
        plt.show()
    
    # Correlation heatmap
    fig = visualizer.plot_correlation_heatmap(sample_data)
    plt.show()
    
    print("\nAdverse Event Prediction System is ready to use!")
