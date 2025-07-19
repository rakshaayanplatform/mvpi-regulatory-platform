import streamlit as st
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

# Download NLTK resources (uncomment first time)
# nltk.download('punkt')
# nltk.download('stopwords')

def extract_text_from_url(url):
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

def categorize_sentences(sentences):
    categories = {
        "Recall Procedure": ["procedure", "process", "steps", "action", "guideline", "protocol"],
        "Affected Products": ["device", "product", "equipment", "model", "serial", "affected", "manufactured"],
        "Health Risks": ["risk", "hazard", "injury", "death", "harm", "adverse", "safety", "concern", "issue", "problem"],
        "Manufacturer Information": ["manufacturer", "company", "corporation", "firm", "producer", "distributor"],
        "Regulatory Actions": ["regulation", "compliance", "enforcement", "authority", "agency", "action", "class", "classification"],
        "Consumer Advice": ["consumer", "patient", "user", "advice", "recommendation", "contact", "should", "must", "return"]
    }
    
    categorized = defaultdict(list)
    uncategorized = []
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        found_category = False
        for category, keywords in categories.items():
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

def summarize_text_with_categories(text, sentences_per_category=2):
    if not text or text.startswith("Error"):
        return text
    
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    # Categorize sentences
    categorized_sentences = categorize_sentences(sentences)
    
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

def parse_fda_recalls(text):
    try:
        # Extract tables if present in the FDA page
        tables = pd.read_html(StringIO(text))
        if tables:
            # Typically the first table contains recalls
            recent_recalls = tables[0]
            st.write("### Recent FDA Recalls")
            st.dataframe(recent_recalls)
            return recent_recalls
    except Exception as e:
        st.write(f"Couldn't parse FDA table data: {str(e)}")
    return None

def extract_recall_info(text):
    # Look for patterns like "recall of [product]" or "class [I/II/III] recall"
    recall_products = re.findall(r'recall of ([^.]*)', text, re.IGNORECASE)
    recall_classes = re.findall(r'class (I{1,3}) recall', text, re.IGNORECASE)
    recall_dates = re.findall(r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w+ \d{1,2},? \d{4})', text)
    
    recalls = []
    if recall_products:
        st.write("### Detected Recall Products:")
        for product in recall_products[:10]:  # Limit to 10 to avoid overwhelm
            st.write(f"- {product.strip()}")
            recalls.append({"Product": product.strip()})
    
    if recall_classes:
        st.write("### Detected Recall Classes:")
        class_counts = {"I": 0, "II": 0, "III": 0}
        for cls in recall_classes:
            class_counts[cls.upper()] += 1
        
        for cls, count in class_counts.items():
            if count > 0:
                st.write(f"- Class {cls}: {count} recalls")
    
    if recall_dates:
        st.write("### Detected Recall Dates:")
        for date in recall_dates[:10]:
            st.write(f"- {date}")
    
    return recalls

def main():
    # Initialize Streamlit app
    st.title("Global Medical Device Recalls")
    st.write("This application provides summaries of medical device recalls from major regulatory authorities around the world.")

    # Define country options
    countries = {
        "United States (FDA)": "https://www.fda.gov/medical-devices/medical-device-safety/medical-device-recalls",
        "India (CDSCO)": "https://cdsco.gov.in/opencms/opencms/en/consumer/Product-Recall/",
        "Australia (TGA)": "https://www.tga.gov.au/safety/recall-actions",
        "Canada (Health Canada)": "https://healthycanadians.gc.ca/recall-alert-rappel-avis/index-eng.php",
        "Japan (PMDA)": "https://www.pmda.go.jp/english/safety/info-services/devices/0001.html",
        "Europe (EMA)": "https://www.ema.europa.eu/en/human-regulatory/post-authorisation/safety-updates",
        "China (NMPA)": "https://www.nmpa.gov.cn/ylqx/ylqxbgxx/"
    }

    # Country selection dropdown
    selected_country = st.selectbox(
        "Select a country to view medical device recalls",
        list(countries.keys())
    )

    if st.button("Get Recall Information"):
        st.write(f"## Medical Device Recalls in {selected_country}")
        
        # Get URL for selected country
        url = countries[selected_country]
        
        # Show URL being accessed
        st.write(f"Accessing: {url}")
        
        # Extract and process text
        extracted_text = extract_text_from_url(url)
        
        if extracted_text.startswith("Error"):
            st.error(extracted_text)
        else:
            # Show length of extracted text
            st.write(f"Extracted {len(extracted_text)} characters of text")
            
            # Create categorized summary
            summary_by_category = summarize_text_with_categories(extracted_text, sentences_per_category=2)
            
            # Display summary by category
            st.write("### Summary by Category")
            
            if not summary_by_category:
                st.write("No categorized information could be extracted.")
            else:
                for category, sentences in summary_by_category.items():
                    with st.expander(f"{category} ({len(sentences)} items)"):
                        for sentence in sentences:
                            st.write(f"• {sentence}")
            
            # Try to extract more structured information based on country
            st.write("### Detailed Information")
            
            if "United States" in selected_country:
                fda_recalls = parse_fda_recalls(extracted_text)
            else:
                # For other countries, try basic pattern extraction
                extract_recall_info(extracted_text)
            
            # Option to see full text
            if st.checkbox("Show full extracted text"):
                st.write("### Full Extracted Text")
                st.text_area("", extracted_text, height=300, key="full_text")
    
    # Add information about the data sources
    st.write("---")
    st.write("### Data Sources")
    for country, url in countries.items():
        st.write(f"- {country}: [{url}]({url})")
    
    st.write("---")
    st.write("Note: This application provides summarized information from public sources. For official and complete recall information, please visit the respective regulatory authority websites.")

if __name__ == "__main__":
    main()
