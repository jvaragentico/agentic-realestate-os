# Agentic Real Estate Operating System

Voice-first Agentic Real Estate OS coordinating AI agents, humans and tools to move property transactions from lead to close.

## Beta contract
- 28 days
- Infrastructure/API ceiling: $250
- Industry-neutral core + Real Estate Pack #1
- Traditional sale/rental workflows first
- Fractional/on-chain flow sandbox-only during beta

## Stack
Next.js 16 + TypeScript, Supabase/PostgreSQL/Auth/Realtime, Vercel, replaceable provider interfaces.

## Architecture
User → AI Manager → Orchestrator/CLOSE → specialist agents → policy/approval engine → tools + humans → audited result.

## Day 1 foundation
Core domain abstractions, Real Estate Pack boundary, provider contracts, multi-tenant SQL/RLS foundation, approval/audit/usage tables, and initial responsive AI Manager shell.

Copy .env.example to .env.local when connecting Supabase. Never commit secrets.
