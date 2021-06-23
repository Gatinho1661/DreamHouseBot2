@echo off
echo Iniciando bot...
:iniciar
title DreamHouse
CALL npm start
IF %ERRORLEVEL% NEQ 0 goto erro

echo Bot desligado, pressione qualquer tecla para reiniciar...
PAUSE >nul
echo Reiniciando bot...
goto iniciar

:erro
echo Um erro ocorreu, reiniciando bot automaticamente...
goto iniciar