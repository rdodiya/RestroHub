@echo off
setlocal enabledelayedexpansion

title Restroly Backend Deployment to VM

echo ============================================================
echo           🚀 RESTROLY BACKEND DEPLOYMENT TO VM             
echo ============================================================

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\RestroHub"

set "VM_HOST=80.225.219.178"
set "VM_USER=ubuntu"
set "SSH_KEY=C:\Users\DELL\OneDrive\Documents\restroly\restroly-test1-private-ssh-key-2026-03-29.key"
set "PROD_PROPERTIES=C:\Users\DELL\OneDrive\Documents\restroly\prod-application.properties"

echo   Target VM   : %VM_USER%@%VM_HOST%
echo   SSH Key     : %SSH_KEY%
echo   Properties  : %PROD_PROPERTIES%
echo ============================================================

:: 1. Validate files
if not exist "%SSH_KEY%" (
    echo ❌ ERROR: SSH Key not found at "%SSH_KEY%"
    pause
    exit /b 1
)

if not exist "%PROD_PROPERTIES%" (
    echo ❌ ERROR: Properties file not found at "%PROD_PROPERTIES%"
    pause
    exit /b 1
)

:: 2. Auto-detect Java 21
if exist "D:\Software\jdk-21.0.4" (
    set "JAVA_HOME=D:\Software\jdk-21.0.4"
    set "PATH=!JAVA_HOME!\bin;%PATH%"
    echo ✔ Using Java 21: !JAVA_HOME!
) else if exist "C:\Program Files\Java\jdk-21" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    set "PATH=!JAVA_HOME!\bin;%PATH%"
    echo ✔ Using Java 21: !JAVA_HOME!
)

:: 3. Build Backend WAR locally
echo.
echo 🔨 Step 1/5: Building WAR with Gradle (bootWar)...
cd /d "%BACKEND_DIR%"
call gradlew.bat bootWar -x test
if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed! Aborting deployment.
    pause
    exit /b %ERRORLEVEL%
)

set "WAR_FILE=%BACKEND_DIR%\build\libs\restroly-0.0.1-SNAPSHOT.war"
if not exist "!WAR_FILE!" (
    set "WAR_FILE=%BACKEND_DIR%\build\libs\restroly-0.0.1-SNAPSHOT-plain.war"
)

if not exist "!WAR_FILE!" (
    echo ❌ ERROR: WAR file not found in %BACKEND_DIR%\build\libs\
    pause
    exit /b 1
)
echo ✔ Found build artifact: !WAR_FILE!

:: 4. Prepare Server Properties (With Tomcat Logging Fix)
echo.
echo 📝 Step 2/5: Preparing server application-dev.properties...
set "TEMP_PROPS=%BACKEND_DIR%\build\application-dev.properties"
copy /y "%PROD_PROPERTIES%" "!TEMP_PROPS!" >nul

(
    echo.
    echo # ===============================
    echo # Tomcat Logging Configuration
    echo # ===============================
    echo logging.file.path=/opt/tomcat/logs
    echo LOG_PATH=/opt/tomcat/logs
    echo logging.level.com.restroly=INFO
) >> "!TEMP_PROPS!"
echo ✔ Server properties prepared.

:: 5. Remote Backup on VM
echo.
echo 📦 Step 3/5: Creating backup on VM...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "DT=%%I"
set "TIMESTAMP=%DT:~0,8%_%DT:~8,6%"

ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %VM_USER%@%VM_HOST% "mkdir -p /home/ubuntu/bkps/%TIMESTAMP% && sudo cp -r /opt/tomcat/webapps/restroly /home/ubuntu/bkps/%TIMESTAMP/ 2>/dev/null || true"
echo ✔ Backup saved to /home/ubuntu/bkps/%TIMESTAMP%

:: 6. Upload WAR & Properties
echo.
echo 🚀 Step 4/5: Transferring artifacts via SCP...
scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no "!WAR_FILE!" %VM_USER%@%VM_HOST%:/home/ubuntu/restroly.war
scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no "!TEMP_PROPS!" %VM_USER%@%VM_HOST%:/home/ubuntu/application-dev.properties
echo ✔ Transfer complete.

:: 7. Deploy & Restart Tomcat
echo.
echo ⚙️  Step 5/5: Deploying into Tomcat and restarting...
ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %VM_USER%@%VM_HOST% "sudo systemctl stop tomcat && sudo rm -rf /opt/tomcat/webapps/restroly /opt/tomcat/webapps/restroly.war && sudo mkdir -p /opt/tomcat/webapps/restroly && sudo unzip -q /home/ubuntu/restroly.war -d /opt/tomcat/webapps/restroly && sudo cp /home/ubuntu/application-dev.properties /opt/tomcat/webapps/restroly/WEB-INF/classes/application-dev.properties && sudo chown -R tomcat:tomcat /opt/tomcat/webapps/restroly && sudo chmod -R 750 /opt/tomcat/webapps/restroly && sudo systemctl start tomcat"

:: 8. Verification
echo.
echo 🔍 Verifying deployment (waiting 15s for Spring Boot initialization)...
timeout /t 15 /nobreak >nul

ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %VM_USER%@%VM_HOST% "sudo systemctl is-active tomcat; curl -s -I http://localhost:8080/restroly/actuator/health || true; echo '--- Recent Catalina Logs ---'; sudo tail -n 25 /opt/tomcat/logs/catalina.out"

echo.
echo ============================================================
echo           🎉 BACKEND DEPLOYMENT COMPLETED!                 
echo ============================================================
echo   Public Base URL : http://%VM_HOST%:8080/restroly
echo   Swagger UI Docs : http://%VM_HOST%:8080/restroly/swagger-ui.html
echo   Health Endpoint : http://%VM_HOST%:8080/restroly/actuator/health
echo ============================================================
pause
