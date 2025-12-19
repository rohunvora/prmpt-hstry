"""
Pattern analysis module.

Detects repeated patterns, phrases, and similar messages in chat history.
"""

import re
from collections import Counter
from typing import Optional


# Pattern definitions with human-readable labels
PATTERN_DEFINITIONS = [
    ("github_push", r'push.*(github|changes)|commit.*(push|github)|git.*push|push.*to.*github', "GitHub Workflow"),
    ("vercel_deploy", r'vercel|deploy|not local|skip.*local|test.*live|go.*live|production.*url', "Deployment"),
    ("update_docs", r'update.*(readme|doc|scratchpad)|readme', "Documentation"),
    ("mobile_check", r'mobile|phone|responsive|how.*look.*on', "Mobile-First"),
    ("no_fallbacks", r'no.*fallback|don\'t.*fallback|silent.*error|swallow|no.*try.*catch', "Error Handling"),
    ("check_before", r'before (you|implement|build|continu)|think.*before|plan.*first', "Planning"),
    ("api_keys", r'\.env|api.?key|secret|token|environment.*var', "Environment"),
    ("be_concise", r'concise|brief|short|less.*(text|words)|don\'t.*over.*explain', "Communication"),
    ("verify_data", r'verify|double.?check|make sure.*(data|calc|math)|check.*math', "Data Verification"),
    ("comment_code", r'comment|document|explain.*(code|function)', "Code Documentation"),
    ("user_perspective", r'user.*perspective|user.*experience|how.*user|real.*user', "User Focus"),
    ("clean_code", r'clean.*up|remove.*dead|archive.*old|refactor', "Code Quality"),
]


def analyze_patterns(messages: list[dict]) -> dict:
    """
    Analyze messages for repeated instruction patterns.
    
    Args:
        messages: List of message dictionaries with 'text' key
        
    Returns:
        Dictionary mapping pattern names to their data (count, label, examples)
    """
    texts = [m['text'] for m in messages]
    
    patterns = {}
    for name, regex, label in PATTERN_DEFINITIONS:
        matches = []
        for text in texts:
            if re.search(regex, text.lower()):
                matches.append(text)
        
        if matches:
            patterns[name] = {
                'count': len(matches),
                'label': label,
                'examples': matches[:5],  # Keep top 5 examples
            }
    
    # Sort by frequency (highest first)
    patterns = dict(sorted(patterns.items(), key=lambda x: -x[1]['count']))
    
    return patterns


def find_repeated_phrases(messages: list[dict], min_count: int = 3) -> list[tuple[str, int]]:
    """
    Find phrases that appear multiple times across messages.
    
    Args:
        messages: List of message dictionaries with 'text' key
        min_count: Minimum occurrences to be considered repeated
        
    Returns:
        List of (phrase, count) tuples, sorted by frequency
    """
    texts = [m['text'].lower() for m in messages]
    
    ngram_counter = Counter()
    
    for text in texts:
        # Clean and tokenize
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        # Extract n-grams of varying lengths (3-7 words)
        for n in range(3, 8):
            for i in range(len(words) - n + 1):
                ngram = ' '.join(words[i:i+n])
                
                # Filter out very short or generic phrases
                if len(ngram) > 15:
                    # Skip if mostly stopwords
                    stopwords = {'the', 'a', 'an', 'is', 'are', 'to', 'and', 'or', 'in', 
                                'on', 'at', 'for', 'with', 'this', 'that', 'it', 'of', 'be'}
                    ngram_words = set(ngram.split())
                    if len(ngram_words - stopwords) >= 2:
                        ngram_counter[ngram] += 1
    
    # Filter by minimum count
    repeated = [(phrase, count) for phrase, count in ngram_counter.items() if count >= min_count]
    
    # Sort by frequency, then by length (prefer longer phrases)
    repeated.sort(key=lambda x: (-x[1], -len(x[0])))
    
    # Remove substrings (keep longer phrases)
    filtered = []
    for phrase, count in repeated:
        is_substring = False
        for existing_phrase, _ in filtered:
            if phrase in existing_phrase:
                is_substring = True
                break
        if not is_substring:
            filtered.append((phrase, count))
    
    return filtered[:20]  # Top 20


def cluster_similar_messages(messages: list[dict], similarity_threshold: float = 0.5) -> list[list[str]]:
    """
    Group similar messages together using word overlap.
    
    Args:
        messages: List of message dictionaries with 'text' key
        similarity_threshold: Minimum Jaccard similarity to group messages
        
    Returns:
        List of message groups (each group is a list of similar message texts)
    """
    
    def get_words(text: str) -> set:
        """Extract significant words (4+ chars) from text."""
        return set(re.findall(r'\b\w{4,}\b', text.lower()))
    
    def jaccard_similarity(text1: str, text2: str) -> float:
        """Calculate Jaccard similarity between two texts."""
        words1 = get_words(text1)
        words2 = get_words(text2)
        if not words1 or not words2:
            return 0.0
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        return intersection / union if union > 0 else 0.0
    
    groups = []
    used = set()
    
    for i, msg1 in enumerate(messages):
        if i in used:
            continue
        
        group = [msg1['text']]
        used.add(i)
        
        for j, msg2 in enumerate(messages[i+1:], i+1):
            if j in used:
                continue
            
            if jaccard_similarity(msg1['text'], msg2['text']) >= similarity_threshold:
                group.append(msg2['text'])
                used.add(j)
        
        # Only keep groups with 2+ messages
        if len(group) >= 2:
            groups.append(group)
    
    # Sort by group size (largest first)
    groups.sort(key=lambda x: -len(x))
    
    return groups[:15]  # Top 15 groups

