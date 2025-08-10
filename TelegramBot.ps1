Set-Location $PSScriptRoot

Start-Process node -ArgumentList "-r dotenv/config index.js"
