import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import datetime
from typing import List, Dict, Optional, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiQAChatbot:
    """
    A standalone Gemini AI Q&A Chatbot class that handles conversations,
    message history, and API interactions without Streamlit dependencies.
    """
    
    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-pro"):
        """
        Initialize the Gemini QA Chatbot
        
        Args:
            api_key: Gemini API key (if not provided, will try to load from .env)
            model_name: Name of the Gemini model to use
        """
        self.model_name = model_name
        self.messages = []
        self.model = None
        self.api_key = None
        
        # Load API key
        self._load_api_key(api_key)
        
        # Configure Gemini
        if self.api_key:
            self._configure_gemini()
    
    def _load_api_key(self, api_key: Optional[str] = None):
        """Load API key from parameter or environment"""
        if api_key:
            self.api_key = api_key
        else:
            # Try to load from .env file
            load_dotenv()
            env_key = os.getenv("GEMINI_API_KEY")
            if env_key and env_key != "YOUR_GEMINI_API_KEY_HERE":
                self.api_key = env_key
                logger.info("API key loaded from environment")
            else:
                logger.warning("No API key found. Please set GEMINI_API_KEY in .env file or provide it directly.")
    
    def _configure_gemini(self):
        """Configure the Gemini API and model"""
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
            logger.info(f"Gemini model '{self.model_name}' configured successfully")
        except Exception as e:
            logger.error(f"Error configuring Gemini: {str(e)}")
            raise
    
    def set_api_key(self, api_key: str):
        """Set a new API key and reconfigure the model"""
        self.api_key = api_key
        self._configure_gemini()
    
    def set_model(self, model_name: str):
        """Change the Gemini model"""
        self.model_name = model_name
        if self.api_key:
            self._configure_gemini()
    
    def generate_response(self, prompt: str) -> str:
        """
        Generate a response using the Gemini model
        
        Args:
            prompt: User's question or prompt
            
        Returns:
            Generated response text
        """
        if not self.api_key:
            return "Error: No API key configured. Please set your Gemini API key."
        
        if not self.model:
            return "Error: Model not configured. Please check your API key."
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    def chat(self, user_input: str) -> str:
        """
        Process a chat message and return response
        
        Args:
            user_input: User's message
            
        Returns:
            Bot's response
        """
        # Add user message to history
        self.add_message("user", user_input)
        
        # Generate response
        response = self.generate_response(user_input)
        
        # Add assistant response to history
        self.add_message("assistant", response)
        
        return response
    
    def add_message(self, role: str, content: str):
        """Add a message to the conversation history"""
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.datetime.now().isoformat()
        }
        self.messages.append(message)
    
    def get_messages(self) -> List[Dict]:
        """Get all conversation messages"""
        return self.messages.copy()
    
    def get_last_message(self) -> Optional[Dict]:
        """Get the last message in the conversation"""
        return self.messages[-1] if self.messages else None
    
    def get_conversation_history(self, limit: Optional[int] = None) -> List[Dict]:
        """
        Get conversation history
        
        Args:
            limit: Maximum number of messages to return (None for all)
            
        Returns:
            List of message dictionaries
        """
        if limit:
            return self.messages[-limit:]
        return self.messages.copy()
    
    def clear_conversation(self):
        """Clear the conversation history"""
        self.messages = []
        logger.info("Conversation history cleared")
    
    def save_conversation(self, filename: str):
        """
        Save conversation to a JSON file
        
        Args:
            filename: Name of the file to save to
        """
        try:
            conversation_data = {
                "model": self.model_name,
                "saved_at": datetime.datetime.now().isoformat(),
                "messages": self.messages
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(conversation_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Conversation saved to {filename}")
        except Exception as e:
            logger.error(f"Error saving conversation: {str(e)}")
            raise
    
    def load_conversation(self, filename: str):
        """
        Load conversation from a JSON file
        
        Args:
            filename: Name of the file to load from
        """
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                conversation_data = json.load(f)
            
            self.messages = conversation_data.get("messages", [])
            loaded_model = conversation_data.get("model", self.model_name)
            
            if loaded_model != self.model_name:
                logger.info(f"Loaded conversation used model '{loaded_model}', current model is '{self.model_name}'")
            
            logger.info(f"Conversation loaded from {filename}")
        except Exception as e:
            logger.error(f"Error loading conversation: {str(e)}")
            raise
    
    def get_conversation_stats(self) -> Dict[str, Any]:
        """Get statistics about the current conversation"""
        if not self.messages:
            return {"total_messages": 0}
        
        user_messages = [msg for msg in self.messages if msg["role"] == "user"]
        assistant_messages = [msg for msg in self.messages if msg["role"] == "assistant"]
        
        # Calculate average response length
        if assistant_messages:
            avg_response_length = sum(len(msg["content"]) for msg in assistant_messages) / len(assistant_messages)
        else:
            avg_response_length = 0
        
        # Get conversation duration
        if len(self.messages) > 1:
            start_time = datetime.datetime.fromisoformat(self.messages[0]["timestamp"])
            end_time = datetime.datetime.fromisoformat(self.messages[-1]["timestamp"])
            duration = (end_time - start_time).total_seconds()
        else:
            duration = 0
        
        return {
            "total_messages": len(self.messages),
            "user_messages": len(user_messages),
            "assistant_messages": len(assistant_messages),
            "average_response_length": round(avg_response_length, 2),
            "conversation_duration_seconds": duration,
            "model_used": self.model_name
        }
    
    def search_conversation(self, query: str, case_sensitive: bool = False) -> List[Dict]:
        """
        Search for messages containing specific text
        
        Args:
            query: Text to search for
            case_sensitive: Whether search should be case sensitive
            
        Returns:
            List of matching messages
        """
        if not case_sensitive:
            query = query.lower()
        
        matching_messages = []
        for msg in self.messages:
            content = msg["content"] if case_sensitive else msg["content"].lower()
            if query in content:
                matching_messages.append(msg)
        
        return matching_messages
    
    def export_conversation(self, format: str = "txt", filename: Optional[str] = None) -> str:
        """
        Export conversation in different formats
        
        Args:
            format: Export format ('txt', 'json', 'csv')
            filename: Optional filename (auto-generated if not provided)
            
        Returns:
            Path to the exported file
        """
        if not filename:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"conversation_{timestamp}.{format}"
        
        if format == "txt":
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"Gemini QA Chatbot Conversation\n")
                f.write(f"Model: {self.model_name}\n")
                f.write(f"Exported: {datetime.datetime.now().isoformat()}\n")
                f.write("="*50 + "\n\n")
                
                for msg in self.messages:
                    role = "User" if msg["role"] == "user" else "Assistant"
                    f.write(f"{role}: {msg['content']}\n")
                    f.write(f"Time: {msg['timestamp']}\n\n")
        
        elif format == "json":
            self.save_conversation(filename)
        
        elif format == "csv":
            import csv
            with open(filename, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(["Role", "Content", "Timestamp"])
                for msg in self.messages:
                    writer.writerow([msg["role"], msg["content"], msg["timestamp"]])
        
        else:
            raise ValueError(f"Unsupported export format: {format}")
        
        logger.info(f"Conversation exported to {filename}")
        return filename
    
    def get_available_models(self) -> List[str]:
        """Get list of available Gemini models"""
        return ["gemini-pro", "gemini-pro-vision"]
    
    def is_configured(self) -> bool:
        """Check if the chatbot is properly configured"""
        return self.api_key is not None and self.model is not None


# Console Interface for standalone usage
class ConsoleInterface:
    """Simple console interface for the chatbot"""
    
    def __init__(self, chatbot: GeminiQAChatbot):
        self.chatbot = chatbot
    
    def run(self):
        """Run the console interface"""
        print("🤖 Gemini AI Q&A Chatbot")
        print("=" * 40)
        
        if not self.chatbot.is_configured():
            print("⚠️  Chatbot not configured. Please set your API key.")
            api_key = input("Enter your Gemini API Key: ").strip()
            if api_key:
                self.chatbot.set_api_key(api_key)
            else:
                print("No API key provided. Exiting.")
                return
        
        print(f"Using model: {self.chatbot.model_name}")
        print("Type 'quit' to exit, 'clear' to clear history, 'stats' for statistics")
        print("=" * 40)
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if user_input.lower() == 'quit':
                    break
                elif user_input.lower() == 'clear':
                    self.chatbot.clear_conversation()
                    print("Conversation history cleared.")
                    continue
                elif user_input.lower() == 'stats':
                    stats = self.chatbot.get_conversation_stats()
                    print("\nConversation Statistics:")
                    for key, value in stats.items():
                        print(f"  {key}: {value}")
                    continue
                elif user_input.lower().startswith('save '):
                    filename = user_input[5:].strip()
                    if filename:
                        self.chatbot.save_conversation(filename)
                        print(f"Conversation saved to {filename}")
                    else:
                        print("Please provide a filename: save <filename>")
                    continue
                elif user_input.lower().startswith('load '):
                    filename = user_input[5:].strip()
                    if filename:
                        try:
                            self.chatbot.load_conversation(filename)
                            print(f"Conversation loaded from {filename}")
                        except Exception as e:
                            print(f"Error loading conversation: {e}")
                    else:
                        print("Please provide a filename: load <filename>")
                    continue
                elif not user_input:
                    continue
                
                # Generate response
                print("\nAssistant: ", end="")
                response = self.chatbot.chat(user_input)
                print(response)
                
            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except Exception as e:
                print(f"\nError: {e}")
        
        # Ask if user wants to save conversation
        if self.chatbot.get_messages():
            save_choice = input("\nSave conversation? (y/n): ").strip().lower()
            if save_choice == 'y':
                filename = input("Enter filename (or press Enter for auto-generated): ").strip()
                if not filename:
                    filename = f"conversation_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                self.chatbot.save_conversation(filename)
                print(f"Conversation saved to {filename}")


# Example usage and testing
if __name__ == "__main__":
    # Initialize chatbot
    chatbot = GeminiQAChatbot()
    
    # Example of programmatic usage
    if chatbot.is_configured():
        print("Chatbot configured successfully!")
        
        # Example conversation
        response1 = chatbot.chat("What is artificial intelligence?")
        print(f"Response 1: {response1[:100]}...")
        
        response2 = chatbot.chat("Can you explain it in simpler terms?")
        print(f"Response 2: {response2[:100]}...")
        
        # Show conversation stats
        stats = chatbot.get_conversation_stats()
        print("\nConversation Stats:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
        
        # Save conversation
        chatbot.save_conversation("example_conversation.json")
        
    else:
        print("Chatbot not configured. Starting console interface...")
        console = ConsoleInterface(chatbot)
        console.run()
