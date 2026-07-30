$watchdogDir = "C:\SASS_Project\Platforme_OFPPT\ofppt_platforme\backend"
$healthUrl = "http://localhost:4000/api/health"
$logFile = "$watchdogDir\watchdog.log"
$checkInterval = 30

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -FilePath $logFile -Append
    Write-Host "$timestamp - $Message"
}

function Start-Backend {
    Write-Log "Starting backend..."
    $process = Start-Process -FilePath "node" -ArgumentList "dist\src\main.js" -WorkingDirectory $watchdogDir -PassThru -NoNewWindow -RedirectStandardOutput "$watchdogDir\backend_out.log" -RedirectStandardError "$watchdogDir\backend_err.log"
    Write-Log "Backend started with PID $($process.Id)"
    return $process
}

$process = Start-Backend
Write-Log "Watchdog started, checking health every ${checkInterval}s"

while ($true) {
    Start-Sleep -Seconds $checkInterval

    $process = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
    if (-not $process) {
        Write-Log "Process not found (crashed). Restarting..."
        $process = Start-Backend
        Start-Sleep -Seconds 5
        continue
    }

    try {
        $response = Invoke-WebRequest -Uri $healthUrl -Method GET -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $body = $response.Content | ConvertFrom-Json
            if ($body.status -eq "ok") {
                Write-Log "Health check passed (status: $($body.status), database: $($body.database))"
            } else {
                Write-Log "Health check warning: $($body | ConvertTo-Json -Compress)"
            }
        }
    } catch {
        Write-Log "Health check FAILED: $($_.Exception.Message)"
        Write-Log "Restarting backend..."
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 3
        $process = Start-Backend
        Start-Sleep -Seconds 5
    }
}
