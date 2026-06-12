@echo off
title SignOff by Offhand - serwer lokalny
cd /d "%~dp0"
set PORT=4290
echo.
echo  SignOff by Offhand - uruchamiam...
echo  Aplikacja: http://localhost:4290
echo  (nie zamykaj tego okna, gdy korzystasz z aplikacji)
echo.
start "" http://localhost:4290
node server.js
pause
