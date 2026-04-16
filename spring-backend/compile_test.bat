@echo off
set "JAVA_EXE="
for /f "delims=" %%i in ('where java 2^>nul') do (
  if not defined JAVA_EXE set "JAVA_EXE=%%i"
)

if not defined JAVA_EXE (
  echo No se ha encontrado Java en PATH.
  exit /b 1
)

for %%I in ("%JAVA_EXE%\..\..") do set "JAVA_HOME=%%~fI"
echo JAVA_HOME: %JAVA_HOME%
.\apache-maven-3.9.6\bin\mvn.cmd clean compile
