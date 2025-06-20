@echo off
set APPWRITE_API_KEY=standard_02e79a2a781f382fdf0dc43d9ecaa4eae70a945cdc89a9150c4b4657d32e93dfac0ac52911109c2528d0830e8a30b062bdcd33480d69cda1832279a54e4ff273da7dfc277206abb0817c4e04fe219977bb39b58d3fb0278f4b82bbefe40f9ba4bbbc951cddc052bb197beec4c711e64c97dc419e913d7ba27aed9572763f5a50

echo Running schema update script...
node scripts/update-schema.js
if errorlevel 1 (
    echo.
    echo Schema update failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Schema updated successfully!
echo You can now run the migration script.
pause 