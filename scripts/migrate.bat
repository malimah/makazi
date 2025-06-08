@echo off
set APPWRITE_API_KEY=standard_02e79a2a781f382fdf0dc43d9ecaa4eae70a945cdc89a9150c4b4657d32e93dfac0ac52911109c2528d0830e8a30b062bdcd33480d69cda1832279a54e4ff273da7dfc277206abb0817c4e04fe219977bb39b58d3fb0278f4b82bbefe40f9ba4bbbc951cddc052bb197beec4c711e64c97dc419e913d7ba27aed9572763f5a50
echo Checking API key...

if "%APPWRITE_API_KEY%"=="" (
    echo Error: APPWRITE_API_KEY environment variable is not set.
    echo.
    echo Please set your API key with the following permissions:
    echo - databases.read
    echo - databases.write
    echo - documents.read
    echo - documents.write
    echo.
    echo You can create a new API key in your Appwrite console:
    echo 1. Go to your Appwrite Console
    echo 2. Click on "API Keys" in the left sidebar
    echo 3. Click "Create API Key"
    echo 4. Give it a name like "Migration Key"
    echo 5. Select the permissions listed above
    echo 6. Copy the key and set it in this file
    echo.
    pause
    exit /b 1
)

echo Running migration script...
node scripts/migrate-properties.js
if errorlevel 1 (
    echo.
    echo Migration failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Migration completed successfully!
pause 