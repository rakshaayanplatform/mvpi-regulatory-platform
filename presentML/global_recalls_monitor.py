import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from io import StringIO
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.probability import FreqDist
import heapq
from collections import defaultdict
from typing import Dict, List, Optional, Tuple
import json
import datetime

# Download NLTK resources (uncomment first time)
# nltk.download('punkt')
# nltk.download('stopwords')

class GlobalRecallsMonitor:
    """
    A comprehensive medical device recalls monitoring system that tracks
    regulatory authorities worldwide for recall information.
    """
    
    def __init__(self):
        self.countries = {
            "United States (FDA)": "https://www.fda.gov/medical-devices/medical-device-safety/medical-device-recalls",
            "India (CDSCO)": "https://cdsco.gov.in/opencms/opencms/en/consumer/Product-Recall/",
            "Australia (TGA)": "https://www.tga.gov.au/safety/recall-actions",
            "Canada (Health Canada)": "https://healthycanadians.gc.ca/recall-alert-rappel-avis/index-eng.php",
            "Japan (PMDA)": "https://www.pmda.go.jp/english/safety/info-services/devices/0001.html",
            "Europe (EMA)": "https://www.ema.europa.eu/en/human-regulatory/post-authorisation/safety-updates",
            "China (NMPA)": "https://www.nmpa.gov.cn/ylqx/ylqxbgxx/"
        }
        
        self.categories = {
            "Recall Procedure": ["procedure", "process", "steps", "action", "guideline", "protocol"],
            "Affected Products": ["device", "product", "equipment", "model", "serial", "affected", "manufactured"],
            "Health Risks": ["risk", "hazard", "injury", "death", "harm", "adverse", "safety", "concern", "issue", "problem"],
            "Manufacturer Information": ["manufacturer", "company", "corporation", "firm", "producer", "distributor"],
            "Regulatory Actions": ["regulation", "compliance", "enforcement", "authority", "agency", "action", "class", "classification"],
            "Consumer Advice": ["consumer", "patient", "user", "advice", "recommendation", "contact", "should", "must", "return"]
        }
        
    def extract_text_from_url(self, url: str) -> str:
        """Extract text content from a given URL."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
                
            # Get text
            text = soup.get_text(separator=' ', strip=True)
            
            # Clean text
            text = re.sub(r'\s+', ' ', text)
            return text
        except Exception as e:
            return f"Error extracting text: {str(e)}"
    
    def categorize_sentences(self, sentences: List[str]) -> Dict[str, List[str]]:
        """Categorize sentences based on predefined categories."""
        categorized = defaultdict(list)
        uncategorized = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            found_category = False
            for category, keywords in self.categories.items():
                if any(keyword in sentence.lower() for keyword in keywords):
                    categorized[category].append(sentence)
                    found_category = True
                    break
                    
            if not found_category:
                uncategorized.append(sentence)
        
        # Add uncategorized sentences to "General Information"
        if uncategorized:
            categorized["General Information"] = uncategorized
            
        return categorized
    
    def summarize_text_with_categories(self, text: str, sentences_per_category: int = 2) -> Dict[str, List[str]]:
        """Summarize text by categorizing and selecting important sentences."""
        if not text or text.startswith("Error"):
            return {"Error": [text]}
        
        # Tokenize the text into sentences
        sentences = sent_tokenize(text)
        
        # Categorize sentences
        categorized_sentences = self.categorize_sentences(sentences)
        
        # For each category, select the most important sentences
        summary_by_category = {}
        
        for category, category_sentences in categorized_sentences.items():
            if not category_sentences:
                continue
                
            # If few sentences, keep them all
            if len(category_sentences) <= sentences_per_category:
                summary_by_category[category] = category_sentences
                continue
                
            # Tokenize words and remove stopwords for this category
            category_text = " ".join(category_sentences)
            stop_words = set(stopwords.words('english'))
            word_tokens = word_tokenize(category_text.lower())
            filtered_words = [word for word in word_tokens if word.isalnum() and word not in stop_words]
            
            # Calculate word frequencies
            word_freq = FreqDist(filtered_words)
            
            # Score sentences based on word frequency
            sentence_scores = {}
            for i, sentence in enumerate(category_sentences):
                for word in word_tokenize(sentence.lower()):
                    if word in word_freq.keys():
                        if i not in sentence_scores:
                            sentence_scores[i] = word_freq[word]
                        else:
                            sentence_scores[i] += word_freq[word]
            
            # Get top sentences
            if sentence_scores:
                top_sentence_indices = heapq.nlargest(sentences_per_category, sentence_scores, key=sentence_scores.get)
                top_sentence_indices.sort()  # Sort to maintain original order
                summary_by_category[category] = [category_sentences[i] for i in top_sentence_indices]
        
        return summary_by_category
    
    def parse_fda_recalls(self, text: str) -> Optional[pd.DataFrame]:
        """Parse FDA recalls from HTML table data."""
        try:
            # Extract tables if present in the FDA page
            tables = pd.read_html(StringIO(text))
            if tables:
                # Typically the first table contains recalls
                recent_recalls = tables[0]
                return recent_recalls
        except Exception as e:
            print(f"Couldn't parse FDA table data: {str(e)}")
        return None
    
    def extract_recall_info(self, text: str) -> Dict[str, List[str]]:
        """Extract structured recall information from text."""
        # Look for patterns like "recall of [product]" or "class [I/II/III] recall"
        recall_products = re.findall(r'recall of ([^.]*)', text, re.IGNORECASE)
        recall_classes = re.findall(r'class (I{1,3}) recall', text, re.IGNORECASE)
        recall_dates = re.findall(r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w+ \d{1,2},? \d{4})', text)
        
        recall_info = {
            "products": [product.strip() for product in recall_products[:10]],
            "classes": recall_classes,
            "dates": recall_dates[:10]
        }
        
        return recall_info
    
    def get_country_recalls(self, country: str) -> Dict:
        """Get recall information for a specific country."""
        if country not in self.countries:
            return {"error": f"Country '{country}' not supported"}
        
        url = self.countries[country]
        extracted_text = self.extract_text_from_url(url)
        
        if extracted_text.startswith("Error"):
            return {"error": extracted_text}
        
        # Create categorized summary
        summary_by_category = self.summarize_text_with_categories(extracted_text, sentences_per_category=2)
        
        # Extract structured information
        recall_info = self.extract_recall_info(extracted_text)
        
        # Try to get FDA table data if it's FDA
        fda_table = None
        if "United States" in country:
            fda_table = self.parse_fda_recalls(extracted_text)
        
        result = {
            "country": country,
            "url": url,
            "text_length": len(extracted_text),
            "summary_by_category": summary_by_category,
            "recall_info": recall_info,
            "fda_table": fda_table.to_dict() if fda_table is not None else None,
            "extraction_time": datetime.datetime.now().isoformat()
        }
        
        return result
    
    def get_all_countries_recalls(self) -> Dict:
        """Get recall information for all supported countries."""
        all_recalls = {}
        
        for country in self.countries.keys():
            print(f"Processing recalls for {country}...")
            all_recalls[country] = self.get_country_recalls(country)
        
        return all_recalls
    
    def search_recalls_by_product(self, product_name: str) -> Dict:
        """Search for recalls containing a specific product name across all countries."""
        results = {}
        
        for country in self.countries.keys():
            country_data = self.get_country_recalls(country)
            
            if "error" in country_data:
                continue
                
            # Search in summary categories
            found_mentions = []
            for category, sentences in country_data["summary_by_category"].items():
                for sentence in sentences:
                    if product_name.lower() in sentence.lower():
                        found_mentions.append({
                            "category": category,
                            "sentence": sentence
                        })
            
            # Search in recall products
            found_products = []
            for product in country_data["recall_info"]["products"]:
                if product_name.lower() in product.lower():
                    found_products.append(product)
            
            if found_mentions or found_products:
                results[country] = {
                    "mentions": found_mentions,
                    "products": found_products,
                    "url": country_data["url"]
                }
        
        return results
    
    def generate_report(self, country: str = None, output_format: str = "dict") -> Dict:
        """Generate a comprehensive recall report."""
        if country:
            data = self.get_country_recalls(country)
        else:
            data = self.get_all_countries_recalls()
        
        if output_format == "json":
            return json.dumps(data, indent=2, default=str)
        
        return data
    
    def get_supported_countries(self) -> List[str]:
        """Get list of supported countries."""
        return list(self.countries.keys())
    
    def get_country_url(self, country: str) -> str:
        """Get the URL for a specific country's recall page."""
        return self.countries.get(country, "Country not found")

