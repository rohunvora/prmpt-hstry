"""
Database extraction module.

Reads Cursor's SQLite database to extract user messages from chat history.
Supports macOS, Windows, and Linux.
"""

import sqlite3
import json
import os
import platform
import hashlib
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional


def get_cursor_db_path() -> Path:
    """
    Get the Cursor database path for the current platform.
    
    Returns:
        Path to the state.vscdb file
        
    Raises:
        RuntimeError: If platform is unsupported
        FileNotFoundError: If database doesn't exist
    """
    system = platform.system()
    
    if system == "Darwin":  # macOS
        base = Path.home() / "Library" / "Application Support" / "Cursor"
    elif system == "Windows":
        base = Path(os.environ.get("APPDATA", "")) / "Cursor"
    elif system == "Linux":
        base = Path.home() / ".config" / "Cursor"
    else:
        raise RuntimeError(f"Unsupported platform: {system}")
    
    db_path = base / "User" / "globalStorage" / "state.vscdb"
    
    if not db_path.exists():
        raise FileNotFoundError(
            f"Cursor database not found at: {db_path}\n"
            f"Make sure Cursor is installed and you have chat history."
        )
    
    return db_path


def get_workspace_db_paths() -> list[Path]:
    """
    Get all workspace-level database paths.
    
    Returns:
        List of paths to workspace state.vscdb files
    """
    system = platform.system()
    
    if system == "Darwin":
        workspace_storage = Path.home() / "Library" / "Application Support" / "Cursor" / "User" / "workspaceStorage"
    elif system == "Windows":
        workspace_storage = Path(os.environ.get("APPDATA", "")) / "Cursor" / "User" / "workspaceStorage"
    elif system == "Linux":
        workspace_storage = Path.home() / ".config" / "Cursor" / "User" / "workspaceStorage"
    else:
        return []
    
    if not workspace_storage.exists():
        return []
    
    db_paths = []
    for workspace_dir in workspace_storage.iterdir():
        if workspace_dir.is_dir():
            db_path = workspace_dir / "state.vscdb"
            if db_path.exists():
                db_paths.append(db_path)
    
    return db_paths


def extract_messages(db_path: Path, days: Optional[int] = None) -> list[dict]:
    """
    Extract user messages from Cursor's SQLite database.
    
    Args:
        db_path: Path to the state.vscdb file
        days: If set, only extract messages from the last N days
        
    Returns:
        List of message dictionaries with 'text' and 'composer_id' keys
    """
    messages = []
    
    # Get composer timestamps for date filtering
    composer_timestamps = {}
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    if days:
        cursor.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'composerData:%'")
        for key, value in cursor.fetchall():
            try:
                data = json.loads(value)
                composer_id = key.replace('composerData:', '')
                created = data.get('createdAt') or data.get('lastUpdatedAt')
                if created:
                    composer_timestamps[composer_id] = created
            except (json.JSONDecodeError, KeyError):
                pass
        
        cutoff = (datetime.now() - timedelta(days=days)).timestamp() * 1000
        recent_composers = {k for k, v in composer_timestamps.items() if v > cutoff}
    else:
        recent_composers = None
    
    # Extract messages from bubbleId entries
    cursor.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'bubbleId:%'")
    
    for key, value in cursor.fetchall():
        try:
            # Skip null values
            if value is None:
                continue
                
            parts = key.split(':')
            if len(parts) >= 2:
                composer_id = parts[1]
                
                # Filter by date if specified
                if recent_composers is not None and composer_id not in recent_composers:
                    continue
                
                data = json.loads(value)
                
                # Type 1 = user message, Type 2 = assistant
                if data.get('type') == 1:
                    text = data.get('text', '') or data.get('rawText', '')
                    if text and len(text.strip()) > 5:
                        bubble_id = parts[2] if len(parts) > 2 else data.get('bubbleId', 'unknown')
                        messages.append({
                            'text': text.strip(),
                            'composer_id': composer_id,
                            'bubble_id': bubble_id,
                            'created_at': data.get('createdAt'),
                        })
        except (json.JSONDecodeError, KeyError, IndexError):
            continue
    
    conn.close()
    
    # Also extract from workspace databases
    workspace_dbs = get_workspace_db_paths()
    for ws_db in workspace_dbs:
        try:
            ws_messages = _extract_from_db(ws_db, recent_composers)
            messages.extend(ws_messages)
        except Exception:
            continue
    
    # Deduplicate by text hash
    seen = set()
    unique_messages = []
    for msg in messages:
        text_hash = hashlib.md5(msg['text'].encode()).hexdigest()
        if text_hash not in seen:
            seen.add(text_hash)
            unique_messages.append(msg)
    
    return unique_messages


def _extract_from_db(db_path: Path, recent_composers: Optional[set] = None) -> list[dict]:
    """Extract messages from a single database file."""
    messages = []
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'bubbleId:%'")
        
        for key, value in cursor.fetchall():
            try:
                # Skip null values
                if value is None:
                    continue
                    
                parts = key.split(':')
                if len(parts) >= 2:
                    composer_id = parts[1]
                    
                    if recent_composers is not None and composer_id not in recent_composers:
                        continue
                    
                    data = json.loads(value)
                    if data.get('type') == 1:
                        text = data.get('text', '') or data.get('rawText', '')
                        if text and len(text.strip()) > 5:
                            messages.append({
                                'text': text.strip(),
                                'composer_id': composer_id,
                                'workspace': db_path.parent.name,
                            })
            except (json.JSONDecodeError, KeyError, IndexError):
                continue
        
        conn.close()
    except Exception:
        pass
    
    return messages

