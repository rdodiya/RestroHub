@echo off
setlocal enabledelayedexpansion

title Restroly Local Runner

echo ============================================================
echo            🍽️  RESTROLY LOCAL ENVIRONMENT RUNNER            
echo ============================================================

set "ROOT_DIR=%~dp0"
for %%I in ("%ROOT_DIR%..") do set "ROOT_DIR=%%~fI"
set "ENV_FILE=%ROOT_DIR%\.env.local"
set "FRONTEND_ENV=%ROOT_DIR%\RestroHub-FrontEnd\.env"

:: 1. Auto-detect Java 21
if not defined JAVA_HOME (
    if exist "D:\Software\jdk-21.0.4" (
        set "JAVA_HOME=D:\Software\jdk-21.0.4"
        set "PATH=!JAVA_HOME!\bin;%PATH%"
        echo ✔ Auto-detected JAVA_HOME=D:\Software\jdk-21.0.4
    ) else if exist "C:\Program Files\Java\jdk-21" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21"
        set "PATH=!JAVA_HOME!\bin;%PATH%"
        echo ✔ Auto-detected JAVA_HOME=C:\Program Files\Java\jdk-21
    )
) else (
    echo Current JAVA_HOME is %JAVA_HOME%
    if exist "D:\Software\jdk-21.0.4" (
        echo Overriding JAVA_HOME with Java 21: D:\Software\jdk-21.0.4
        set "JAVA_HOME=D:\Software\jdk-21.0.4"
        set "PATH=!JAVA_HOME!\bin;%PATH%"
    )
)

:: 2. Check existing .env.local
set "RECONFIGURE=false"
if exist "%ENV_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
        set "%%A=%%B"
    )
    echo.
    echo Saved local configuration found in .env.local:
    echo ------------------------------------------------------------
    echo   Database Type : !DB_TYPE!
    echo   Database Host : !DB_HOST!:!DB_PORT!
    echo   Database Name : !DB_NAME!
    echo   Database User : !DB_USERNAME!
    echo   Backend Port  : !SERVER_PORT!
    echo   Frontend Port : !FRONTEND_PORT!
    echo ------------------------------------------------------------
    set /p "USE_SAVED=Use saved configuration? [Y/n]: "
    if "!USE_SAVED!"=="" set "USE_SAVED=Y"
    if /i "!USE_SAVED!"=="n" set "RECONFIGURE=true"
) else (
    set "RECONFIGURE=true"
)