# Usage example functions
def main():
    """Example usage of the GlobalRecallsMonitor class."""
    
    # Initialize the monitor
    monitor = GlobalRecallsMonitor()
    
    # Get supported countries
    print("Supported Countries:")
    for country in monitor.get_supported_countries():
        print(f"- {country}")
    
    # Get recalls for a specific country
    print("\n" + "="*50)
    print("Getting recalls for United States (FDA)...")
    us_recalls = monitor.get_country_recalls("United States (FDA)")
    
    if "error" not in us_recalls:
        print(f"Extracted {us_recalls['text_length']} characters")
        print("\nSummary by Category:")
        for category, sentences in us_recalls["summary_by_category"].items():
            print(f"\n{category}:")
            for sentence in sentences:
                print(f"  • {sentence}")
    
    # Search for a specific product
    print("\n" + "="*50)
    print("Searching for 'pacemaker' across all countries...")
    pacemaker_results = monitor.search_recalls_by_product("pacemaker")
    
    for country, results in pacemaker_results.items():
        print(f"\n{country}:")
        if results["mentions"]:
            print("  Mentions:")
            for mention in results["mentions"]:
                print(f"    • {mention['category']}: {mention['sentence']}")
        if results["products"]:
            print("  Products:")
            for product in results["products"]:
                print(f"    • {product}")

if __name__ == "__main__":
    main()