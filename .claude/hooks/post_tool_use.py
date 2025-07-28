#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# dependencies = [
#     "python-dotenv",
# ]
# ///

import json
import os
import sys
import subprocess
from pathlib import Path

try:
    from dotenv import load_dotenv
    # Load environment variables from .claude/.env
    load_dotenv(Path(__file__).parent.parent / '.env')
except ImportError:
    pass

def run_linting_if_enabled(input_data):
    """Run linting if enabled and a file was edited."""
    try:
        # Check if linting is enabled
        if not os.getenv('HOOK_LINT_ENABLED', '').lower() == 'true':
            return
        
        # Check if this was a file editing tool
        tool_name = input_data.get('tool_name', '')
        if tool_name not in ['Edit', 'MultiEdit', 'Write', 'NotebookEdit']:
            return
        
        # Get the file path that was edited
        tool_input = input_data.get('tool_input', {})
        file_path = tool_input.get('file_path', '')
        
        if not file_path:
            return
        
        # Check if it's a JavaScript/TypeScript file
        if file_path.endswith(('.js', '.jsx', '.ts', '.tsx')):
            # Run npm run lint with timeout
            subprocess.run(['npm', 'run', 'lint'], 
                         capture_output=True, 
                         timeout=30,
                         cwd=Path.cwd())
        
    except Exception:
        # Fail silently if linting encounters any issues
        pass

def run_prettier_if_enabled(input_data):
    """Run prettier check if enabled and a file was edited."""
    try:
        # Check if prettier is enabled
        if not os.getenv('HOOK_PRETTIER_ENABLED', '').lower() == 'true':
            return
        
        # Check if this was a file editing tool
        tool_name = input_data.get('tool_name', '')
        if tool_name not in ['Edit', 'MultiEdit', 'Write', 'NotebookEdit']:
            return
        
        # Get the file path that was edited
        tool_input = input_data.get('tool_input', {})
        file_path = tool_input.get('file_path', '')
        
        if not file_path:
            return
        
        # Check if it's a JavaScript/TypeScript file
        if file_path.endswith(('.js', '.jsx', '.ts', '.tsx')):
            # Run prettier check with timeout (check mode for safety)
            subprocess.run(['npm', 'run', 'prettier:check'], 
                         capture_output=True, 
                         timeout=30,
                         cwd=Path.cwd())
        
    except Exception:
        # Fail silently if prettier encounters any issues
        pass

def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)
        
        # Ensure log directory exists
        log_dir = Path.cwd() / 'logs'
        log_dir.mkdir(parents=True, exist_ok=True)
        log_path = log_dir / 'post_tool_use.json'
        
        # Read existing log data or initialize empty list
        if log_path.exists():
            with open(log_path, 'r') as f:
                try:
                    log_data = json.load(f)
                except (json.JSONDecodeError, ValueError):
                    log_data = []
        else:
            log_data = []
        
        # Append new data
        log_data.append(input_data)
        
        # Write back to file with formatting
        with open(log_path, 'w') as f:
            json.dump(log_data, f, indent=2)
        
        # Run linting if enabled and file was edited
        run_linting_if_enabled(input_data)
        
        # Run prettier check if enabled and file was edited
        run_prettier_if_enabled(input_data)
        
        sys.exit(0)
        
    except json.JSONDecodeError:
        # Handle JSON decode errors gracefully
        sys.exit(0)
    except Exception:
        # Exit cleanly on any other error
        sys.exit(0)

if __name__ == '__main__':
    main()