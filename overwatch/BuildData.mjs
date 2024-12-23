import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const data = new Map();

export function Init ()
{
    data.clear();

    data.set('srcJS', '');
    data.set('pathJS', '');
    data.set('info', '');
    data.set('times', []);
    data.set('ready', true);
    data.set('recentExample', null);
    data.set('writeMetaFile', false);
    data.set('liveFolder', process.cwd() + `${path.sep}examples`);
    data.set('filename', '');
    data.set('copyToExamples', false);
}

export async function AddLicense (filePath)
{
    try {
        // Determine root folder
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const rootPath = path.resolve(__dirname, '..'); // Navigate up one directory
        
        // Read license.txt
        const licensePath = path.join(rootPath, 'license.txt');
        const licenseContent = await fs.readFile(licensePath, 'utf8');

        // Read package.json
        const packageJsonPath = path.join(rootPath, 'package.json');
        const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        // Replace placeholders in license
        const version = packageJson.version || 'unknown';
        const buildDate = new Date();
        const friendlyDate = buildDate.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        const modifiedLicense = licenseContent
            .replace('{version}', version)
            .replace('{date}', friendlyDate);

        // Read the target file
        const targetFileContent = await fs.readFile(filePath, 'utf8');

        // Prepend the license to the file content
        const newContent = `${modifiedLicense}\n${targetFileContent}`;

        // Write back to the file
        await fs.writeFile(filePath, newContent, 'utf8');

        // console.log(`License prepended successfully to ${filePath}`);
    }
    catch (error)
    {
        console.error(`Error adding license: ${error.message}`);
    }
}

export function SetCopyToExamples (value = true)
{
    data.set('copyToExamples', value);
}

export function GetCopyToExamples ()
{
    return data.get('copyToExamples');
}

export function SetFilename (filename)
{
    data.set('filename', filename);
}

export function GetFilename ()
{
    return data.get('filename');
}

export function SetBuildPaths (srcJS, pathJS)
{
    data.set('srcJS', srcJS);
    data.set('pathJS', pathJS);
}

export function SetRecentExample (recentExample)
{
    data.set('recentExample', recentExample);
}

export function GetRecentExample ()
{
    return data.get('recentExample');
}

export function GetSrcJS ()
{
    return data.get('srcJS');
}

export function GetPathJS ()
{
    return data.get('pathJS');
}

export function GetOutFile ()
{
    return `${data.get('pathJS')}${data.get('filename')}`;
}

export function GetLiveFolder ()
{
    return data.get('liveFolder');
}

export function IsReady ()
{
    return data.get('ready');
}

export function SetReady ()
{
    data.set('ready', true);
}

export function WriteMetaFile ()
{
    return data.get('writeMetaFile');
}

export function ClearInfo ()
{
    data.set('info', '');
}

export function SetInfo (value)
{
    let current = data.get('info');

    data.set('info', current.concat(value));
}

export function GetInfo ()
{
    return data.get('info');
}

export function StartTimer ()
{
    data.set('times', [ performance.now() ]);
}

export function LogTime (message, skipTime = false)
{
    if (skipTime)
    {
        SetInfo(`${message}\n`);

        StartTimer();

        return;
    }

    const times = data.get('times');

    const startTime = times[times.length - 1];

    let duration = performance.now() - startTime;

    if (duration > 1000)
    {
        duration /= 1000;
        duration = duration.toFixed(2);

        SetInfo(`${message} (${duration} secs)\n`);
    }
    else
    {
        duration = duration.toFixed(4);

        SetInfo(`${message} (${duration} ms)\n`);
    }

    StartTimer();
}

