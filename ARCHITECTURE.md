# JARVIS AI - Architecture & Design

## Vision

JARVIS is a modular, adaptive, secure, multi-device personal AI assistant. This document outlines the Phase 0 architectural foundation.

## Core Principles

1. **Modularity** - Independent modules with clear interfaces
2. **Security First** - No secrets in code, OAuth/tokens for integrations
3. **Privacy by Design** - Minimal data retention, explicit permissions
4. **Incremental Growth** - Add capabilities without rewriting
5. **Real Implementation** - No mocks, only functional code or documented limitations

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                        │
│  (Dashboard, Voice UI, Mobile App, Device Controllers)       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY LAYER                        │
│  (REST/WebSocket, Rate Limiting, Request Validation)        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   AUTHENTICATION LAYER                        │
│  (OAuth 2.0, JWT, Session Management, MFA)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   JARVIS CORE ORCHESTRATOR                    │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐     │
│  │ Interpreter  │  │ Task Manager  │  │ Permission   │     │
│  │ (Intent)     │  │ (Executor)    │  │ Enforcer     │     │
│  └──────────────┘  └───────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────┐  ┌─────────────┐  ┌──────────────┐
│  MEMORY │  │   TOOL &    │  │  PERMISSION  │
│ ENGINE  │  │  SKILL      │  │  ENGINE      │
│         │  │  ENGINE     │  │              │
└─────────┘  └─────────────┘  └──────────────┘
    │              │                │
    └──────┬───────┴────────┬───────┘
           │                │
    ┌──────▼─────┐   ┌──────▼──────────┐
    │   USER &   │   │   DEVICE &      │
    │ IDENTITY   │   │   INTEGRATION   │
    │ ENGINE     │   │   ENGINE        │
    └────────────┘   └─────────────────┘
           │                │
           └────────┬───────┘
                    │
┌───────────────────▼───────────────────┐
│         EXTERNAL INTEGRATIONS         │
│  (APIs, Cloud Services, Devices)      │
└───────────────────────────────────────┘
```

## Core Modules

### 1. AI Core Orchestrator
- **Responsibility**: Receive requests, determine intent, orchestrate execution
- **Key Functions**: interpret(), orchestrate(), execute(), returnResult()
- **No Direct Tools**: Uses Task Orchestrator & Tool Engine

### 2. Task Orchestrator
- **Responsibility**: Break complex requests into sequential steps
- **Supports**: Planning, execution, progress tracking, error recovery
- **Example Flow**: Research request → collect data → compare → analyze → conclude

### 3. Memory Engine
Separated into:
- **SHORT_TERM_MEMORY**: Current conversation context
- **LONG_TERM_MEMORY**: Persistent user data, preferences
- **TASK_HISTORY**: Completed & in-progress tasks
- **DEVICE_MEMORY**: Registered devices, capabilities
- **SKILL_MEMORY**: Installed skills, versions

### 4. Permission Engine
Risk Levels:
- **LOW_RISK**: Open app, query info
- **MEDIUM_RISK**: Change settings, send messages
- **HIGH_RISK**: Account changes, irreversible actions
- **CRITICAL**: Requires additional auth

### 5. User Identity & Access
- **PRIMARY_OWNER**: Full authority
- **AUTHORIZED_USER**: Delegated permissions
- **GUEST**: Limited, temporary access
- **UNKNOWN_USER**: Minimal permissions

### 6. Device Manager
- Tracks connected devices
- Manages capabilities per device
- Handles permissions per device
- Supports multi-device sessions (JARVIS Handoff)

### 7. Skill & Tool Engine
- Standardized tool interface
- Permission checks before execution
- Error handling & recovery
- Version management

### 8. Adaptive Skill Engine
- Skill Registry
- Dynamic skill installation
- Risk analysis
- User authorization for new capabilities

### 9. Security Engine
- Authentication & Authorization
- Session management
- Secret storage (never in code)
- Input validation
- Rate limiting
- Audit logging

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS (scalable, modular, TypeScript-first)
- **Database**: PostgreSQL (structured data, migrations)
- **Cache**: Redis (short-term memory, sessions)
- **Message Queue**: Bull (task orchestration)
- **Auth**: Passport.js (OAuth, JWT)
- **Validation**: Joi, Class-Validator
- **Logging**: Winston, Morgan
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18+
- **Build**: Vite
- **State Management**: Redux Toolkit / Zustand
- **UI Components**: Material-UI or Tailwind
- **Real-time**: Socket.io
- **Validation**: Zod

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev), Kubernetes (prod-ready)
- **Observability**: Prometheus, Grafana, ELK Stack
- **CI/CD**: GitHub Actions

## Database Schema (Phase 0)

```
Users
├── id (UUID)
├── username
├── email
├── password_hash (bcrypt)
├── role (PRIMARY_OWNER, AUTHORIZED_USER, GUEST)
├── settings (JSON)
└── created_at, updated_at

