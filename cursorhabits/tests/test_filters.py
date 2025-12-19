"""Tests for the filters module."""

import pytest
from cursorhabits.filters import is_noise, is_instruction, filter_noise, calculate_instruction_score


class TestIsNoise:
    """Tests for is_noise function."""
    
    def test_short_messages_are_noise(self):
        assert is_noise("ok") is True
        assert is_noise("yes") is True
        assert is_noise("continue") is True
    
    def test_file_paths_are_noise(self):
        assert is_noise("src/api/wallet_analytics_api_v4_gpt") is True
        assert is_noise("Check the file at /Users/me/project/src/index.ts") is True
    
    def test_urls_are_noise(self):
        assert is_noise("https://example.com/path/to/something") is True
    
    def test_stack_traces_are_noise(self):
        assert is_noise("[12:34:56] Error: Something went wrong") is True
    
    def test_instructions_are_not_noise(self):
        assert is_noise("Always push to GitHub after making changes") is False
        assert is_noise("Make sure to check mobile before deploying") is False
        assert is_noise("Never use silent error handling") is False


class TestIsInstruction:
    """Tests for is_instruction function."""
    
    def test_imperative_statements(self):
        assert is_instruction("Always push to GitHub") is True
        assert is_instruction("Never use fallbacks") is True
        assert is_instruction("Make sure to test on mobile") is True
        assert is_instruction("Don't forget to update the README") is True
    
    def test_questions_are_not_instructions(self):
        assert is_instruction("What do you think?") is False
        assert is_instruction("How does this work?") is False


class TestFilterNoise:
    """Tests for filter_noise function."""
    
    def test_filters_noise_keeps_instructions(self):
        messages = [
            {"text": "ok"},
            {"text": "Always push to GitHub after changes"},
            {"text": "https://example.com"},
            {"text": "Make sure to check mobile"},
        ]
        
        filtered = filter_noise(messages)
        
        # Should keep the two instruction messages
        assert len(filtered) == 2
        assert any("GitHub" in m["text"] for m in filtered)
        assert any("mobile" in m["text"] for m in filtered)


class TestCalculateInstructionScore:
    """Tests for calculate_instruction_score function."""
    
    def test_high_score_for_instructions(self):
        score = calculate_instruction_score("Always push to GitHub after every change")
        assert score > 0.3
    
    def test_low_score_for_noise(self):
        score = calculate_instruction_score("ok")
        assert score < 0.2
    
    def test_medium_score_for_ambiguous(self):
        score = calculate_instruction_score("I think we should consider this approach")
        assert 0.0 <= score <= 1.0

