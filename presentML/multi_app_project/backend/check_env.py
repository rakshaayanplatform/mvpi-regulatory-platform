import sys
import subprocess

def check_environment():
    print("=== Python Environment Check ===")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {sys.version}")
    
    print("\n=== Checking Installed Packages ===")
    
    def check_package(package_name):
        try:
            __import__(package_name)
            version = sys.modules[package_name].__version__
            print(f"{package_name}: {version}")
            return True
        except (ImportError, AttributeError):
            print(f"{package_name}: NOT INSTALLED")
            return False
    
    # Check for required packages
    packages = ['django', 'rest_framework', 'corsheaders']
    all_installed = all(check_package(pkg) for pkg in packages)
    
    if not all_installed:
        print("\n=== Missing Packages ===")
        print("Please install the missing packages using:")
        print("pip install django djangorestframework django-cors-headers")

if __name__ == "__main__":
    check_environment()
