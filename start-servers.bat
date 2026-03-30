@echo off
cd /d "c:\Users\lukas\.vscode\projects\medivisitas"
start "MediVisitas API" cmd /c "pnpm --filter @medivisitas/api dev"
start "MediVisitas Web" cmd /c "pnpm --filter @medivisitas/web dev"
