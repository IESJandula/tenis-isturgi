@echo off
for /f "delims=" %%i in ('where java 2^>nul') do set "JAVA_EXE=%%i"
for %%I in ("%JAVA_EXE%\..\..") do set "JAVA_HOME=%%~fI"
echo JAVA_HOME: %JAVA_HOME%
.\apache-maven-3.9.6\bin\mvn.cmd clean compile
