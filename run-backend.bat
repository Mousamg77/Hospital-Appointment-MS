@echo off
echo ============================================
echo  Hospital Appointment System - Backend Run
echo ============================================
echo.

REM Set JAVA_HOME if not already set
if "%JAVA_HOME%"=="" (
    set JAVA_HOME=C:\Program Files\Java\jdk-23
)
echo Using JAVA_HOME: %JAVA_HOME%
echo.

REM Check if Maven is on PATH
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Maven found! Starting backend...
    mvn spring-boot:run
    goto :end
)

REM Try common Maven locations
set MAVEN_PATHS=C:\Program Files\Apache Software Foundation\Maven\bin;C:\tools\maven\bin;C:\maven\bin;%LOCALAPPDATA%\Programs\Apache\Maven\bin

for %%P in (%MAVEN_PATHS%) do (
    if exist "%%P\mvn.cmd" (
        echo Found Maven at %%P
        set PATH=%%P;%PATH%
        mvn spring-boot:run
        goto :end
    )
)

REM Try JetBrains bundled Maven
for /d %%I in ("C:\Program Files\JetBrains\*") do (
    if exist "%%I\plugins\maven\lib\mvn\bin\mvn.cmd" (
        echo Found JetBrains Maven at %%I
        set PATH=%%I\plugins\maven\lib\mvn\bin;%PATH%
        mvn spring-boot:run
        goto :end
    )
)

echo.
echo ============================================
echo  Maven NOT found! Please do one of:
echo.
echo  Option 1 - Install via winget:
echo    winget install Maven.Maven
echo.
echo  Option 2 - Manual install:
echo    1. Download from https://maven.apache.org/download.cgi
echo    2. Extract to C:\maven
echo    3. Add C:\maven\bin to your System PATH
echo    4. Run this script again
echo.
echo  Option 3 - Open project in IntelliJ IDEA
echo    and run HospitalApplication.java directly
echo ============================================
pause

:end
