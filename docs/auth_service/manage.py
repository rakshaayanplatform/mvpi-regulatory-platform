#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth_service.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Set default port to 8001 if only `runserver` is provided
    if len(sys.argv) == 2 and sys.argv[1] == "runserver":
        sys.argv.append("127.0.0.1:8001")

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
