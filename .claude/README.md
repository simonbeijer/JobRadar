# Basic Setup Claude Hooks

Ultra-simple Claude Code hooks for Next.js projects. Designed to work seamlessly with projects created from the `basic-next-setup` template.

## Features

- **Security**: Blocks dangerous commands (rm -rf, .env access)
- **Build Protection**: Blocks npm run build (Docker handles builds)
- **Code Quality**: Automatic lint & prettier checks on file edits
- **Logging**: All hook events logged to `logs/` directory
- **TTS Notifications**: Audio alerts when Claude needs input or completes tasks
- **Zero Configuration**: Works immediately after setup

## Quick Start

### 1. Setup for New Project

```bash
# Copy your template
cp -r basic-next-setup my-new-project
cd my-new-project

# Setup hooks (one command)
~/basic-setup-claude-hooks/setup.sh

# Start coding with Claude
claude-code
```

### 2. Setup for Existing Project

```bash
# Navigate to your project
cd /path/to/your/project

# Setup hooks
~/basic-setup-claude-hooks/setup.sh

# Start coding with Claude
claude-code
```

## What Gets Created

After running `setup.sh`, your project will have:

```
your-project/
├── .claude -> ~/basic-setup-claude-hooks/.claude  # Symlink to hooks
├── logs/                                          # Hook execution logs
└── [your project files]
```

## Hook Capabilities

### Security Features
- Blocks dangerous `rm -rf` commands
- Prevents access to `.env` files
- Blocks npm run build commands (Docker handles builds)
- Logs all tool usage for audit

### Notifications
- TTS audio alerts when Claude needs input
- Completion notifications when tasks finish
- Subagent completion tracking

### Code Quality Features
- **Lint Automation**: Runs ESLint on JavaScript/TypeScript file edits
- **Prettier Automation**: Runs Prettier on JavaScript/TypeScript file edits
- **Environment Control**: Enable/disable with environment variables
- **Non-blocking**: Quality checks run in background, don't halt Claude

### Logging
All hook events are logged in `logs/`:
- `pre_tool_use.json` - Tool execution attempts
- `post_tool_use.json` - Tool execution results
- `notification.json` - Claude notifications
- `stop.json` - Task completion events
- `subagent_stop.json` - Subagent completion events
- `chat.json` - Readable conversation transcript

## Requirements

- **[Astral UV](https://docs.astral.sh/uv/)** - Python package manager
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic's CLI

Optional (for enhanced TTS):
- **ElevenLabs API Key** - Best quality TTS
- **OpenAI API Key** - Good quality TTS
- **pyttsx3** - Fallback local TTS (no API key needed)

## Environment Variables

For enhanced TTS notifications, set these in your `.env`:

```bash
# Optional: For personalized notifications
ENGINEER_NAME="Your Name"

# Optional: For enhanced TTS (priority order)
ELEVENLABS_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Optional: Enable code quality checks
HOOK_LINT_ENABLED=true
HOOK_PRETTIER_ENABLED=true
```

## Project Integration

### Docker Workflow
- **Build Protection**: Hooks block `npm run build` since Docker handles builds
- **Development Server**: Use Docker for consistent development environment
- **Code Quality**: Automatic lint/prettier checks maintain code standards

### basic-next-setup Template
- **Seamless Integration**: Hooks designed specifically for this template
- **Zero Configuration**: Works immediately after setup
- **Docker First**: Respects Docker-based development workflow

## Usage Tips

1. **Template Workflow**: Always start with `basic-next-setup` template
2. **One Setup**: Run `setup.sh` once per project
3. **Automatic Logging**: Check `logs/` directory for hook activity
4. **Safe Operations**: Hooks prevent dangerous commands automatically
5. **Code Quality**: Enable lint/prettier checks for automatic code formatting

## Troubleshooting

### Symlink Issues
```bash
# Remove broken symlink
rm .claude

# Re-run setup
~/basic-setup-claude-hooks/setup.sh
```

### Missing Logs
```bash
# Ensure logs directory exists
mkdir -p logs
```

### Hook Not Working
```bash
# Check UV installation
uv --version

# Check Claude Code installation
claude-code --version
```

## File Structure

```
.claude/
├── settings.json              # Claude Code configuration
└── hooks/
    ├── pre_tool_use.py        # Security & logging
    ├── post_tool_use.py       # Results & logging
    ├── notification.py        # User alerts
    ├── stop.py                # Completion handling
    ├── subagent_stop.py       # Subagent completion
    └── utils/
        ├── tts/               # Text-to-speech providers
        └── llm/               # Language model integrations
```

## Contributing

This is a learning repository. Feel free to:
- Add new hook functionality
- Improve existing hooks
- Share improvements back

---

**Keep it simple. Just works.** 🚀