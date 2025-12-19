"""
cursorhabits - Turn your Cursor chat history into personalized rules.

Your chat history writes your rules.
"""

__version__ = "0.1.0"
__author__ = "Rohun Vora"

from .extractor import extract_messages, get_cursor_db_path
from .analyzer import analyze_patterns, find_repeated_phrases
from .filters import filter_noise, is_instruction

__all__ = [
    "extract_messages",
    "get_cursor_db_path", 
    "analyze_patterns",
    "find_repeated_phrases",
    "filter_noise",
    "is_instruction",
]