if "!RECONFIGURE!"=="true" (
    echo.
    echo Configuring local environment parameters:
    echo.

    set /p "DB_CHOICE=Database Type [1=MySQL, 2=PostgreSQL] (default: 1): "
    if "!DB_CHOICE!"=="" set "DB_CHOICE=1"

    if "!DB_CHOICE!"=="2" (
        set "DB_TYPE=postgresql"
        set "DEFAULT_PORT=5432"
        set "DEFAULT_USER=postgres"
        set "DEFAULT_PASS=postgres"
    ) else (
        set "DB_TYPE=mysql"
        set "DEFAULT_PORT=3306"
        set "DEFAULT_USER=root"
        set "DEFAULT_PASS=admin@123"
    )

    set /p "INPUT_HOST=Database Host (default: localhost): "
    if "!INPUT_HOST!"=="" set "INPUT_HOST=localhost"
    set "DB_HOST=!INPUT_HOST!"

    set /p "INPUT_PORT=Database Port (default: !DEFAULT_PORT!): "
    if "!INPUT_PORT!"=="" set "INPUT_PORT=!DEFAULT_PORT!"
    set "DB_PORT=!INPUT_PORT!"

    set /p "INPUT_NAME=Database Name (default: RestroHub_DB): "
    if "!INPUT_NAME!"=="" set "INPUT_NAME=RestroHub_DB"
    set "DB_NAME=!INPUT_NAME!"

    set /p "INPUT_USER=Database Username (default: !DEFAULT_USER!): "
    if "!INPUT_USER!"=="" set "INPUT_USER=!DEFAULT_USER!"
    set "DB_USERNAME=!INPUT_USER!"

    set /p "INPUT_PASS=Database Password (default: !DEFAULT_PASS!): "
    if "!INPUT_PASS!"=="" set "INPUT_PASS=!DEFAULT_PASS!"
    set "DB_PASSWORD=!INPUT_PASS!"

    set "DEFAULT_GOOGLE=425243821207-alrvi03ibk7ku4h8chmu53a1malssfud.apps.googleusercontent.com"
    set /p "INPUT_GOOGLE=Google OAuth Client ID (default: !DEFAULT_GOOGLE!): "
    if "!INPUT_GOOGLE!"=="" set "INPUT_GOOGLE=!DEFAULT_GOOGLE!"
    set "GOOGLE_OAUTH_CLIENT_ID=!INPUT_GOOGLE!"

    set /p "INPUT_SERVER_PORT=Backend Server Port (default: 8181): "
    if "!INPUT_SERVER_PORT!"=="" set "INPUT_SERVER_PORT=8181"
    set "SERVER_PORT=!INPUT_SERVER_PORT!"

    set /p "INPUT_FRONTEND_PORT=Frontend Vite Port (default: 3000): "
    if "!INPUT_FRONTEND_PORT!"=="" set "INPUT_FRONTEND_PORT=3000"
    set "FRONTEND_PORT=!INPUT_FRONTEND_PORT!"

    set "DEFAULT_JWT=your-256-bit-secret-key-for-local-development-change-in-prod"
    set /p "INPUT_JWT=JWT Secret (default: !DEFAULT_JWT!): "
    if "!INPUT_JWT!"=="" set "INPUT_JWT=!DEFAULT_JWT!"
    set "JWT_SECRET=!INPUT_JWT!"

    (
        echo # Restroly Local Environment Parameters
        echo DB_TYPE=!DB_TYPE!
        echo DB_HOST=!DB_HOST!
        echo DB_PORT=!DB_PORT!
        echo DB_NAME=!DB_NAME!
        echo DB_USERNAME=!DB_USERNAME!
        echo DB_PASSWORD=!DB_PASSWORD!
        echo GOOGLE_OAUTH_CLIENT_ID=!GOOGLE_OAUTH_CLIENT_ID!
        echo SERVER_PORT=!SERVER_PORT!
        echo FRONTEND_PORT=!FRONTEND_PORT!
        echo JWT_SECRET=!JWT_SECRET!
    ) > "%ENV_FILE%"
    echo ✔ Saved parameters to %ENV_FILE%
)

:: 3. Sync Frontend .env
(
    echo VITE_API_BASE_URL=http://localhost:!SERVER_PORT!/restroly
    echo VITE_GOOGLE_CLIENT_ID=!GOOGLE_OAUTH_CLIENT_ID!
    echo VITE_NODE_ENV=development
) > "%FRONTEND_ENV%"
echo ✔ Synchronized %FRONTEND_ENV%

:: 4. Construct Backend Environment Variables
if "!DB_TYPE!"=="mysql" (
    set "SPRING_DATASOURCE_URL=jdbc:mysql://!DB_HOST!:!DB_PORT!/!DB_NAME!?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    set "DB_DRIVER=com.mysql.cj.jdbc.Driver"
    set "HIBERNATE_DIALECT=org.hibernate.dialect.MySQL8Dialect"
) else (
    set "SPRING_DATASOURCE_URL=jdbc:postgresql://!DB_HOST!:!DB_PORT!/!DB_NAME!"
    set "DB_DRIVER=org.postgresql.Driver"
    set "HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect"
)

set "SPRING_DATASOURCE_DRIVER_CLASS_NAME=!DB_DRIVER!"
set "CORS_ALLOWED_ORIGINS=http://localhost:!FRONTEND_PORT!,http://localhost:5173"
set "SPRING_PROFILES_ACTIVE=dev"

echo ------------------------------------------------------------
echo Starting Restroly stack:
echo   Backend  : http://localhost:!SERVER_PORT!/restroly
echo   Frontend : http://localhost:!FRONTEND_PORT!
echo ------------------------------------------------------------

:: 5. Launch in separate windows
start "Restroly Backend (Spring Boot)" cmd /k "cd /d "%ROOT_DIR%\RestroHub" && gradlew.bat bootRun"
start "Restroly Frontend (Vite)" cmd /k "cd /d "%ROOT_DIR%\RestroHub-FrontEnd" && npm run dev -- --port !FRONTEND_PORT!"

echo Both services launched in separate terminal windows.
pause
