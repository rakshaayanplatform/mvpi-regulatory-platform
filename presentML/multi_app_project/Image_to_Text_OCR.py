import streamlit as st
from PIL import Image
import pytesseract
import numpy as np
import cv2
import io
import os

# Set the Tesseract executable path explicitly
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'



def preprocess_image(image, preprocess_type):
    """
    Apply various preprocessing techniques to improve OCR accuracy
    """
    # Convert PIL Image to OpenCV format
    img = np.array(image)
    
    # Convert to grayscale if image has color channels
    if len(img.shape) > 2:
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    else:
        gray = img
    
    if preprocess_type == "None":
        return gray
    elif preprocess_type == "Basic Thresholding":
        _, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
        return binary
    elif preprocess_type == "Adaptive Thresholding":
        binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                     cv2.THRESH_BINARY, 11, 2)
        return binary
    elif preprocess_type == "Otsu's Thresholding":
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return binary
    elif preprocess_type == "Noise Removal":
        # Apply median blur to remove noise
        denoised = cv2.medianBlur(gray, 3)
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return binary
    elif preprocess_type == "Dilation":
        # Dilate to make characters thicker
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = np.ones((2, 2), np.uint8)
        dilated = cv2.dilate(binary, kernel, iterations=1)
        return dilated
    else:
        return gray

def perform_ocr(image, lang, preprocess_type):
    """
    Extract text from the image using pytesseract
    """
    try:
        processed_img = preprocess_image(image, preprocess_type)
        
        # Convert back to PIL Image for tesseract
        pil_img = Image.fromarray(processed_img)
        
        # Check if Tesseract is available
        if not os.path.exists(pytesseract.pytesseract.tesseract_cmd):
            return "Tesseract not found at the specified path. Please install Tesseract OCR or update the path.", processed_img
        
        # Extract text with error handling
        text = pytesseract.image_to_string(pil_img, lang=lang)
        return text, processed_img
        
    except Exception as e:
        return f"Error performing OCR: {str(e)}", np.array(image)

def main():
    st.title("Image to Text (OCR) Tool")
    
    st.markdown("""
    Upload an image containing text, and this tool will extract the text content.
    Use the preprocessing options to improve extraction quality for different types of images.
    """)
    
    # Sidebar for options
    with st.sidebar:
        st.header("Settings")
        
        # Tesseract path setting
        tesseract_path = st.text_input(
            "Tesseract Path", 
            value=pytesseract.pytesseract.tesseract_cmd,
            help="Path to tesseract.exe"
        )
        
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        # Language selection
        lang_options = {
            "English": "eng",
            "Spanish": "spa", 
            "French": "fra",
            "German": "deu",
            "Italian": "ita",
            "Portuguese": "por",
            "Dutch": "nld",
            "Chinese (Simplified)": "chi_sim",
            "Japanese": "jpn",
            "Korean": "kor",
            "Russian": "rus",
            "Arabic": "ara",
            "Hindi": "hin"
        }
        selected_lang = st.selectbox("Select Language", list(lang_options.keys()))
        lang_code = lang_options[selected_lang]
        
        # Preprocessing options
        preprocess_options = [
            "None", 
            "Basic Thresholding", 
            "Adaptive Thresholding",
            "Otsu's Thresholding",
            "Noise Removal",
            "Dilation"
        ]
        preprocess_type = st.selectbox("Preprocessing Method", preprocess_options)
        
        st.info("""
        Note: Make sure you have Tesseract OCR installed on your system and properly configured.
        
        If you're getting admin elevation errors, run this app from an administrator command prompt.
        """)
        
    # Upload image
    uploaded_file = st.file_uploader("Upload an image containing text", type=["jpg", "jpeg", "png", "bmp", "tiff"])
    
    if uploaded_file is not None:
        # Display original image
        image = Image.open(uploaded_file)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Original Image")
            st.image(image, use_container_width=True)  # Fixed deprecated parameter
        
        # Process image and perform OCR
        with st.spinner("Extracting text..."):
            extracted_text, processed_img = perform_ocr(image, lang_code, preprocess_type)
        
        with col2:
            st.subheader("Processed Image")
            st.image(processed_img, use_container_width=True)  # Fixed deprecated parameter
        
        # Display extracted text
        st.subheader("Extracted Text")
        if isinstance(extracted_text, str) and extracted_text.startswith("Error") or extracted_text.startswith("Tesseract not found"):
            st.error(extracted_text)
            
            # Installation guide
            with st.expander("Tesseract Installation Guide"):
                st.markdown("""
                ### Installing Tesseract OCR
                
                1. **Download Tesseract** from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
                2. **Install Tesseract** with the default options (make note of installation path)
                3. **Update the Tesseract path** in the sidebar of this app
                4. **Run the app as administrator** if you're seeing permission errors
                
                #### Common Installation Paths:
                - `C:\\Program Files\\Tesseract-OCR\\tesseract.exe`
                - `C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe`
                """)
        elif isinstance(extracted_text, str) and extracted_text.strip():
            st.text_area("", extracted_text, height=300)
            
            # Download button for the extracted text
            text_file = io.StringIO()
            text_file.write(extracted_text)
            
            st.download_button(
                label="Download Text",
                data=text_file.getvalue(),
                file_name="extracted_text.txt",
                mime="text/plain"
            )
        else:
            st.warning("No text was extracted from the image. Try a different preprocessing method.")
            
        # Additional information about the image
        with st.expander("Image Information"):
            st.write(f"Image Size: {image.size[0]} x {image.size[1]} pixels")
            st.write(f"Image Format: {image.format}")
            st.write(f"Selected Language: {selected_lang}")
            st.write(f"Preprocessing Method: {preprocess_type}")

if __name__ == "__main__":
    main()
