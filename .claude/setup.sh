#!/bin/bash

# Basic Setup Claude Hooks - Setup Script
# This script sets up Claude Code hooks in a project directory

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
HOOKS_DIR="$SCRIPT_DIR/.claude"

# Get project directory (use argument or current directory)
PROJECT_DIR=${1:-$(pwd)}

# Ensure PROJECT_DIR is absolute
if [[ ! "$PROJECT_DIR" = /* ]]; then
    PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"
fi

echo -e "${YELLOW}Setting up Claude Code hooks for project: $PROJECT_DIR${NC}"

# Check if hooks directory exists
if [ ! -d "$HOOKS_DIR" ]; then
    echo -e "${RED}Error: Hooks directory not found at $HOOKS_DIR${NC}"
    exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Error: Project directory not found at $PROJECT_DIR${NC}"
    exit 1
fi

# Remove existing .claude directory/symlink if it exists
if [ -e "$PROJECT_DIR/.claude" ]; then
    echo -e "${YELLOW}Removing existing .claude directory/symlink...${NC}"
    rm -rf "$PROJECT_DIR/.claude"
fi

# Create symlink
echo -e "${YELLOW}Creating symlink to hooks...${NC}"
ln -sf "$HOOKS_DIR" "$PROJECT_DIR/.claude"

# Create logs directory
echo -e "${YELLOW}Creating logs directory...${NC}"
mkdir -p "$PROJECT_DIR/logs"

# Verify symlink was created successfully
if [ -L "$PROJECT_DIR/.claude" ] && [ -e "$PROJECT_DIR/.claude" ]; then
    echo -e "${GREEN}✅ Claude Code hooks setup complete!${NC}"
    echo -e "${GREEN}   Project: $PROJECT_DIR${NC}"
    echo -e "${GREEN}   Hooks: $HOOKS_DIR${NC}"
    echo -e "${GREEN}   Logs: $PROJECT_DIR/logs${NC}"
    echo ""
    echo -e "${YELLOW}Usage: Navigate to your project and run 'claude-code'${NC}"
else
    echo -e "${RED}❌ Error: Failed to create symlink${NC}"
    exit 1
fi