Devices
├── id (UUID)
├── user_id (FK)
├── name
├── type (PHONE, TABLET, COMPUTER, TV, SMART_HOME, etc.)
├── capabilities (JSON array)
├── last_seen
└── is_active

Sessions
├── id (UUID)
├── user_id (FK)
├── device_id (FK)
├── token_hash
├── expires_at
└── created_at

Permissions
├── id (UUID)
├── user_id (FK)
├── resource
├── action
├── risk_level
├── approved
├── expires_at

Skills
├── id (UUID)
├── name
├── version
├── description
├── enabled
├── installed_at
└── metadata (JSON)

Tools
├── id (UUID)
├── skill_id (FK)
├── name
├── parameters (JSON schema)
├── risk_level
└── version

Tasks
├── id (UUID)
├── user_id (FK)
├── type
├── status (PENDING, IN_PROGRESS, COMPLETED, FAILED)
├── input_data (JSON)
├── output_data (JSON)
└── created_at, completed_at

TaskSteps
├── id (UUID)
├── task_id (FK)
├── order
├── status
├── description
└── error_log (JSON)

AuditLogs
├── id (UUID)
├── user_id (FK)
├── action
├── resource
├── risk_level
├── timestamp
└── metadata (JSON)
```

## Phase 0 Deliverables

- ✅ Repository structure
- ✅ Configuration files (env, docker, etc.)
- ✅ Backend skeleton (NestJS)
- ✅ Frontend skeleton (React)
- ✅ Database migrations
- ✅ Authentication base
- ✅ Permission system draft
- ✅ Error handling
- ✅ Logging setup
- ✅ Testing infrastructure
- ✅ API documentation
- ✅ Security guidelines

## Future Phases

### Phase 1: Core Functionality
- AI Interpreter (intent detection)
- Task Orchestrator (step planning)
- Tool Execution Engine
- Basic Skills

### Phase 2: Voice & Multimodal
- Speech-to-Text integration
- Text-to-Speech integration
- Wake word detection
- Multi-modal input handling

### Phase 3: Device Integration
- Device discovery
- Device capabilities mapping
- JARVIS Handoff
- Multi-device sessions

### Phase 4: Adaptive Skills
- Skill marketplace
- Dynamic skill installation
- Self-configuration

### Phase 5: Advanced Features
- Face recognition
- Smart home integration
- Automation engine
- Research & analysis engines

## Security Considerations

1. **Never store plaintext passwords** - Use bcrypt with salt
2. **Never commit secrets** - Use environment variables, .env.local in .gitignore
3. **OAuth for integrations** - No API keys in requests
4. **Rate limiting** - Prevent abuse
5. **Input validation** - All user input validated server-side
6. **HTTPS only** - All communications encrypted
7. **CORS properly configured** - Only allowed origins
8. **Secrets rotation** - Regular token/key rotation
9. **Audit logging** - Track all critical actions
10. **Session revocation** - Users can revoke access anytime

## Running Locally

See [DEVELOPMENT.md](./DEVELOPMENT.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
