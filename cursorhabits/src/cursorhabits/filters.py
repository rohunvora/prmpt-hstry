"""
Noise filtering module.

Filters out non-instructional content like file paths, URLs, error logs,
task IDs, conversational filler, and code snippets.
"""

import re
from typing import Optional


# Patterns that indicate noise (not instructions)
NOISE_PATTERNS = [
    # File paths and URLs
    r'https?://\S+',                           # URLs
    r'[\w/\\]+\.\w{2,4}(?:\s|$)',             # File paths with extensions
    r'(?:src|lib|app|components|pages)/[\w/]+', # Common code paths
    r'node_modules',                           # Node paths
    r'__pycache__',                            # Python cache
    r'\.git/',                                 # Git paths
    
    # Error logs and stack traces
    r'\[\d{2}:\d{2}:\d{2}',                   # Timestamps [HH:MM:SS
    r'at \w+\.\w+ \(',                        # Stack trace lines
    r'Error:|Exception:|Traceback',           # Error indicators
    r'exit code:?\s*\d+',                     # Exit codes
    r'WARN|INFO|DEBUG|ERROR',                 # Log levels
    
    # Task IDs and issue references
    r'\b[A-Z]{2,5}-\d{3,5}\b',               # JIRA-style (WAL-602, PROJ-123)
    r'#\d{4,}',                               # Issue numbers
    
    # Code artifacts
    r'```[\s\S]*?```',                        # Code blocks
    r'`[^`]+`',                               # Inline code
    r'\{[\s\S]{50,}\}',                       # Large JSON objects
    r'\[[\s\S]{50,}\]',                       # Large arrays
    
    # Build/deploy output
    r'Building|Compiling|Bundling',
    r'npm|yarn|pnpm|pip|cargo',
    r'✓|✗|→|│|├|└',                          # Tree/status characters
]

# Conversational filler phrases to filter
FILLER_PHRASES = [
    r'^(yes|no|ok|okay|sure|thanks|thank you|got it|sounds good|perfect|great|nice|cool)[\.\!\?]?$',
    r'^(continue|proceed|go ahead|do it|execute|run it)[\.\!\?]?$',
    r'^(what|how|why|when|where|can you|could you|would you)[\?\s]',  # Questions (not instructions)
    r'^(i think|i believe|i guess|maybe|perhaps|probably)',
    r'^(let me know|lmk|sounds good|looks good|lgtm)',
    r'^(hmm|hm|ah|oh|um|uh)',
    r'^@\w+',                                  # @mentions
]

# Imperative verbs that indicate instructions
INSTRUCTION_INDICATORS = [
    r'\balways\b',
    r'\bnever\b',
    r'\bmake sure\b',
    r'\bensure\b',
    r'\bdon\'t\b',
    r'\bdo not\b',
    r'\bavoid\b',
    r'\bremember\b',
    r'\bkeep\b',
    r'\bcheck\b',
    r'\bverify\b',
    r'\btest\b',
    r'\bpush\b',
    r'\bdeploy\b',
    r'\bupdate\b',
    r'\badd\b',
    r'\bremove\b',
    r'\bfix\b',
    r'\buse\b',
    r'\bprefer\b',
]


def is_noise(text: str) -> bool:
    """
    Check if a message is noise (not an instruction).
    
    Args:
        text: Message text to check
        
    Returns:
        True if the message is noise and should be filtered
    """
    text_lower = text.lower().strip()
    
    # Too short to be meaningful
    if len(text_lower) < 15:
        return True
    
    # Too long (probably pasted content)
    if len(text_lower) > 2000:
        return True
    
    # Too many newlines (probably code or logs)
    if text.count('\n') > 10:
        return True
    
    # Too many slashes (file paths)
    if text.count('/') > 5 or text.count('\\') > 5:
        return True
    
    # Check noise patterns
    for pattern in NOISE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            # If more than 30% of the text matches noise patterns, filter it
            matches = re.findall(pattern, text, re.IGNORECASE)
            noise_chars = sum(len(m) if isinstance(m, str) else 0 for m in matches)
            if noise_chars > len(text) * 0.3:
                return True
    
    # Check filler phrases
    for pattern in FILLER_PHRASES:
        if re.match(pattern, text_lower):
            return True
    
    return False


def is_instruction(text: str) -> bool:
    """
    Check if a message contains instruction-like content.
    
    Args:
        text: Message text to check
        
    Returns:
        True if the message appears to be an instruction
    """
    text_lower = text.lower()
    
    # Check for instruction indicators
    for pattern in INSTRUCTION_INDICATORS:
        if re.search(pattern, text_lower):
            return True
    
    # Check for imperative sentence structure
    # Starts with a verb or "please"
    imperative_start = r'^(please\s+)?(always|never|make|ensure|don\'t|do|check|verify|test|push|deploy|update|add|remove|fix|use|keep|remember)'
    if re.match(imperative_start, text_lower):
        return True
    
    return False


def calculate_instruction_score(text: str) -> float:
    """
    Calculate a score indicating how likely a message is to be an instruction.
    
    Args:
        text: Message text to score
        
    Returns:
        Score from 0.0 (not instruction) to 1.0 (definitely instruction)
    """
    score = 0.0
    text_lower = text.lower()
    
    # Instruction indicators add to score
    for pattern in INSTRUCTION_INDICATORS:
        if re.search(pattern, text_lower):
            score += 0.15
    
    # Length bonus (instructions are usually medium length)
    length = len(text)
    if 20 <= length <= 200:
        score += 0.2
    elif 200 < length <= 500:
        score += 0.1
    
    # Penalty for noise patterns
    for pattern in NOISE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            score -= 0.1
    
    # Penalty for filler
    for pattern in FILLER_PHRASES:
        if re.match(pattern, text_lower):
            score -= 0.3
    
    # Cap score between 0 and 1
    return max(0.0, min(1.0, score))


def filter_noise(messages: list[dict], threshold: float = 0.2) -> list[dict]:
    """
    Filter out noisy messages, keeping only meaningful instructions.
    
    Args:
        messages: List of message dictionaries with 'text' key
        threshold: Minimum instruction score to keep (0.0-1.0)
        
    Returns:
        Filtered list of messages
    """
    filtered = []
    
    for msg in messages:
        text = msg.get('text', '')
        
        # Skip if clearly noise
        if is_noise(text):
            continue
        
        # Calculate instruction score
        score = calculate_instruction_score(text)
        
        # Keep if score is above threshold OR if it's clearly an instruction
        if score >= threshold or is_instruction(text):
            # Add score to message for potential later use
            msg_copy = msg.copy()
            msg_copy['instruction_score'] = score
            filtered.append(msg_copy)
    
    return filtered


def clean_text(text: str) -> str:
    """
    Clean up message text for display.
    
    Args:
        text: Raw message text
        
    Returns:
        Cleaned text suitable for display
    """
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '[code]', text)
    
    # Remove inline code
    text = re.sub(r'`[^`]+`', '[code]', text)
    
    # Collapse multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Collapse multiple spaces
    text = re.sub(r' {2,}', ' ', text)
    
    # Truncate very long text
    if len(text) > 300:
        text = text[:297] + '...'
    
    return text.strip()

