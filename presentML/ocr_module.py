import numpy as np
import cv2
import os
from PIL import Image
import pytesseract

class OCRTextExtractor:
    """
    A class for extracting text from images using OCR with various preprocessing options.
    """
    
    def __init__(self, tesseract_path=None):
        """
        Initialize the OCR text extractor.
        
        Args:
            tesseract_path (str, optional): Path to tesseract executable. 
                                          If None, uses system default.
        """
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        else:
            # Try common default paths
            common_paths = [
                r'C:\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
                '/usr/bin/tesseract',
                '/usr/local/bin/tesseract'
            ]
            
            for path in common_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    break
    
    def preprocess_image(self, image, preprocess_type="None"):
        """
        Apply various preprocessing techniques to improve OCR accuracy.
        
        Args:
            image: PIL Image or numpy array
            preprocess_type (str): Type of preprocessing to apply
                - "None": No preprocessing
                - "Basic Thresholding": Simple binary thresholding
                - "Adaptive Thresholding": Adaptive binary thresholding
                - "Otsu's Thresholding": Otsu's automatic thresholding
                - "Noise Removal": Remove noise using median blur
                - "Dilation": Make characters thicker
        
        Returns:
            numpy.ndarray: Preprocessed image
        """
        # Convert PIL Image to OpenCV format if needed
        if isinstance(image, Image.Image):
            img = np.array(image)
        else:
            img = image
        
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
    
    def extract_text(self, image_path=None, image=None, lang="eng", preprocess_type="None"):
        """
        Extract text from an image using OCR.
        
        Args:
            image_path (str, optional): Path to image file
            image (PIL.Image or numpy.ndarray, optional): Image object
            lang (str): Language code for OCR (default: "eng")
            preprocess_type (str): Preprocessing method to apply
        
        Returns:
            tuple: (extracted_text, processed_image)
        """
        try:
            # Load image if path is provided
            if image_path:
                if not os.path.exists(image_path):
                    raise FileNotFoundError(f"Image file not found: {image_path}")
                image = Image.open(image_path)
            elif image is None:
                raise ValueError("Either image_path or image must be provided")
            
            # Preprocess the image
            processed_img = self.preprocess_image(image, preprocess_type)
            
            # Convert back to PIL Image for tesseract
            pil_img = Image.fromarray(processed_img)
            
            # Check if Tesseract is available
            if not os.path.exists(pytesseract.pytesseract.tesseract_cmd):
                raise RuntimeError("Tesseract not found. Please install Tesseract OCR or update the path.")
            
            # Extract text
            text = pytesseract.image_to_string(pil_img, lang=lang)
            
            return text, processed_img
            
        except Exception as e:
            raise RuntimeError(f"Error performing OCR: {str(e)}")
    
    def get_available_languages(self):
        """
        Get list of available languages for OCR.
        
        Returns:
            list: Available language codes
        """
        try:
            return pytesseract.get_languages()
        except:
            # Return common languages if unable to get from tesseract
            return ['eng', 'spa', 'fra', 'deu', 'ita', 'por', 'nld', 'chi_sim', 'jpn', 'kor', 'rus', 'ara', 'hin']
    
    def extract_text_with_confidence(self, image_path=None, image=None, lang="eng", preprocess_type="None"):
        """
        Extract text with confidence scores.
        
        Args:
            image_path (str, optional): Path to image file
            image (PIL.Image or numpy.ndarray, optional): Image object
            lang (str): Language code for OCR
            preprocess_type (str): Preprocessing method to apply
        
        Returns:
            tuple: (text_data_dict, processed_image)
        """
        try:
            # Load image if path is provided
            if image_path:
                if not os.path.exists(image_path):
                    raise FileNotFoundError(f"Image file not found: {image_path}")
                image = Image.open(image_path)
            elif image is None:
                raise ValueError("Either image_path or image must be provided")
            
            # Preprocess the image
            processed_img = self.preprocess_image(image, preprocess_type)
            
            # Convert back to PIL Image for tesseract
            pil_img = Image.fromarray(processed_img)
            
            # Extract text with detailed information
            data = pytesseract.image_to_data(pil_img, lang=lang, output_type=pytesseract.Output.DICT)
            
            return data, processed_img
            
        except Exception as e:
            raise RuntimeError(f"Error performing OCR with confidence: {str(e)}")
    
    def save_processed_image(self, processed_image, output_path):
        """
        Save processed image to file.
        
        Args:
            processed_image (numpy.ndarray): Processed image array
            output_path (str): Path to save the image
        """
        try:
            cv2.imwrite(output_path, processed_image)
        except Exception as e:
            raise RuntimeError(f"Error saving processed image: {str(e)}")
    
    def get_image_info(self, image):
        """
        Get information about the image.
        
        Args:
            image: PIL Image or numpy array
        
        Returns:
            dict: Image information
        """
        if isinstance(image, Image.Image):
            return {
                'size': image.size,
                'format': image.format,
                'mode': image.mode,
                'width': image.size[0],
                'height': image.size[1]
            }
        else:
            return {
                'shape': image.shape,
                'dtype': str(image.dtype),
                'width': image.shape[1] if len(image.shape) > 1 else image.shape[0],
                'height': image.shape[0]
            }


# Example usage and utility functions
def batch_ocr_extraction(image_paths, lang="eng", preprocess_type="None", tesseract_path=None):
    """
    Perform OCR on multiple images.
    
    Args:
        image_paths (list): List of image file paths
        lang (str): Language code for OCR
        preprocess_type (str): Preprocessing method
        tesseract_path (str, optional): Path to tesseract executable
    
    Returns:
        list: List of dictionaries containing results for each image
    """
    extractor = OCRTextExtractor(tesseract_path=tesseract_path)
    results = []
    
    for image_path in image_paths:
        try:
            text, processed_img = extractor.extract_text(
                image_path=image_path,
                lang=lang,
                preprocess_type=preprocess_type
            )
            
            results.append({
                'image_path': image_path,
                'extracted_text': text,
                'success': True,
                'error': None
            })
            
        except Exception as e:
            results.append({
                'image_path': image_path,
                'extracted_text': None,
                'success': False,
                'error': str(e)
            })
    
    return results


def save_text_to_file(text, output_path):
    """
    Save extracted text to a file.
    
    Args:
        text (str): Text to save
        output_path (str): Path to save the text file
    """
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
    except Exception as e:
        raise RuntimeError(f"Error saving text to file: {str(e)}")


# Example usage
if __name__ == "__main__":
    # Initialize OCR extractor
    ocr = OCRTextExtractor()
    
    # Example 1: Extract text from an image file
    try:
        text, processed_img = ocr.extract_text(
            image_path="sample_image.jpg",
            lang="eng",
            preprocess_type="Otsu's Thresholding"
        )
        print("Extracted text:")
        print(text)
        
        # Save processed image
        ocr.save_processed_image(processed_img, "processed_image.jpg")
        
        # Save text to file
        save_text_to_file(text, "extracted_text.txt")
        
    except Exception as e:
        print(f"Error: {e}")
    
    # Example 2: Batch processing
    image_files = ["image1.jpg", "image2.png", "image3.jpg"]
    results = batch_ocr_extraction(image_files, lang="eng", preprocess_type="Adaptive Thresholding")
    
    for result in results:
        if result['success']:
            print(f"Successfully processed {result['image_path']}")
        else:
            print(f"Failed to process {result['image_path']}: {result['error']}")
