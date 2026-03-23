@echo off
color 0A
echo =======================================================
echo          INICIANDO BACKEND (SPRING BOOT)
echo =======================================================
echo.
echo Detectando Java...

for /f "delims=" %%i in ('where java 2^>nul') do set "JAVA_EXE=%%i"
for %%I in ("%JAVA_EXE%\..\..") do set "JAVA_HOME=%%~fI"

echo JAVA_HOME: %JAVA_HOME%
echo.

call .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
