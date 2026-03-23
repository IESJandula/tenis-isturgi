@echo off
color 0A
echo =======================================================
echo          INICIANDO BACKEND (SPRING BOOT)
echo =======================================================
echo.
echo Detectando Java...

setlocal

rem 1) If JAVA_HOME already points to a valid JDK, use it.
if defined JAVA_HOME goto CHECK_JAVA

rem 2) Prefer Microsoft OpenJDK installs (winget: Microsoft.OpenJDK.21).
for /f "delims=" %%D in ('dir /b /ad "C:\Program Files\Microsoft\jdk-*-hotspot" 2^>nul') do set "JAVA_HOME=C:\Program Files\Microsoft\%%D"

rem 3) Fallback: locate javac (usually only present in a JDK).
if not defined JAVA_HOME for /f "delims=" %%J in ('where javac 2^>nul') do for %%I in ("%%J\..\..") do set "JAVA_HOME=%%~fI"

:CHECK_JAVA
if not defined JAVA_HOME goto NO_JDK
if not exist "%JAVA_HOME%\bin\java.exe" goto BAD_JAVA_HOME

echo JAVA_HOME: %JAVA_HOME%
echo.

rem DB credentials for local XAMPP MySQL (read from env if present)
if not defined DB_USER set "DB_USER=root"
if not defined DB_PASSWORD (
	echo.
	echo DB_PASSWORD no esta definida.
	set /p DB_PASSWORD=Introduce la contrasena de MySQL para %DB_USER%: 
)

echo DB_USER: %DB_USER%
echo.

set "PATH=%JAVA_HOME%\bin;%PATH%"
call .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
exit /b %errorlevel%

:NO_JDK
echo.
echo ERROR: No se ha podido detectar un JDK.
echo - Instala Java 21 (JDK) y/o define JAVA_HOME apuntando al JDK.
exit /b 1

:BAD_JAVA_HOME
echo.
echo ERROR: JAVA_HOME no es valido: %JAVA_HOME%
echo - Debe contener bin\java.exe
exit /b 1
