$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    if ($file.Name -like "update_*.ps1" -or $file.Name -eq "add_responsive.ps1" -or $file.Name -eq "fix_responsive.ps1" -or $file.Name -eq "pwa_setup.ps1" -or $file.Name -eq "fix_nav_button.ps1") { continue }
    
    $content = Get-Content $file.FullName -Raw
    
    # Remove hardcoded manifest
    if ($content -like "*link rel=`"manifest`"*") {
        $content = $content -replace '\s*<link rel="manifest" href="manifest.json">', ""
        
        # Add dynamic manifest loading script in <head>
        if ($content -notlike "*const mLink = document.createElement('link')*") {
            $dynScript = "`r`n  <script>`r`n    if (location.protocol !== 'file:') {`r`n      const mLink = document.createElement('link');`r`n      mLink.rel = 'manifest'; mLink.href = 'manifest.json';`r`n      document.head.appendChild(mLink);`r`n    }`r`n  </script>"
            $content = $content -replace '</head>', "$dynScript`r`n</head>"
            Write-Host "Fixed manifest for $($file.Name)"
        }
    }
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}
