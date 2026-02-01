# Database Setup Script for Voting System
# Prerequisites: PostgreSQL must be installed

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Ballot Without Papers - Database Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Database configuration
$DB_NAME = "voting_system"
$DB_USER = "postgres"
$DB_PASSWORD = Read-Host "Enter PostgreSQL password for user 'postgres'" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

# Test PostgreSQL connection
Write-Host "Testing PostgreSQL connection..." -ForegroundColor Yellow
$env:PGPASSWORD = $DB_PASSWORD_PLAIN

try {
    $testConnection = & psql -U $DB_USER -d postgres -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Cannot connect to PostgreSQL. Please ensure:" -ForegroundColor Red
        Write-Host "   1. PostgreSQL is installed" -ForegroundColor Red
        Write-Host "   2. PostgreSQL service is running" -ForegroundColor Red
        Write-Host "   3. Password is correct" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ PostgreSQL connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first." -ForegroundColor Red
    exit 1
}

# Check if database exists
Write-Host ""
Write-Host "Checking if database exists..." -ForegroundColor Yellow
$dbExists = & psql -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" 2>&1

if ($dbExists -eq "1") {
    Write-Host "⚠️  Database '$DB_NAME' already exists." -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to DROP and recreate it? (yes/no)"
    
    if ($overwrite -eq "yes") {
        Write-Host "Dropping existing database..." -ForegroundColor Yellow
        & psql -U $DB_USER -d postgres -c "DROP DATABASE $DB_NAME;" 2>&1 | Out-Null
        Write-Host "✅ Existing database dropped" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Keeping existing database. Schema will be applied (may fail if tables exist)." -ForegroundColor Yellow
    }
}

# Create database if it doesn't exist
if ($dbExists -ne "1" -or $overwrite -eq "yes") {
    Write-Host ""
    Write-Host "Creating database '$DB_NAME'..." -ForegroundColor Yellow
    & psql -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create database" -ForegroundColor Red
        exit 1
    }
}

# Run schema.sql
Write-Host ""
Write-Host "Running schema.sql..." -ForegroundColor Yellow
$schemaPath = Join-Path $PSScriptRoot "Backend\database\schema.sql"

if (Test-Path $schemaPath) {
    & psql -U $DB_USER -d $DB_NAME -f $schemaPath 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database schema created successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to apply schema" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Schema file not found at: $schemaPath" -ForegroundColor Red
    exit 1
}

# Verify tables were created
Write-Host ""
Write-Host "Verifying database setup..." -ForegroundColor Yellow
$tables = & psql -U $DB_USER -d $DB_NAME -c "\dt" 2>&1

if ($tables -match "admins" -and $tables -match "elections" -and $tables -match "voters") {
    Write-Host "✅ All tables created successfully:" -ForegroundColor Green
    Write-Host "   - admins" -ForegroundColor Gray
    Write-Host "   - elections" -ForegroundColor Gray
    Write-Host "   - voters" -ForegroundColor Gray
    Write-Host "   - votes" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some tables may be missing" -ForegroundColor Yellow
}

# Create/Update .env file
Write-Host ""
Write-Host "Creating backend .env configuration..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "Backend\server\.env"
$envContent = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD_PLAIN

# JWT Configuration
JWT_SECRET=$(New-Guid).Guid

# Server Configuration
PORT=3001
NODE_ENV=development

# Blockchain Configuration (will be updated after deployment)
BLOCKCHAIN_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=

"@

$envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force
Write-Host "✅ Environment file created at: Backend\server\.env" -ForegroundColor Green

# Display default admin credentials
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ✅ Database Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Admin Credentials (CHANGE IN PRODUCTION):" -ForegroundColor Yellow
Write-Host "  Email: admin@example.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Run: .\start-all.ps1" -ForegroundColor White
Write-Host "     (This will start blockchain, deploy contracts, and start servers)" -ForegroundColor Gray
Write-Host ""
Write-Host "Or manually:" -ForegroundColor Cyan
Write-Host "  1. Start Hardhat: cd Backend; npx hardhat node" -ForegroundColor White
Write-Host "  2. Deploy contracts: cd Backend; npx hardhat run scripts/deploy.js --network localhost" -ForegroundColor White
Write-Host "  3. Start backend: cd Backend\server; npm start" -ForegroundColor White
Write-Host "  4. Start frontend: cd voting-frontend; npm start" -ForegroundColor White
Write-Host ""

# Clean up password
$env:PGPASSWORD = ""
