# Complete Startup Script for Ballot Without Papers System
# This script starts all required services in the correct order

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Ballot Without Papers - System Startup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

# Check if .env exists
$envPath = Join-Path $projectRoot "Backend\server\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ Backend .env file not found!" -ForegroundColor Red
    Write-Host "Please run .\setup-database.ps1 first to create the database and configuration." -ForegroundColor Yellow
    exit 1
}

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return $connection
}

# Function to wait for service to be ready
function Wait-ForService {
    param(
        [string]$Name,
        [int]$Port,
        [int]$TimeoutSeconds = 60
    )
    
    Write-Host "Waiting for $Name to be ready on port $Port..." -ForegroundColor Yellow
    $elapsed = 0
    
    while ($elapsed -lt $TimeoutSeconds) {
        if (Test-Port -Port $Port) {
            Write-Host "✅ $Name is ready!" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
        $elapsed += 2
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "❌ Timeout waiting for $Name" -ForegroundColor Red
    return $false
}

Write-Host "Step 1: Starting Hardhat Local Blockchain..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray
Write-Host ""

# Check if Hardhat is already running
if (Test-Port -Port 8545) {
    Write-Host "⚠️  Port 8545 is already in use. Hardhat may already be running." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (yes/no)"
    if ($continue -ne "yes") {
        exit 0
    }
} else {
    # Start Hardhat in new window
    $hardhatPath = Join-Path $projectRoot "Backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$hardhatPath'; Write-Host 'Starting Hardhat Blockchain...' -ForegroundColor Cyan; npx hardhat node" -PassThru
    
    # Wait for Hardhat to be ready
    if (-not (Wait-ForService -Name "Hardhat" -Port 8545 -TimeoutSeconds 30)) {
        Write-Host "Failed to start Hardhat. Please check the Hardhat window for errors." -ForegroundColor Red
        exit 1
    }
}

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Step 2: Deploying Smart Contracts..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray
Write-Host ""

# Deploy contracts
cd (Join-Path $projectRoot "Backend")
Write-Host "Running deployment script..." -ForegroundColor Yellow
$deployOutput = npx hardhat run scripts/deploy.js --network localhost 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Contracts deployed successfully!" -ForegroundColor Green
    Write-Host $deployOutput
    
    # Extract contract address from output
    $contractAddress = $deployOutput | Select-String -Pattern "Election contract deployed at: (0x[a-fA-F0-9]{40})" | ForEach-Object { $_.Matches.Groups[1].Value }
    
    if ($contractAddress) {
        Write-Host "Contract Address: $contractAddress" -ForegroundColor Green
        
        # Update .env file with contract address
        $envContent = Get-Content $envPath -Raw
        $envContent = $envContent -replace "CONTRACT_ADDRESS=.*", "CONTRACT_ADDRESS=$contractAddress"
        $envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force
        Write-Host "✅ Contract address updated in .env file" -ForegroundColor Green
        
        # Update frontend contract address
        $frontendEnvPath = Join-Path $projectRoot "voting-frontend\.env"
        $frontendEnvContent = @"
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_BLOCKCHAIN_URL=http://127.0.0.1:8545
REACT_APP_CONTRACT_ADDRESS=$contractAddress
"@
        $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding UTF8 -Force
        Write-Host "✅ Frontend .env file updated" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Failed to deploy contracts" -ForegroundColor Red
    Write-Host $deployOutput
    exit 1
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Step 3: Starting Backend API Server..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray
Write-Host ""

# Check if backend port is already in use
if (Test-Port -Port 3001) {
    Write-Host "⚠️  Port 3001 is already in use. Backend may already be running." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (yes/no)"
    if ($continue -ne "yes") {
        exit 0
    }
} else {
    # Start backend server in new window
    $backendPath = Join-Path $projectRoot "Backend\server"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Backend API Server...' -ForegroundColor Cyan; npm start" -PassThru
    
    # Wait for backend to be ready
    if (-not (Wait-ForService -Name "Backend API" -Port 3001 -TimeoutSeconds 30)) {
        Write-Host "Failed to start Backend. Please check the Backend window for errors." -ForegroundColor Red
        exit 1
    }
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Step 4: Starting Frontend Development Server..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray
Write-Host ""

# Check if frontend port is already in use
if (Test-Port -Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Frontend may already be running." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (yes/no)"
    if ($continue -ne "yes") {
        exit 0
    }
} else {
    # Start frontend server in new window
    $frontendPath = Join-Path $projectRoot "voting-frontend"
    
    # Set environment variable to prevent browser auto-opening
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:BROWSER='none'; cd '$frontendPath'; Write-Host 'Starting Frontend Development Server...' -ForegroundColor Cyan; npm start" -PassThru
    
    Write-Host "Waiting for Frontend to compile and start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    if (-not (Wait-ForService -Name "Frontend" -Port 3000 -TimeoutSeconds 60)) {
        Write-Host "⚠️  Frontend may still be starting. Check the Frontend window." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ✅ All Services Started Successfully!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
Write-Host "  🔗 Hardhat Blockchain:  http://127.0.0.1:8545" -ForegroundColor White
Write-Host "  🔗 Backend API:         http://localhost:3001" -ForegroundColor White
Write-Host "  🔗 Frontend:            http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@example.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Quick Links:" -ForegroundColor Cyan
Write-Host "  Admin Login:  http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "  Voter Portal: http://localhost:3000/" -ForegroundColor White
Write-Host ""
Write-Host "To stop all services, close all PowerShell windows or press Ctrl+C in each." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Browser opened. Happy voting!" -ForegroundColor Green
Write-Host ""
